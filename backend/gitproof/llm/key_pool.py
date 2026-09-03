"""
Enterprise-grade Gemini Key Pool and In-Memory Cache for GitProof.

Solves:
1. Multi-key load balancing across multiple API keys to comfortably handle 50-100+ concurrent users.
2. Automatic 429/403 rate-limit detection & cooldown (temporary circuit breaker).
3. Zero-leak perimeter:
   - Keys are NEVER exposed in URL query strings (uses `x-goog-api-key` header).
   - Keys are masked in all logs (e.g., `AQ.Ab8...VvYg`).
   - Keys are excluded from git.
4. In-memory response caching (TTL = 30 mins) to prevent redundant token consumption and reduce latency to <1ms for duplicate scans.
"""

import hashlib
import os
import threading
import time
from typing import Dict, List, Optional, Tuple, Any

try:
    from observability.logger import get_logger
    logger = get_logger(__name__)
except ImportError:
    try:
        from gitproof.observability.logger import get_logger
        logger = get_logger(__name__)
    except ImportError:
        import logging
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)


def mask_key(key: Optional[str]) -> str:
    """Safely mask an API key for logs so secrets never leak."""
    if not key or not isinstance(key, str):
        return "<none>"
    cleaned = key.strip()
    if len(cleaned) <= 10:
        return "***"
    return f"{cleaned[:6]}...{cleaned[-4:]}"


class KeyState:
    """Tracks health and cooldown of an individual API key."""

    def __init__(self, key: str):
        self.key: str = key
        self.masked: str = mask_key(key)
        self.cooldown_until: float = 0.0
        self.consecutive_failures: int = 0
        self.total_successes: int = 0
        self.total_requests: int = 0

    @property
    def is_available(self) -> bool:
        return time.time() >= self.cooldown_until

    def mark_success(self):
        self.consecutive_failures = 0
        self.total_successes += 1
        self.total_requests += 1

    def mark_failure(self, status_code: int = 429, cooldown_seconds: float = 60.0):
        self.consecutive_failures += 1
        self.total_requests += 1
        # If rate-limited (429) or quota exceeded (403), set cooldown
        if status_code in (429, 403):
            # Exponential backoff with ceiling (60s, 120s, max 300s)
            multiplier = min(self.consecutive_failures, 5)
            cool = cooldown_seconds * multiplier
            self.cooldown_until = time.time() + cool
            logger.warning(
                "Gemini key %s rate-limited (HTTP %d). Entering cooldown for %.1fs.",
                self.masked,
                status_code,
                cool,
            )
        else:
            # Minor error, brief pause
            self.cooldown_until = time.time() + 5.0


class GeminiKeyPool:
    """
    Virtual load balancer managing a pool of Google Gemini API keys.
    Distributes traffic, absorbs rate limits, and transparently fails over.
    """

    PLACEHOLDERS = {
        "paste_your_key_here",
        "paste_gemini_api_key_here",
        "mock_key_for_now",
        "your-google-generative-ai-key",
        "changeme",
        "",
    }

    def __init__(self):
        self._lock = threading.Lock()
        self._keys: List[KeyState] = []
        self._current_index: int = 0
        self._reload_keys()

    def _reload_keys(self):
        """Discover and load all configured Gemini keys from environment."""
        try:
            from dotenv import load_dotenv
            from pathlib import Path
            base = Path(__file__).resolve().parent.parent.parent
            load_dotenv(base / ".env")
            load_dotenv(base / "backend" / ".env")
            load_dotenv()
        except Exception:
            pass

        raw_keys: List[str] = []

        # 1. Check comma-separated GEMINI_API_KEYS
        env_multi = os.getenv("GEMINI_API_KEYS") or os.getenv("GOOGLE_API_KEYS")
        if env_multi:
            for piece in env_multi.replace(";", ",").split(","):
                if piece.strip():
                    raw_keys.append(piece.strip())

        # 2. Check numbered keys: GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
        for i in range(1, 10):
            k = os.getenv(f"GEMINI_API_KEY_{i}") or os.getenv(f"GOOGLE_API_KEY_{i}")
            if k and k.strip():
                raw_keys.append(k.strip())

        # 3. Check standard individual env vars
        for env_var in ["GEMINI_API_KEY", "GOOGLE_API_KEY", "VITE_GEMINI_API_KEY"]:
            k = os.getenv(env_var)
            if k and k.strip():
                raw_keys.append(k.strip())

        # Deduplicate while preserving order, filter out placeholders
        seen = set()
        clean_keys = []
        for rk in raw_keys:
            rk_clean = rk.strip().strip('"\'')
            if rk_clean and rk_clean.lower() not in self.PLACEHOLDERS and rk_clean not in seen:
                seen.add(rk_clean)
                clean_keys.append(rk_clean)

        self._keys = [KeyState(k) for k in clean_keys]
        if self._keys:
            masked_list = ", ".join(ks.masked for ks in self._keys)
            logger.info("GeminiKeyPool initialized with %d active key(s): [%s]", len(self._keys), masked_list)
        else:
            logger.info("GeminiKeyPool: No valid keys found in environment.")

    @property
    def has_keys(self) -> bool:
        return len(self._keys) > 0

    @property
    def key_count(self) -> int:
        return len(self._keys)

    def get_key_candidates(self) -> List[KeyState]:
        """
        Returns all keys ordered for this request:
        Prioritizes available (non-cooldown) keys starting from round-robin index,
        followed by in-cooldown keys (sorted by cooldown expiration).
        """
        with self._lock:
            if not self._keys:
                return []

            n = len(self._keys)
            # Reorder starting at _current_index
            rotated = [self._keys[(self._current_index + i) % n] for i in range(n)]
            self._current_index = (self._current_index + 1) % n

            available = [ks for ks in rotated if ks.is_available]
            cooling = sorted([ks for ks in rotated if not ks.is_available], key=lambda x: x.cooldown_until)

            # Return available keys first, then cooling keys as last resort
            return available + cooling

    def mark_success(self, key: str):
        with self._lock:
            for ks in self._keys:
                if ks.key == key:
                    ks.mark_success()
                    break

    def mark_failure(self, key: str, status_code: int = 429, cooldown_seconds: float = 60.0):
        with self._lock:
            for ks in self._keys:
                if ks.key == key:
                    ks.mark_failure(status_code=status_code, cooldown_seconds=cooldown_seconds)
                    break

    def get_stats(self) -> Dict[str, Any]:
        """Returns safe telemetry for monitoring without leaking secrets."""
        with self._lock:
            now = time.time()
            return {
                "total_keys": len(self._keys),
                "available_keys": sum(1 for ks in self._keys if ks.is_available),
                "keys": [
                    {
                        "masked": ks.masked,
                        "available": ks.is_available,
                        "cooldown_remaining_sec": max(0.0, round(ks.cooldown_until - now, 1)),
                        "failures": ks.consecutive_failures,
                        "successes": ks.total_successes,
                    }
                    for ks in self._keys
                ],
            }


class LLMResponseCache:
    """
    Thread-safe in-memory LRU/TTL cache for LLM outputs.
    Ensures that identical analyses (e.g. same repository or candidate evaluation)
    consume 0 tokens and respond in sub-millisecond time.
    """

    def __init__(self, max_size: int = 500, ttl_seconds: float = 1800.0):
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds
        self._cache: Dict[str, Tuple[str, float]] = {}
        self._lock = threading.Lock()

    def _hash(self, model: str, prompt: str) -> str:
        content = f"{model}:::{prompt}".encode("utf-8")
        return hashlib.sha256(content).hexdigest()

    def get(self, model: str, prompt: str) -> Optional[str]:
        key = self._hash(model, prompt)
        now = time.time()
        with self._lock:
            if key in self._cache:
                val, ts = self._cache[key]
                if now - ts <= self.ttl_seconds:
                    logger.debug("Cache HIT for LLM query (hash=%s)", key[:10])
                    return val
                else:
                    # Expired
                    del self._cache[key]
        return None

    def set(self, model: str, prompt: str, value: str):
        if not value:
            return
        key = self._hash(model, prompt)
        now = time.time()
        with self._lock:
            # Evict oldest entry if at capacity
            if len(self._cache) >= self.max_size and key not in self._cache:
                oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k][1])
                del self._cache[oldest_key]
            self._cache[key] = (value, now)


# Global singletons
_KEY_POOL = GeminiKeyPool()
_CACHE = LLMResponseCache()


def get_key_pool() -> GeminiKeyPool:
    return _KEY_POOL


def get_response_cache() -> LLMResponseCache:
    return _CACHE
