from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from ..agents.triage_agent import TriageAgent
from ..agents.diagnosis_agent import DiagnosisAgent
from ..agents.scheduling_agent import SchedulingAgent

router = APIRouter(prefix="/agents", tags=["agents"])

# Request/Response Models
class TriageRequest(BaseModel):
    patient_id: str
    symptoms: List[str]
    duration: Optional[str] = None
    severity: Optional[str] = None
    additional_context: Optional[str] = None

class DiagnosisRequest(BaseModel):
    patient_id: str
    symptoms: List[str]
    age: Optional[int] = None
    sex: Optional[str] = None
    medical_history: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    additional_context: Optional[str] = None

class SchedulingRequest(BaseModel):
    action: str  # book_appointment, find_slots, reschedule, cancel
    patient_id: Optional[str] = None
    specialty: Optional[str] = None
    urgency: Optional[str] = None
    preferred_time: Optional[str] = None
    preferred_days: Optional[List[str]] = None
    reason: Optional[str] = None
    appointment_id: Optional[str] = None
    new_time: Optional[str] = None
    available_doctors: Optional[List[Dict[str, Any]]] = None

# Initialize agents
triage_agent = TriageAgent()
diagnosis_agent = DiagnosisAgent()
scheduling_agent = SchedulingAgent()

@router.post("/triage")
async def triage_assessment(request: TriageRequest):
    """
    Perform triage assessment on patient symptoms
    """
    try:
        result = await triage_agent.process(request.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/diagnosis")
async def preliminary_diagnosis(request: DiagnosisRequest):
    """
    Generate preliminary diagnostic suggestions
    """
    try:
        result = await diagnosis_agent.process(request.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scheduling")
async def manage_scheduling(request: SchedulingRequest):
    """
    Handle appointment scheduling operations
    """
    try:
        result = await scheduling_agent.process(request.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def agent_status():
    """
    Get status of all agents
    """
    return {
        "agents": {
            "triage": {"name": triage_agent.name, "status": "active"},
            "diagnosis": {"name": diagnosis_agent.name, "status": "active"},
            "scheduling": {"name": scheduling_agent.name, "status": "active"}
        }
    }
