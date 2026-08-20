# Memory.md - Module 3: Credential Verifier

## 1. Input JSON Schema (Expected Payload)
The Credential Verifier expects a JSON-serializable payload containing issuer details, claims, and a signature proof:

```json
{
  "id": "string (UUID or URI)",
  "type": ["string"],
  "issuer": "string (DID, e.g., did:web:example.edu)",
  "issuanceDate": "string (ISO 8601 datetime)",
  "credentialSubject": {
    "student_id": "string",
    "name": "string",
    "skills": [
      {
        "skill": "string",
        "level": "string",
        "evidence": "string (URL)"
      }
    ],
    "gpa": "string"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "string (ISO 8601 datetime)",
    "verificationMethod": "string (DID verification key URI, e.g., did:web:example.edu#key-1)",
    "proofValue": "string (hex-encoded Ed25519 signature)"
  }
}
```

## 2. Output Dictionary Schema (Returned to Pipeline)
The verification output is a dictionary parsed by the downstream Evidence Grader (Module 6):

```json
{
  "status": "VERIFIED" | "FAILED",
  "issuer": "string (DID of the issuer)",
  "tampered": true | false,
  "reason": "string (included only if status is FAILED)"
}
```

## 3. Cryptographic Verification Logic
- **Canonicalization**: The `"proof"` field is stripped from the payload. The rest of the payload is serialized deterministically to bytes using `json.dumps(..., sort_keys=True, separators=(',', ':')).encode('utf-8')`.
- **Hashing**: A SHA-256 hash is computed from the canonicalized bytes.
- **DID Lookup**: The `verificationMethod` from the proof is resolved against a local registry (`mock_registry.json`) simulating a `.well-known/did.json` resolver to retrieve the public key.
- **Signature Validation**: The retrieved public key is used to mathematically verify that the hex-decoded signature in `proofValue` was signed over the computed SHA-256 hash.

## 4. Components & Verification Files
- `verifier.py`: Core verification engine containing `verify_credential`.
- `mock_issuer.py`: Script to generate keypairs, sign sample data, and update `mock_registry.json`.
- `mock_registry.json`: Simulated DID registry document mapping key URIs to public keys.
- `test_verifier.py`: Test runner containing test cases for success, tampering, invalid signatures, and unknown issuers.
