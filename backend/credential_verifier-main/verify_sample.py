# verify_sample.py
import json
import os
import sys

# Ensure current folder is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verifier import verify_credential

def main():
    cred_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_signed_credential.json")
    # 1. Load the generated signed credential
    with open(cred_path, "r") as f:
        credential = json.load(f)

        
    print("--------------------------------------------------")
    print("Loading test_signed_credential.json...")
    print("--------------------------------------------------")
    
    # 2. Verify authentic credential
    print("Verifying authentic credential...")
    result_valid = verify_credential(credential)
    print(f"Verification Result:\n{json.dumps(result_valid, indent=2)}")
    
    # 3. Tamper with the GPA
    print("\n--------------------------------------------------")
    print("Modifying student GPA from 3.85 to 4.00 (Tampering)...")
    print("--------------------------------------------------")
    credential["credentialSubject"]["gpa"] = "4.00"
    
    # 4. Verify tampered credential
    print("Verifying tampered credential...")
    result_tampered = verify_credential(credential)
    print(f"Verification Result:\n{json.dumps(result_tampered, indent=2)}")

if __name__ == "__main__":
    main()
