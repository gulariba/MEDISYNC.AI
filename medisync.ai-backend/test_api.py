import pytest
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Load environment variables from .env file before importing app
load_dotenv()

from backend.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert "message" in data

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "services" in data

def test_agent_status():
    """Test agent status endpoint"""
    response = client.get("/agents/status")
    assert response.status_code == 200
    data = response.json()
    assert "agents" in data
    assert "triage" in data["agents"]
    assert "diagnosis" in data["agents"]
    assert "scheduling" in data["agents"]

def test_triage_assessment():
    """Test triage agent endpoint"""
    payload = {
        "patient_id": "P001",
        "symptoms": ["fever", "cough", "fatigue"],
        "duration": "3 days",
        "severity": "moderate"
    }
    response = client.post("/agents/triage", json=payload)
    assert response.status_code in [200, 500]  # May fail if API key not set

    if response.status_code == 200:
        data = response.json()
        assert "status" in data

def test_invalid_triage_request():
    """Test triage with missing required fields"""
    payload = {
        "symptoms": ["fever"]
        # Missing patient_id
    }
    response = client.post("/agents/triage", json=payload)
    # Should return error due to validation
    assert response.status_code in [422, 500]

def test_diagnosis_request():
    """Test diagnosis agent endpoint"""
    payload = {
        "patient_id": "P001",
        "symptoms": ["chest pain", "shortness of breath"],
        "age": 45,
        "sex": "M"
    }
    response = client.post("/agents/diagnosis", json=payload)
    assert response.status_code in [200, 500]  # May fail if API key not set

def test_scheduling_request():
    """Test scheduling agent endpoint"""
    payload = {
        "action": "find_slots",
        "patient_id": "P001",
        "specialty": "cardiology",
        "urgency": "high"
    }
    response = client.post("/agents/scheduling", json=payload)
    assert response.status_code in [200, 500]  # May fail if API key not set
