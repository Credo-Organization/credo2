
# Credify / Credo — Complete Technical Architecture & AI Deep-Dive
*Comprehensive Guide for Viva, Presentation, and Evaluator Q&A (Smart India Hackathon)*

---

## Part 1: High-Level Architecture Overview

Credify is an **AI-orchestrated, cryptographically verified Skill Passport and Opportunity Matching platform**.

Instead of trusting what candidates write on a plain paper resume, Credify evaluates **three layers of hard proof**:
1. **Cryptographic Proof (W3C Verifiable Credentials):** Ed25519-signed digital certificates verified against a decentralized DID registry.
2. **Behavioral Code Proof (GitProof Engine):** A physics-dynamics mathematical engine that analyzes real GitHub commit frequency, pull requests, file changes, and cryptographically signed commits to detect commit farming and bots.
3. **Multi-Model AI Verification & Blind Matching:** An ensemble of multiple independent LLMs (Google Gemini, Grok-2, Meta Llama 3 via OpenRouter/AICredits) that vote on candidate authenticity, extract skills without hallucination, and perform PII-sanitized blind matching.

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 Next.js 15 (Frontend & App)            │
                  │   - Unified Onboarding / Dashboard / Skill Passport    │
                  │   - In-process Next.js AI SDK (Fast extraction/cache)  │
                  └───────────────┬────────────────────────┬───────────────┘
                                  │                        │
                   (Async Jobs & State)       (REST Microservice Call)
                                  │                        │
                                  ▼                        ▼
     ┌──────────────────────────────┐    ┌──────────────────────────────────┐
     │    Supabase (PostgreSQL)     │    │      FastAPI Python Backend      │
     │  - Row Level Security (RLS)  │    │  (Port 8000 / Render Deployment) │
     │  - AES-256-GCM Encrypted     │    ├──────────────────────────────────┤
     │    GitHub OAuth Tokens       │    │ 1. LangGraph State Machine       │
     │  - pgvector (Semantic Search)│    │ 2. GitProof Physics Scoring      │
     │  - match_jobs Queue Table    │    │ 3. W3C Ed25519 VC Verifier       │
     └──────────────────────────────┘    │ 4. Episodic Memory (SQLite)      │
                                         └──────────────────────────────────┘
```

---

## Part 2: The Core Modules Explained Technically

### 1. LangGraph Orchestration Pipeline (`backend/graph.py`)
Instead of a simple linear Python script or single prompt, the matching workflow is a stateful directed acyclic graph built on **LangGraph**.

- **State Schema (`GraphState`):** Passes candidate passport data, job description, GitHub token, verification status, sanitized profile, and match score through strongly typed nodes.
- **Node 1: `verify_git_proof`:** Connects via GitHub API to verify whether the candidate's GitHub repositories match their claims.
- **Node 2: `sanitize_data` (DEI & Blind Matching):** Strips all Personally Identifiable Information (PII) including candidate name, age, gender, college, and photos, assigning a random synthetic identity (`CANDIDATE_101`). Evaluators can never be biased by college pedigree or demographic backgrounds.
- **Node 3: `compute_match`:** Calls an LLM with Pydantic structured output (`MatchResultSchema`), evaluating verified skills against job requirements.
- **Resilience & Fallback:** If the primary LLM gateway is unreachable, it cascades to native Google Gemini, and if internet is completely down, it falls back to an algorithmic heuristic keyword coverage model.

---

### 2. The GitProof Physics Dynamics Scoring Engine (`backend/gitproof/scoring.py`)
Traditional platforms count total commits or stars, which can be easily faked with bot scripts. Credify evaluates GitHub activity using **6 physical laws and mathematical analogues**, summing to a total energy Hamiltonian $E \in [0, 100]$:

1. **Inertial Mass $M$ (Max 30 pts):**
   $$M_{files} = A \cdot (\text{skill\_files})^\alpha \quad (\alpha = 0.60, \text{Pareto distribution})$$
   $$M_{volume} = B \cdot \ln\left(1 + \frac{\text{additions}}{\Omega}\right) \quad (\Omega = 400\text{ LOC, Michaelis-Menten saturation})$$
   *Meaning:* Real repos follow power-law distributions. A candidate cannot inflate mass by simply generating 50,000 blank files because logarithmic saturation damps excessive LOC.

2. **Relativistic Momentum $p$ & Lorentz Burst Damping (Max 25 pts):**
   $$v = \frac{\text{commits}}{\max(\text{days}, 1)}, \quad c = 2.0, \quad \beta = \frac{v}{c}$$
   $$\frac{1}{\gamma} = \sqrt{1 - \beta^2} \quad (\text{Lorentz factor})$$
   $$p = 25 \cdot \tanh\left(\frac{N}{\tau_N}\right) \cdot \frac{1}{\gamma} \cdot \tanh\left(\frac{T}{\tau_T}\right)$$
   *Meaning:* Velocity $v$ is commits per day. $c = 2.0$ acts as the speed of light. If someone dumps 50 commits in one night to fake activity, $\beta \to 1$ and the Lorentz term $\frac{1}{\gamma} \to 0$, destroying their momentum score! Real development requires steady velocity over time.

3. **Boltzmann Shannon Entropy $S$ (Max 15 pts):**
   Models commit arrival timestamps as a Poisson process ($\lambda = \frac{\text{commits}}{\text{days}}$). Calculates the Shannon entropy $H = -\sum P(k) \ln P(k)$.
   *Meaning:* High entropy represents natural, distributed, iterative problem-solving across multiple days. Low entropy represents artificial, robotic bulk uploads.

4. **Carnot Thermodynamic Efficiency $\eta$ (Max 20 pts):**
   $$\eta_{PR} = \frac{\text{merged\_pull\_requests}}{\max(\text{pull\_requests}, 1)}$$
   $$W = W_{max} \cdot \eta_{PR} \cdot \tanh\left(\frac{\text{merged}}{\tau}\right)$$
   *Meaning:* Pull requests act as a heat engine. Submitting PRs that get rejected or abandoned yields near-zero Carnot work. Merged PRs represent high useful thermodynamic work.

5. **Yukawa Integrity Field $\Phi$ (Max 10 pts):**
   $$\Phi(n) = g \cdot \left(1 - e^{-n/\lambda}\right) \quad (g=10, \lambda=4)$$
   *Meaning:* Models GPG-signed, cryptographically verified git commits via a nuclear Yukawa short-range potential. Even 2-4 signed commits establish cryptographic non-repudiation that the commit wasn't authored by someone else.

6. **Stokes Viscous Fork Drag:**
   If a repository is detected as a fork, a viscous drag term caps the maximum score at **70**, preventing candidates from taking credit for someone else's open-source repository.

---

### 3. W3C Ed25519 Verifiable Credential Verifier (`backend/credential_verifier-main/verifier.py`)
Credify supports Pramaan / W3C Decentralized Identity standards:

1. **RFC 8785 Canonical JSON:** JSON keys in untrusted payloads can change order during transmission (`{"name":"A", "id":1}` vs `{"id":1, "name":"A"}`). Credify canonicalizes JSON by sorting keys recursively and enforcing compact separators (`","` and `":"`).
2. **SHA-256 Hashing:** Creates a deterministic 256-bit hash of the payload excluding the `proof` block.
3. **Decentralized Identifier (DID) Resolution:** Resolves the issuer's public key from `verificationMethod` (e.g. `did:pramaan:issuer:iitb#key-1`).
4. **Ed25519 Asymmetric Verification:** Uses Curve25519 Edwards-curve digital signatures (128-bit security level, fast verification, immune to timing side-channels). Any modified letter in the certificate immediately fails signature verification.

---

### 4. Multi-Model AI Ensemble & Anti-Cheat System (`src/lib/ai/` & `src/lib/agents/anti-cheat.ts`)
Instead of trusting a single LLM:
- **Panel of 3 Independent Models:** Simultaneously queries models from different vendors (e.g., Google, xAI Grok, Meta Llama) concurrently via a concurrency limiter.
- **Byzantine Majority Voting (`vote.ts`):** Requires a 2-out-of-3 or 3-out-of-3 consensus. If models tie or fewer than two respond, status resolves to `"pending"` (never an unverified pass).
- **Median Aggregation:** Numeric scores use the median of the winning bloc to prevent extreme outliers from skewing candidate evaluations.
- **Forensic Certificate Checks:** Detects cloned font pixels, generic Canva templates without unique credential IDs, and metadata date mismatches.

---

### 5. Zero-Hallucination Document Extractor (`src/lib/extractor/document-extractor.ts`)
- **Alphanumeric Verbatim Verification (`stripText`):** Every extracted skill snippet must be an exact verbatim substring of the source resume or certificate. If an LLM hallucinates a skill not present in the original document, it is automatically discarded:
  ```ts
  if (!strippedSource.includes(strippedSnippet)) {
    // Hallucination detected -> drop claim immediately!
  }
  ```
- **Semantic SHA-256 Caching:** Documents are hashed (`contentHash = sha256(text + provider + docType)`). Cached extractions are retrieved in milliseconds from Supabase `extraction_cache`, eliminating redundant AI API costs.

---

### 6. pgvector Semantic Opportunity Matcher (`src/lib/vector-store.ts`)
- Converts user career objectives and skill descriptions into 1536-dimensional high-density vector embeddings using `text-embedding-3-small`.
- Queries PostgreSQL using the `pgvector` extension via a custom RPC function `match_job_requirements`.
- Uses Cosine Similarity Distance with an index threshold of 0.3 (equivalent to 70%+ semantic alignment).

---

### 7. Dual-Worker Resilience & Security (`src/app/api/process-match/route.ts`)
- **Service-Role Boundary:** Protected by an internal `WORKER_SECRET` header. Callers without this secret receive `401 Unauthorized`.
- **Fast Failover Architecture:** Next.js attempts to call the Python LangGraph microservice with a 6-second timeout. If the Python container is cold-starting or offline, Next.js falls back seamlessly to its internal Next.js AI SDK matcher model. The user never sees a broken screen.
