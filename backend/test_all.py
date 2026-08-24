import asyncio
import httpx
import json

BASE_URL = "http://127.0.0.1:8000"

async def test_credential_registry(client):
    try:
        print("Testing Credential Registry GET...")
        res = await client.get(f"{BASE_URL}/api/credentials/registry")
        print(f"Registry Status: {res.status_code}")
        return res.json()
    except Exception as e:
        print(f"Registry test failed: {e}")
        return None

async def test_credential_verify(client):
    try:
        print("Testing Credential Verify POST...")
        # Empty credential should return a 400 error cleanly handled by the API
        payload = {"credential": {}}
        res = await client.post(f"{BASE_URL}/api/credentials/verify", json=payload)
        print(f"Verify Status: {res.status_code}")
        return res.json()
    except Exception as e:
        print(f"Verify test failed: {e}")
        return None

async def test_match_evaluate(client):
    try:
        print("Testing Match Evaluate POST...")
        payload = {
            "passport": {"skills": [{"skill_name": "python", "evidence": "github"}]},
            "job_description": "We need a python dev",
            "github_token": "mock-token"
        }
        res = await client.post(f"{BASE_URL}/api/match/evaluate", json=payload)
        print(f"Match Evaluate Status: {res.status_code}")
        return res.json()
    except Exception as e:
        print(f"Match Evaluate test failed: {e}")
        return None

async def test_gitproof_status(client):
    try:
        print("Testing GitProof Status GET...")
        res = await client.get(f"{BASE_URL}/gitproof/api/status")
        print(f"GitProof Status: {res.status_code}")
        return res.json()
    except Exception as e:
        print(f"GitProof Status test failed: {e}")
        return None

async def test_team_synergy(client):
    try:
        print("Testing Team Synergy Match POST...")
        payload = {
            "user_skills": ["Python", "FastAPI", "Docker"],
            "career_goal": "AI Architect"
        }
        res = await client.post(f"{BASE_URL}/api/team/synergy-match", json=payload)
        print(f"Team Synergy Status: {res.status_code}")
        return res.json()
    except Exception as e:
        print(f"Team Synergy test failed: {e}")
        return None

async def main():
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(
            test_credential_registry(client),
            test_credential_verify(client),
            test_match_evaluate(client),
            test_gitproof_status(client),
            test_team_synergy(client),
            return_exceptions=True
        )
        
        print("\n--- RESULTS ---")
        print(f"1. Registry: {results[0]}")
        print(f"2. Verify: {results[1]}")
        print(f"3. Match Evaluate: {results[2]}")
        print(f"4. GitProof Status: {results[3]}")
        print(f"5. Team Synergy: {results[4]}")

if __name__ == "__main__":
    asyncio.run(main())
