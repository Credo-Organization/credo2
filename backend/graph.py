import os
from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
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
# No inline key fallback. A missing credential is a configuration error and
# should surface as one rather than silently using a committed secret.

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
        base_url = os.environ.get("AI_BASE_URL") or os.environ.get("OPENROUTER_BASE_URL") or "https://aicredits.in/v1"
        api_key = os.environ.get("OPENROUTER_API_KEY") or os.environ.get("AICREDIT_API_KEY")

        # 1. Try AICredits / OpenRouter Gateway with Grok-2 or Gemini 2.5 Flash
        if api_key and api_key != "mock_key_for_now":
            # Attempt 1a: Grok-2 / Gemini 2.5 Flash via Gateway
            # grok-2 was first in this list and returns 404 "No endpoints found"
            # on this gateway, so every match paid for a failed round trip before
            # reaching a model that answers.
            for model_candidate in ["google/gemini-2.5-flash", "openai/gpt-4o-mini"]:
                try:
                    print(f"--- Attempting Match Evaluator via Gateway ({model_candidate}) ---")
                    llm = ChatOpenAI(base_url=base_url, api_key=api_key, model=model_candidate, timeout=10)
                    structured_llm = llm.with_structured_output(MatchResultSchema)
                    res = structured_llm.invoke(prompt)
                    if res:
                        break
                except Exception as e:
                    print(f"--- Gateway model {model_candidate} failed: {e} ---")

        # 2. Try Direct Gemini API (Google Generative AI) with Key Pooling
        if res is None:
            try:
                from gitproof.llm.key_pool import get_key_pool
            except ImportError:
                try:
                    from llm.key_pool import get_key_pool
                except ImportError:
                    get_key_pool = None

            pool = get_key_pool() if get_key_pool else None
            key_candidates = pool.get_key_candidates() if pool else []
            keys_to_try = [k.key for k in key_candidates] or [
                k for k in [os.environ.get("GOOGLE_API_KEY"), os.environ.get("GEMINI_API_KEY")]
                if k and k != "mock_key_for_now"
            ]

            for google_key in keys_to_try:
                if res is not None:
                    break
                for gem_model in ["gemini-flash-latest", "gemini-pro-latest", "gemini-flash-lite-latest"]:
                    try:
                        print(f"--- Attempting Match Evaluator via Native Gemini ({gem_model}) ---")
                        llm = ChatGoogleGenerativeAI(model=gem_model, google_api_key=google_key, timeout=10)
                        structured_llm = llm.with_structured_output(MatchResultSchema)
                        res = structured_llm.invoke(prompt)
                        if res:
                            if pool:
                                pool.mark_success(google_key)
                            break
                    except Exception as e:
                        if pool:
                            pool.mark_failure(google_key, status_code=429 if ("429" in str(e) or "quota" in str(e).lower()) else 500)
                        print(f"--- Native Gemini ({gem_model}) note: {e} ---")

        # 3. Deterministic scoring fallback if all LLMs are unreachable
        if res is None:
            # Loudly, and with the cause. This path answers HTTP 200 with a
            # plausible score, so a misconfigured key looked like a working
            # service for as long as nobody read the logs.
            print(
                "!!! MATCH EVALUATOR DEGRADED: every LLM provider failed; returning a "
                "keyword-overlap heuristic, not an AI verdict.\n"
                f"!!! AI_BASE_URL={base_url!r}  api_key_present={bool(api_key)}  "
                f"google_key_present={bool(os.environ.get('GOOGLE_API_KEY') or os.environ.get('GEMINI_API_KEY'))}\n"
                "!!! A 401 here usually means the key belongs to a different provider "
                "than AI_BASE_URL points at."
            )
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
# Note: cast or type ignore resolves Pyright's TypedDictLike protocol limitation with LangGraph's StateT
workflow = StateGraph(GraphState)  # type: ignore[arg-type]

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

