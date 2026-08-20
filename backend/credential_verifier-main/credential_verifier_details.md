# Credential Verifier Architecture Breakdown

This document provides a deep-dive technical explanation of how modern, cryptographically secure digital credentials (like Verifiable Credentials) are issued and verified. It focuses on three core pillars: **Ed25519 Signatures**, the **Issuer Registry**, and **Tamper Detection mechanisms**.

---

## 1. Ed25519 Signatures: The Cryptographic Foundation

When an institution (like a university or a certification authority) issues a digital credential, they need a way to prove they issued it without requiring a live database connection for every verification. This is solved using public-key cryptography, specifically **Ed25519**.

### What is Ed25519?
Ed25519 is an elliptic curve digital signature algorithm (EdDSA). It is the modern standard for digital signatures because it offers:
- **Speed:** It is exceptionally fast for both signing and verifying.
- **Security:** It is immune to many side-channel attacks (like timing attacks) that plague older algorithms like RSA or ECDSA.
- **Small Size:** The signatures are only 64 bytes, and public keys are 32 bytes, making it highly efficient for JSON payloads or QR codes.

### How it works in the credential lifecycle:
1. **Key Generation:** The Issuer generates a Key Pair: a **Private Key** (a secret scalar) and a **Public Key** (a point on the elliptic curve derived from the private key).
2. **Signing:** When issuing a certificate, the issuer hashes the JSON data. They then use their **Private Key** and a unique cryptographic nonce to compute a mathematical proof (the Signature) over that hash. Unlike older RSA schemes, Ed25519 does *not* "encrypt" the hash; it generates an elliptic curve equation solution that ties the specific data to the private key.
3. **Verification:** The verifier uses the Issuer's **Public Key**, the original JSON data, and the Signature to evaluate an elliptic curve equation. If the equation balances mathematically, the verifier knows with absolute certainty that the owner of the private key signed that exact data.

---

## 2. Issuer Registry: Establishing Trust

A cryptographic signature proves that *a* private key signed the data, but it doesn't prove *who* owns that private key. If a malicious actor generates their own Ed25519 key pair, they could sign a fake "Harvard Degree". How does the verifier know the public key doesn't actually belong to Harvard? 

This is solved by the **Issuer Registry** (often implemented using Decentralized Identifiers, or DIDs).

### Mechanisms of Trust
Instead of hardcoding public keys, verifiers rely on a registry.
- **DID Web (Decentralized Identifier via Web):** Harvard hosts a file at `https://harvard.edu/.well-known/did.json`. This file contains Harvard's official Ed25519 **Public Key**. Because DNS secures the `harvard.edu` domain, the verifier trusts that the public key in that file actually belongs to Harvard.
- **Blockchain/Ledger Registries (DID:ION, DID:Indy):** For higher security and persistence, issuers anchor their public keys to a blockchain. The credential payload contains an Issuer ID (e.g., `did:ion:12345...`). The verifier looks up this ID on the ledger, retrieves the public key, and verifies the signature.

### The Verification Flow
1. The credential JSON says: `issuer: "did:web:harvard.edu"`.
2. The verifier software automatically makes an HTTP request to Harvard's domain to fetch their public key.
3. The verifier uses that public key to check the Ed25519 signature on the credential.

---

## 3. Tamper Detection: Ensuring Immutability

A digital credential is just data (usually a JSON file). What stops a student from opening the JSON file, changing their GPA from `2.5` to `4.0`, and saving it?

This is prevented through **Tamper Detection** using Cryptographic Hashing and Signature binding.

### The Mechanics of Hashing
Before the Issuer signs the credential, the entire data payload is run through a hashing function (usually **SHA-256**). 
- A hash function takes any amount of data and turns it into a fixed-length string of characters (e.g., `a1b2c3d4...`).
- The most critical property of SHA-256 is the **Avalanche Effect**: if you change even a single character in the JSON (like changing `2.5` to `4.0`), the resulting hash completely and unpredictably changes.

### How Tamper Detection works in practice:
Modern credentials use standards like **JSON Web Signatures (JWS)** or **Data Integrity Proofs**. 
1. The verifier receives the credential and separates the raw data (the payload) from the signature.
2. The verifier runs the raw data through the exact same SHA-256 algorithm that the issuer used.
3. The verifier gets a resulting Hash (Hash A).
4. The verifier uses the Issuer's Public Key (from the registry) to decrypt the Ed25519 Signature, revealing the Hash the issuer originally calculated (Hash B).
5. **The Tamper Check:** The verifier compares Hash A and Hash B.
   - If `Hash A === Hash B`, the document is mathematically proven to be exactly as the issuer left it.
   - If the student changed their GPA, Hash A will look completely different from Hash B. The signature breaks, the verification fails, and the credential is flagged as **Tampered/Invalid**.

### Anti-Replay / Revocation
Even if the data isn't tampered with, what if the credential was revoked?
Verifiers also check a `credentialStatus` field inside the JSON. This points to a Revocation Registry (like a bitstring list hosted by the issuer). The verifier checks if the credential's unique ID has been marked as revoked since it was issued.
