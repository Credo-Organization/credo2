import os
import sys
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
    verifier_mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(verifier_mod)
    verify_credential = verifier_mod.verify_credential
    REGISTRY_PATH = verifier_mod.REGISTRY_PATH

app = FastAPI(title="SIH AI Orchestration, GitProof & Credential Verifier API", version="2.0.0")

SESSION_SECRET = os.getenv("SESSION_SECRET", "dev-secret-change-me")
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET, same_site="lax")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

# Mount the full GitProof application at /gitproof
app.mount("/gitproof", gitproof_app)


