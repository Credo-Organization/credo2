# Module 3: Credential Verifier

This module acts as a trustless cryptographic gatekeeper for a highly secure, verifiable skill passport platform. It is designed to run sequentially as part of a pipeline, verifying academic and professional credentials using elliptic curve signatures (Ed25519) and decentralized identifiers (DIDs) before they are passed down to the grading and matching stages.

---

## Core Pillars of Verification

1. **Tamper Detection (SHA-256 Hashing)**
   - The verifier removes the `proof` object from the JSON credential payload.
   - It canonicalizes the remaining payload to deterministic UTF-8 bytes (using sorted keys and compact separators).
   - A SHA-256 hash is computed over these canonicalized bytes. Any alteration to the data will instantly break the signature match due to the avalanche effect.

2. **Issuer Registry (DID) Lookup**
   - The verifier extracts the `verificationMethod` URI (e.g., `did:web:hackathon.university.edu#key-1`) from the proof.
   - It resolves this verification method against a local registry (`mock_registry.json`) representing a trusted registry of Decentralized Identifiers (DIDs) to retrieve the official public key.

3. **Ed25519 Signature Validation**
   - Using the retrieved Ed25519 public key, the verifier mathematically checks the signature (`proofValue`) against the computed SHA-256 hash of the canonicalized payload.

---

## File Layout

- [verifier.py](file:///a:/GitHub/credential_verifier/verifier.py): Core module containing the entrypoint `verify_credential(payload)`.
- [mock_issuer.py](file:///a:/GitHub/credential_verifier/mock_issuer.py): Generates Ed25519 keypairs, updates the mock registry, and signs credential payloads.
- [mock_registry.json](file:///a:/GitHub/credential_verifier/mock_registry.json): Mock DID registry mapping key URIs to public keys.
- [Memory.md](file:///a:/GitHub/credential_verifier/Memory.md): The project's active state specification containing input/output schemas.
- [test_verifier.py](file:///a:/GitHub/credential_verifier/test_verifier.py): Automated test runner containing four core test cases.
- [verify_sample.py](file:///a:/GitHub/credential_verifier/verify_sample.py): A quick demo showing verification of a valid credential vs. a tampered one.

---

## Setup & Execution

### Prerequisites
- Python 3.9+
- Python `cryptography` library installed:
  ```bash
  pip install cryptography
  ```

### Running the Test Suite
To execute the test suite validating successful verification, tamper detection, invalid signature detection, and unknown registry lookup:
```bash
python test_verifier.py
```

### Running the Demo
To generate a mock signed credential file (`test_signed_credential.json`) and run a live verification check:
```bash
# 1. Generate & Sign Mock Credential
python mock_issuer.py

# 2. Run Verification Demonstration
python verify_sample.py
```
