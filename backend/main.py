from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import app_graph
app = FastAPI(title="SIH AI Orchestration API", version="1.0.0")

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvaluateRequest(BaseModel):
    raw_document: str
    job_description: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FastAPI + LangGraph backend is running."}

@app.post("/api/match/evaluate")
def evaluate_candidate(req: EvaluateRequest):
    try:
        # Initial state for the LangGraph workflow
        initial_state = {
            "raw_document": req.raw_document,
            "job_description": req.job_description,
            "extracted_passport": {},
            "sanitized_passport": {},
            "match_result": {},
            "error": ""
        }
        
        # Execute the graph
        result = app_graph.invoke(initial_state)
        
        if result.get("error"):
            raise HTTPException(status_code=500, detail=result["error"])
            
        return {
            "success": True,
            "extracted_passport": result.get("extracted_passport"),
            "sanitized_passport": result.get("sanitized_passport"),
            "match_result": result.get("match_result")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
