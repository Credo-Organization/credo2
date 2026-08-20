# test_verifier.py
import json
import sys
from mock_issuer import generate_keypair, register_issuer_public_key, sign_credential
from verifier import verify_credential

def run_tests():
    print("==================================================")
    print("Running Credential Verifier (Module 3) Unit Tests")
    print("==================================================")
    
    # Setup test issuer keys
    priv_key, pub_key = generate_keypair()
    did_key = "did:web:hackathon.university.edu#key-1"
    register_issuer_public_key(did_key, pub_key)
    
    # Base Payload
    base_payload = {
        "id": "urn:uuid:11111111-2222-3333-4444-555555555555",
        "type": ["VerifiableCredential", "SkillPassportCredential"],
        "issuer": "did:web:hackathon.university.edu",
        "issuanceDate": "2026-08-20T12:00:00Z",
        "credentialSubject": {
            "student_id": "student-789",
            "name": "Jordan Smith",
            "skills": [
                {"skill": "Cryptographic Protocols", "level": "Intermediate", "evidence": "https://github.com/jordans/crypto"}
            ],
            "gpa": "3.90"
        }
    }
    
    # Create signed credential payload
    signed_credential = sign_credential(base_payload, priv_key, did_key)
    
    # ----------------------------------------------------
    # Case 1: Successful Verification of Valid Payload
    # ----------------------------------------------------
    print("\n[TEST 1] Verifying valid, untampered credential...")
    res = verify_credential(signed_credential)
    print(f"Result: {json.dumps(res, indent=2)}")
    assert res["status"] == "VERIFIED", "Test 1 Failed: Expected VERIFIED"
    assert res["tampered"] is False, "Test 1 Failed: Expected tampered to be False"
    print("=> SUCCESS")
    
    # ----------------------------------------------------
    # Case 2: Tamper Detection (GPA modified)
    # ----------------------------------------------------
    print("\n[TEST 2] Verifying credential with tampered payload (GPA changed)...")
    tampered_credential = json.loads(json.dumps(signed_credential)) # deep copy
    tampered_credential["credentialSubject"]["gpa"] = "4.00"
    
    res = verify_credential(tampered_credential)
    print(f"Result: {json.dumps(res, indent=2)}")
    assert res["status"] == "FAILED", "Test 2 Failed: Expected FAILED"
    assert res["tampered"] is True, "Test 2 Failed: Expected tampered to be True"
    assert "tampered" in res["reason"].lower() or "signature" in res["reason"].lower(), "Test 2 Failed: Reason should indicate tamper/signature issue"
    print("=> SUCCESS")
    
    # ----------------------------------------------------
    # Case 3: Invalid/Modified Signature Detection
    # ----------------------------------------------------
    print("\n[TEST 3] Verifying credential with altered signature...")
    invalid_sig_credential = json.loads(json.dumps(signed_credential))
    orig_sig = invalid_sig_credential["proof"]["proofValue"]
    
    # Swap last characters of signature to make it invalid but keep length and hex format intact
    altered_char = "0" if orig_sig[-1] != "0" else "1"
    invalid_sig_credential["proof"]["proofValue"] = orig_sig[:-1] + altered_char
    
    res = verify_credential(invalid_sig_credential)
    print(f"Result: {json.dumps(res, indent=2)}")
    assert res["status"] == "FAILED", "Test 3 Failed: Expected FAILED"
    assert res["tampered"] is True, "Test 3 Failed: Expected tampered to be True for invalid signature"
    print("=> SUCCESS")
    
    # ----------------------------------------------------
    # Case 4: Unknown / Unregistered Issuer DID
    # ----------------------------------------------------
    print("\n[TEST 4] Verifying credential with unregistered verificationMethod...")
    unregistered_credential = json.loads(json.dumps(signed_credential))
    unregistered_credential["proof"]["verificationMethod"] = "did:web:unknown.edu#key-1"
    
    res = verify_credential(unregistered_credential)
    print(f"Result: {json.dumps(res, indent=2)}")
    assert res["status"] == "FAILED", "Test 4 Failed: Expected FAILED"
    assert res["tampered"] is False, "Test 4 Failed: Expected tampered to be False for lookup failure"
    assert "not registered" in res["reason"].lower(), "Test 4 Failed: Reason should indicate lookup failure"
    print("=> SUCCESS")
    
    print("\n==================================================")
    print("ALL TESTS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    try:
        run_tests()
    except AssertionError as e:
        print(f"\nAssertion Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected Exception: {e}", file=sys.stderr)
        sys.exit(1)
