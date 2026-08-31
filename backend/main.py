import os
import sys
from typing import Optional, Any
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Add gitproof and credential_verifier directories to sys.path so submodules resolve properly
gitproof_dir = str(Path(__file__).parent / "gitproof")
verifier_dir = str(Path(__file__).parent / "credential_verifier-main")

for p in [gitproof_dir, verifier_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel, Field
from graph import app_graph
from gitproof.app import app as gitproof_app
import json

try:
    from verifier import verify_credential, REGISTRY_PATH
except ImportError:
    import importlib.util
    spec = importlib.util.spec_from_file_location("verifier", Path(verifier_dir) / "verifier.py")
    if spec is None or spec.loader is None:
        raise ImportError("Could not load verifier module spec")
    verifier_mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(verifier_mod)
    verify_credential = verifier_mod.verify_credential
    REGISTRY_PATH = verifier_mod.REGISTRY_PATH

app = FastAPI(title="SIH AI Orchestration, GitProof & Credential Verifier API", version="2.0.0")

SESSION_SECRET = os.getenv("SESSION_SECRET", "dev-secret-change-me")
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET, same_site="lax")

# Allow requests from the Next.js frontend
# "*" combined with allow_credentials=True is both unsafe and self-defeating:
# browsers reject a wildcard origin on credentialed requests, so the wildcard
# bought nothing while advertising the API to every site. Origins now come from
# ALLOWED_ORIGINS (comma separated) and fall back to local development only.
_default_origins = "http://localhost:3000,http://127.0.0.1:3000"
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")
    if o.strip() and o.strip() != "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

class PassportInput(BaseModel):
    skills: list[dict] | None = Field(default_factory=list)
    
    class Config:
        extra = "allow"

class EvaluateRequest(BaseModel):
    passport: PassportInput
    job_description: str
    github_token: str | None = None

class VerifyCredentialRequest(BaseModel):
    credential: dict

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "FastAPI + LangGraph + GitProof + Credential Verifier backend is running.",
        "services": {
            "orchestration_match": "/api/match/evaluate",
            "credential_verify": "/api/credentials/verify",
            "credential_registry": "/api/credentials/registry",
            "gitproof_subapp": "/gitproof",
            "gitproof_status": "/gitproof/api/status"
        }
    }

@app.post("/api/credentials/verify")
def verify_vc(payload: dict = Body(...)):
    """
    Verifies an Ed25519-signed W3C/Pramaan Verifiable Credential.
    Performs canonicalization, SHA-256 hash comparison, DID registry lookup, and signature validation.
    """
    try:
        cred = payload.get("credential", payload)
        result = verify_credential(cred)
        return {
            "success": result.get("status") == "VERIFIED",
            "result": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"code": "VERIFICATION_ERROR", "message": str(e)}
        )

@app.get("/api/credentials/registry")
def get_registry():
    """Returns all registered issuer public keys from mock DID registry."""
    if os.path.exists(REGISTRY_PATH):
        with open(REGISTRY_PATH, "r") as f:
            return json.load(f)
    return {}

@app.post("/api/match/evaluate")
def evaluate_candidate(req: EvaluateRequest):
    try:
        # Initial state for the LangGraph workflow
        initial_state = {
            "passport_data": req.passport.model_dump(),
            "job_description": req.job_description,
            "github_token": req.github_token,
            "github_verification": {},
            "sanitized_passport": {},
            "match_result": {},
            "error": ""
        }
        
        # Execute the graph
        result = app_graph.invoke(initial_state)
        
        if result.get("error"):
            raise HTTPException(
                status_code=500,
                detail={"code": "GRAPH_EXECUTION_ERROR", "message": result["error"]}
            )
            
        return {
            "success": True,
            "github_verification": result.get("github_verification"),
            "sanitized_passport": result.get("sanitized_passport"),
            "match_result": result.get("match_result")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"code": "INTERNAL_SERVER_ERROR", "message": str(e)}
        )

class GitProofScanRequest(BaseModel):
    token: str
    username: str
    limit_repos: Optional[int] = 20

@app.post("/api/gitproof/scan-user")
def scan_user_gitproof(req: GitProofScanRequest):
    """
    Directly runs GitProof PortfolioScannerAgent and physics scoring model
    on the user's account using the connected GitHub token.
    """
    try:
        from agents.portfolio_scanner import PortfolioScannerAgent
        from memory.memory_manager import MemoryManager
        from llm.llm_client import LLMClient
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        memory = MemoryManager(db_path=os.path.join(base_dir, "gitproof", "gitproof_memory.db"))
        llm = LLMClient()
        
        scanner = PortfolioScannerAgent(github_token=req.token, memory=memory, llm=llm)
        result = scanner.scan_portfolio(username=req.username, limit_repos=req.limit_repos or 20)
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

# --- GitHub OAuth Redirects for GitProof Subapp ---
# Because GitProof is mounted at /gitproof, its auth routes are /gitproof/auth/...
# However, the frontend and GitHub OAuth App expect /auth/login and /auth/callback.
# We proxy these root routes into the GitProof subapp to preserve functionality.
from fastapi.responses import RedirectResponse

@app.get("/auth/login")
def auth_login(request: Request):
    return RedirectResponse(url="/gitproof/auth/login")

@app.get("/auth/callback")
def auth_callback(request: Request):
    # Pass along any query params (like ?code=...&state=...) from GitHub
    query = request.url.query
    url = f"/gitproof/auth/callback?{query}" if query else "/gitproof/auth/callback"
    return RedirectResponse(url=url)

class TeamSynergyRequest(BaseModel):
    user_skills: list[str] = Field(default_factory=list)
    career_goal: Optional[str] = "Full Stack Engineer"
    preferred_track: Optional[str] = None

@app.post("/api/team/synergy-match")
def calculate_team_synergy(req: TeamSynergyRequest):
    """
    Computes complementary team compatibility between student's verified skills 
    and open hackathon squads.
    """
    sample_teams: list[dict[str, Any]] = [
        {
            "id": "squad-01",
            "name": "NeuralForge AI",
            "track": "Smart Automation & AI",
            "problem": "Autonomous code synthesis & vulnerability repair pipeline",
            "leader": "Arjun Mehta (IIT Bombay)",
            "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
            "current_members": [
                {"name": "Arjun M.", "role": "ML Lead", "skills": ["PyTorch", "Python", "HuggingFace"]},
                {"name": "Sneha P.", "role": "UI/UX", "skills": ["Figma", "React", "TailwindCSS"]}
            ],
            "open_roles": ["Backend & LangGraph Architect", "DevOps & Cloud Engineer"],
            "required_skills": ["FastAPI", "Python", "Docker", "PostgreSQL", "LangGraph"],
            "max_members": 4,
            "discord": "discord.gg/neuralforge",
            "github_repo": "NeuralForge-SIH/core-agent"
        },
        {
            "id": "squad-02",
            "name": "ZeroKnowledge Guild",
            "track": "Blockchain & Cybersecurity",
            "problem": "Decentralized verifiable identity & anti-sybil protocol",
            "leader": "Priya Sharma (NIT Trichy)",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
            "current_members": [
                {"name": "Priya S.", "role": "ZK Cryptographer", "skills": ["Circom", "Rust", "Solidity"]},
                {"name": "Dev K.", "role": "Smart Contracts", "skills": ["Solidity", "Hardhat", "Go"]}
            ],
            "open_roles": ["Frontend Web3 Integration", "Full-Stack Typescript Lead"],
            "required_skills": ["TypeScript", "React", "Next.js", "Ethers.js", "TailwindCSS"],
            "max_members": 4,
            "discord": "discord.gg/zk-guild",
            "github_repo": "zk-guild/identity-contracts"
        },
        {
            "id": "squad-03",
            "name": "AgriSense Drones",
            "track": "AgriTech & IoT",
            "problem": "Autonomous crop disease detection via multispectral satellite imagery",
            "leader": "Rohan Verma (BITS Pilani)",
            "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
            "current_members": [
                {"name": "Rohan V.", "role": "Embedded Systems", "skills": ["C++", "ROS", "Python"]},
                {"name": "Ananya R.", "role": "Computer Vision", "skills": ["OpenCV", "TensorFlow", "YOLO"]}
            ],
            "open_roles": ["Distributed Backend & Cloud Pipeline", "Web GIS Dashboard Engineer"],
            "required_skills": ["Python", "FastAPI", "React", "PostgreSQL", "Docker"],
            "max_members": 4,
            "discord": "discord.gg/agrisense",
            "github_repo": "agrisense-sih/flight-telemetry"
        },
        {
            "id": "squad-04",
            "name": "MediTriage AI",
            "track": "MedTech & Healthcare",
            "problem": "Real-time emergency room triage and predictive vitals dashboard",
            "leader": "Vikram Patel (IIIT Hyderabad)",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
            "current_members": [
                {"name": "Vikram P.", "role": "Data Scientist", "skills": ["Python", "Scikit-Learn", "FastAPI"]},
                {"name": "Meera J.", "role": "Mobile App Dev", "skills": ["Flutter", "Dart", "Firebase"]}
            ],
            "open_roles": ["Security & Cryptographic Audit Lead", "System Architect"],
            "required_skills": ["Node.js", "TypeScript", "Docker", "Security", "GraphQL"],
            "max_members": 4,
            "discord": "discord.gg/meditriage",
            "github_repo": "meditriage/vital-predict"
        }
    ]

    user_skills_lower = [s.strip().lower() for s in req.user_skills]
    scored_teams = []

    for team in sample_teams:
        raw_skills = team.get("required_skills", [])
        team_required_skills: list[str] = [str(s) for s in raw_skills] if isinstance(raw_skills, list) else []
        matched_skills: list[str] = [s for s in team_required_skills if s.lower() in user_skills_lower]
        
        # Calculate synergy: base fit + complementary power
        match_ratio = len(matched_skills) / max(len(team_required_skills), 1)
        synergy_score = int(min(98, max(58, match_ratio * 100 + 15)))
        
        complementary_reasons: list[str] = []
        if matched_skills:
            complementary_reasons.append(f"You provide essential {', '.join(matched_skills[:2])} skills.")
        if req.career_goal and any(w in req.career_goal.lower() for w in ["ai", "full", "backend", "lead"]):
            complementary_reasons.append(f"Your goal as {req.career_goal} complements their roadmap.")
            
        scored_teams.append({
            **team,
            "synergy_score": synergy_score,
            "matched_skills": matched_skills,
            "complementary_note": " ".join(complementary_reasons) or "Great potential team addition for SIH 2026."
        })

    # Sort by highest synergy first
    scored_teams.sort(key=lambda t: t["synergy_score"], reverse=True)

    return {
        "success": True,
        "count": len(scored_teams),
        "teams": scored_teams
    }

# Mount the full GitProof application at /gitproof
app.mount("/gitproof", gitproof_app)


