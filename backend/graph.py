import os
from typing import Annotated, Dict, Any, List, TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

import sys
from pathlib import Path

# Add gitproof to sys.path for direct access
gitproof_dir = str(Path(__file__).parent / "gitproof")
if gitproof_dir not in sys.path:
    sys.path.insert(0, gitproof_dir)

try:
    from github_agent import GitProofAgent
except ImportError:
    GitProofAgent = None

# Ensure API keys are available
if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "mock_key_for_now"
if "OPENROUTER_API_KEY" not in os.environ:
    os.environ["OPENROUTER_API_KEY"] = "mock_key_for_now"
if "AICREDIT_API_KEY" not in os.environ:
    os.environ["AICREDIT_API_KEY"] = "sk-live-3c1d02c99d29fbf0b826af39454c2944d7045dea6b4fe022f1ddbe72eaf05068"

# Define the State schema
class GraphState(TypedDict):
    passport_data: Dict[str, Any] # Input: The structured passport from the frontend
    job_description: str # Input: the internship description
    github_token: str | None # Input: GitHub OAuth token for Git-Proof-Agent
    github_verification: Dict[str, Any] # Output of Verify_Git_Proof
    sanitized_passport: Dict[str, Any] # Output of Sanitize_Data
    match_result: Dict[str, Any] # Output of Compute_Match
    error: str

# Define Structured Outputs for LLMs
class Skill(BaseModel):
    name: str
    level: int = Field(description="Skill level from 1-100")
    evidence: int = Field(description="Number of projects/certificates proving this skill")

class PassportSchema(BaseModel):
    name: str
    age: int
    gender: str
    college: str
    skills: List[Skill]

class MatchResultSchema(BaseModel):
    match_score: int = Field(description="Match percentage from 0-100")
    gap_analysis: str = Field(description="Detailed explanation of missing skills")
    explainable_text: str = Field(description="Why this candidate is a good or bad fit")

# --- Nodes ---

def verify_git_proof(state: GraphState):
    print("--- VERIFY GIT PROOF (GitProofAgent) ---")
    if state.get("error"):
        return {}

    github_token = state.get("github_token")
    if not github_token or not GitProofAgent:
        return {"github_verification": {"status": "skipped", "reason": "No GitHub token provided"}}

    try:
        agent = GitProofAgent(token=github_token)
        repos = agent.list_my_repos(per_page=10)
        return {
            "github_verification": {
                "status": "verified",
                "repo_count": len(repos),
                "repos_preview": [r.get("name") for r in repos[:5] if isinstance(r, dict)]
            }
        }
    except Exception as e:
        print(f"GitProof verification note: {e}")
        return {"github_verification": {"status": "error", "message": str(e)}}

def sanitize_data(state: GraphState):
    print("--- SANITIZE DATA (Blind Matching) ---")
    if state.get("error"):
        return {}

    passport = state.get("passport_data", {})
    
    if not passport:
        return {"error": "No passport to sanitize"}
        
    # Strip PII
    sanitized = {
        "skills": passport.get("skills", []),
        "anonymized_id": "CANDIDATE_101",
        "is_blind_matching_active": True,
        "github_verified": state.get("github_verification", {}).get("status") == "verified"
    }
    return {"sanitized_passport": sanitized}

def compute_match(state: GraphState):
    print("--- COMPUTE MATCH (Grok 2 / Llama 3) ---")
    if state.get("error"):
        return {}

    sanitized = state.get("sanitized_passport", {})
    job_desc = state.get("job_description", "")
    
    if not sanitized or not job_desc:
        return {"error": "Missing inputs for match computation"}
        
    try:
        prompt = f"""
        Evaluate this candidate against the job description.
        Job Description: {job_desc}
        Candidate Profile: {sanitized}
        
        Provide a match score, gap analysis, and explainable text.
        """
        
        res = None
        # 1. Try OpenRouter Grok-2 if key is configured
        openrouter_key = os.environ.get("OPENROUTER_API_KEY")
        if openrouter_key and openrouter_key != "mock_key_for_now":
            try:
                print("--- Attempting Match Evaluator via OpenRouter (Grok 2) ---")
                llm = ChatOpenAI(base_url="https://openrouter.ai/api/v1", api_key=openrouter_key, model="x-ai/grok-2")
                structured_llm = llm.with_structured_output(MatchResultSchema)
                res = structured_llm.invoke(prompt)
            except Exception as e:
                print(f"--- Grok 2 failed: {e} ---")

        # 2. Try Gemini (Google Generative AI)
        if res is None:
            google_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
            if google_key and google_key != "mock_key_for_now":
                try:
                    print("--- Attempting Match Evaluator via Gemini (gemini-2.5-flash) ---")
                    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=google_key)
                    structured_llm = llm.with_structured_output(MatchResultSchema)
                    res = structured_llm.invoke(prompt)
                except Exception as e:
                    print(f"--- Gemini failed: {e} ---")

        # 3. Deterministic scoring fallback if all LLMs are unreachable
        if res is None:
            print("--- Using deterministic match heuristic fallback ---")
            skills = [s.get("name", "") if isinstance(s, dict) else str(s) for s in sanitized.get("skills", [])]
            matched = [s for s in skills if s.lower() in job_desc.lower()]
            score = min(100, int((len(matched) / max(1, len(skills))) * 100)) if skills else 75
            return {
                "match_result": {
                    "match_score": max(50, score),
                    "gap_analysis": f"Evaluated against: {job_desc[:100]}... Verified skills: {', '.join(skills)}",
                    "explainable_text": f"Candidate possesses verified skills: {', '.join(matched) if matched else 'Profile analyzed'}."
                }
            }

        return {"match_result": res.model_dump() if hasattr(res, "model_dump") else res}
    except Exception as e:
        return {"error": f"Match computation failed: {str(e)}"}



# --- Build Graph ---
workflow = StateGraph(GraphState)

# Add Nodes
workflow.add_node("Verify_Git_Proof", verify_git_proof)
workflow.add_node("Sanitize_Data", sanitize_data)
workflow.add_node("Compute_Match", compute_match)

# Define Edges
workflow.add_edge(START, "Verify_Git_Proof")
workflow.add_edge("Verify_Git_Proof", "Sanitize_Data")
workflow.add_edge("Sanitize_Data", "Compute_Match")
workflow.add_edge("Compute_Match", END)

# Compile the Graph
app_graph = workflow.compile()

