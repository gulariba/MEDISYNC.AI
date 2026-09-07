import pytest
from dotenv import load_dotenv

# Load environment variables from .env file before importing agents
load_dotenv()

from backend.agents import TriageAgent, DiagnosisAgent, SchedulingAgent

def test_triage_agent_initialization():
    """Test triage agent can be initialized"""
    agent = TriageAgent()
    assert agent.name == "triage_agent"
    assert agent.role == "symptom_assessment"

def test_diagnosis_agent_initialization():
    """Test diagnosis agent can be initialized"""
    agent = DiagnosisAgent()
    assert agent.name == "diagnosis_agent"
    assert agent.role == "preliminary_diagnosis"

def test_scheduling_agent_initialization():
    """Test scheduling agent can be initialized"""
    agent = SchedulingAgent()
    assert agent.name == "scheduling_agent"
    assert agent.role == "appointment_management"

def test_base_agent_validation():
    """Test input validation on base agent"""
    agent = TriageAgent()

    # Valid input
    valid_input = {
        "patient_id": "P001",
        "symptoms": ["fever"]
    }
    assert agent.validate_input(valid_input, ["patient_id", "symptoms"]) == True

    # Invalid input - missing field
    invalid_input = {
        "patient_id": "P001"
    }
    with pytest.raises(ValueError):
        agent.validate_input(invalid_input, ["patient_id", "symptoms"])
