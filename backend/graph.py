import os
from typing import Annotated, Dict, Any, List
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

# GitProof Agent imports
from gitproof.agents.orchestrator import OrchestratorAgent
from gitproof.memory.memory_manager import MemoryManager
from gitproof.llm.llm_client import LLMClient

# Initialize singletons for the verifier
_memory = MemoryManager()
_llm = LLMClient()

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
        "is_blind_matching_active": True
    }
    return {"sanitized_passport": sanitized}

def compute_match(state: GraphState):
    print("--- COMPUTE MATCH (Grok 2) ---")
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
        
        try:
            print("--- Attempting Match Evaluator via OpenRouter (Grok 2) ---")
            llm = ChatOpenAI(base_url="https://openrouter.ai/api/v1", api_key=os.environ.get("OPENROUTER_API_KEY"), model="x-ai/grok-2")
            structured_llm = llm.with_structured_output(MatchResultSchema)
            res = structured_llm.invoke(prompt)
        except Exception as e:
            print(f"--- Evaluator Failed, Falling back to Llama 3 via OpenRouter: {e} ---")
            llm = ChatOpenAI(base_url="https://openrouter.ai/api/v1", api_key=os.environ.get("OPENROUTER_API_KEY"), model="meta-llama/llama-3-8b-instruct:free")
            structured_llm = llm.with_structured_output(MatchResultSchema)
            res = structured_llm.invoke(prompt)
            
        return {"match_result": res.model_dump()}
    except Exception as e:
        return {"error": f"Match computation failed: {str(e)}"}


# --- Build Graph ---
workflow = StateGraph(GraphState)

# Add Nodes
workflow.add_node("Sanitize_Data", sanitize_data)
workflow.add_node("Compute_Match", compute_match)

# Define Edges
workflow.add_edge(START, "Sanitize_Data")
workflow.add_edge("Sanitize_Data", "Compute_Match")
workflow.add_edge("Compute_Match", END)

# Compile the Graph
app_graph = workflow.compile()
