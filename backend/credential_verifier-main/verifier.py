# verifier.py
import json
import hashlib
import os
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mock_registry.json")

def canonicalize_and_hash(payload: dict) -> tuple[bytes, bytes]:
    """
    Canonicalizes the payload (sans proof) and returns its canonical UTF-8 bytes and SHA-256 hash.
    """
    # Create a copy and remove proof
    data = payload.copy()
    data.pop("proof", None)
    
    # Canonicalize JSON using sorted keys and compact separators
    canonical_str = json.dumps(data, sort_keys=True, separators=(",", ":"))
    canonical_bytes = canonical_str.encode("utf-8")
    
    # Calculate SHA-256 hash
    sha256_hash = hashlib.sha256(canonical_bytes).digest()
    return canonical_bytes, sha256_hash

def resolve_did_public_key(verification_method: str) -> ed25519.Ed25519PublicKey:
    """
    Simulates a DID resolver. Retrieves the public key from the local registry
    by mapping the verificationMethod to its public key hex.
    """
    if not os.path.exists(REGISTRY_PATH):
        raise ValueError("Issuer DID registry not found.")
        
    with open(REGISTRY_PATH, "r") as f:
        registry = json.load(f)
        
    if verification_method not in registry:
        raise KeyError(f"Verification method '{verification_method}' not registered.")
        
    entry = registry[verification_method]
    pub_hex = entry.get("publicKeyHex")
    if not pub_hex:
        raise ValueError(f"No public key hex found for verification method '{verification_method}'")
        
    pub_bytes = bytes.fromhex(pub_hex)
    return ed25519.Ed25519PublicKey.from_public_bytes(pub_bytes)

def verify_credential(payload: dict) -> dict:
    """
    Sequential verification entrypoint for Module 3:
    1. Tamper Detection (Canonicalize + SHA-256 Hash comparison)
    2. Issuer Registry Lookup (Retrieve public key for verificationMethod)
    3. Ed25519 Signature Validation
    
    Returns a deterministic dictionary:
    {
        "status": "VERIFIED" | "FAILED",
        "issuer": "string",
        "tampered": bool,
        "reason": "string (optional)"
    }
    """
    issuer = payload.get("issuer", "UNKNOWN")
    
    # 1. Extract proof structure
    proof = payload.get("proof")
    if not proof:
        return {
            "status": "FAILED",
            "issuer": issuer,
            "tampered": False,
            "reason": "Missing proof block in credential payload"
        }
        
    verification_method = proof.get("verificationMethod")
    if not verification_method:
        return {
            "status": "FAILED",
            "issuer": issuer,
            "tampered": False,
            "reason": "Missing verificationMethod in proof block"
        }
        
    signature_hex = proof.get("proofValue")
    if not signature_hex:
        return {
            "status": "FAILED",
            "issuer": issuer,
            "tampered": False,
            "reason": "Missing proofValue (signature) in proof block"
        }
        
    # 2. Resolve the public key from the registry
    try:
        public_key = resolve_did_public_key(verification_method)
    except KeyError as e:
        return {
            "status": "FAILED",
            "issuer": issuer,
            "tampered": False,
            "reason": str(e)
        }
    except Exception as e:
        return {
            "status": "FAILED",
            "issuer": issuer,
            "tampered": False,
            "reason": f"Failed to resolve verification method public key: {str(e)}"
        }
        
    # 3. Canonicalize and Hash raw payload
    try:
        _, sha256_hash = canonicalize_and_hash(payload)
    except Exception as e:
        return {
            "status": "FAILED",
            "issuer": issuer,
            "tampered": False,
            "reason": f"Failed to canonicalize payload: {str(e)}"
        }
        
    # 4. Mathematically verify Ed25519 signature
    try:
        signature_bytes = bytes.fromhex(signature_hex)
        public_key.verify(signature_bytes, sha256_hash)
        
        return {
            "status": "VERIFIED",
            "issuer": issuer,
            "tampered": False
        }
    except InvalidSignature:
        return {
            "status": "FAILED",
            "issuer": issuer,
            "tampered": True,
            "reason": "Cryptographic signature validation failed. Payload has been tampered with or signature is invalid."
        }
    except Exception as e:
        return {
            "status": "FAILED",
            "issuer": issuer,
            "tampered": True,
            "reason": f"Signature verification error (possible hex parsing or length issue): {str(e)}"
        }
