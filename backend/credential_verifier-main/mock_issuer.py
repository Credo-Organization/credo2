# mock_issuer.py
import json
import hashlib
import os
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

REGISTRY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mock_registry.json")

def generate_keypair():
    """Generates an Ed25519 private key and public key."""
    private_key = ed25519.Ed25519PrivateKey.generate()
    public_key = private_key.public_key()
    return private_key, public_key

def register_issuer_public_key(verification_method: str, public_key: ed25519.Ed25519PublicKey):
    """Saves the public key to a mock registry JSON to simulate a DID registry."""
    # Get public bytes in raw format (32 bytes)
    pub_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )
    pub_hex = pub_bytes.hex()
    
    # Load existing registry
    if os.path.exists(REGISTRY_PATH):
        try:
            with open(REGISTRY_PATH, "r") as f:
                registry = json.load(f)
        except Exception:
            registry = {}
    else:
        registry = {}
        
    # Register the public key
    registry[verification_method] = {
        "publicKeyHex": pub_hex,
        "type": "Ed25519VerificationKey2020"
    }
    
    with open(REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=2)

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

def sign_credential(payload: dict, private_key: ed25519.Ed25519PrivateKey, verification_method: str) -> dict:
    """Signs the canonicalized hash of the payload and appends the proof block."""
    _, sha256_hash = canonicalize_and_hash(payload)
    
    # Sign the SHA-256 hash directly
    signature = private_key.sign(sha256_hash)
    signature_hex = signature.hex()
    
    signed_payload = payload.copy()
    signed_payload["proof"] = {
        "type": "Ed25519Signature2020",
        "created": "2026-08-20T12:05:00Z",
        "verificationMethod": verification_method,
        "proofValue": signature_hex
    }
    return signed_payload

if __name__ == "__main__":
    # Example execution:
    # 1. Generate keys
    priv, pub = generate_keypair()
    
    # 2. Register verification method
    did_key = "did:web:hackathon.university.edu#key-1"
    register_issuer_public_key(did_key, pub)
    print(f"Registered public key for {did_key} in mock_registry.json")
    
    # 3. Create a test credential payload
    credential = {
        "id": "urn:uuid:5c92842c-a281-4b13-bb13-f938f36c5db6",
        "type": ["VerifiableCredential", "SkillPassportCredential"],
        "issuer": "did:web:hackathon.university.edu",
        "issuanceDate": "2026-08-20T12:00:00Z",
        "credentialSubject": {
            "student_id": "student-456",
            "name": "Alex Johnson",
            "skills": [
                {
                    "skill": "Python Backend Development",
                    "level": "Expert",
                    "evidence": "https://github.com/alexj/hackathon-win"
                }
            ],
            "gpa": "3.85"
        }
    }
    
    # 4. Sign and print the final signed credential JSON
    signed_cred = sign_credential(credential, priv, did_key)
    print("\nSigned Credential JSON:")
    print(json.dumps(signed_cred, indent=2))
    
    # Save a copy as test_signed_credential.json
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_signed_credential.json")
    with open(out_path, "w") as f:
        json.dump(signed_cred, f, indent=2)
    print(f"\nSaved signed credential to {out_path}")

