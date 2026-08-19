from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from graph import app_graph
import os

app = FastAPI(title="SIH AI Orchestration API", version="1.0.0")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FastAPI + LangGraph backend is running as a pure AI microservice."}

@app.post("/api/match/evaluate")
def evaluate_candidate(req: EvaluateRequest):
    try:
        # Initial state for the LangGraph workflow
        initial_state = {
            "passport_data": req.passport.model_dump(),
            "job_description": req.job_description,
            "github_token": req.github_token,
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
