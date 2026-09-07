# API Examples and Usage Guide

This document provides examples of how to use the Healthcare Multi-Agent System API.

**Note:** This system uses OpenRouter API for AI capabilities with automatic model selection.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, the API does not require authentication for development. In production, implement proper authentication middleware.

## Health Check

### GET /health

Check system health and service status.

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## Agent Endpoints

### POST /agents/triage

Perform triage assessment on patient symptoms.

**Request:**
```bash
curl -X POST http://localhost:8000/agents/triage \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "P001",
    "symptoms": ["fever", "cough", "fatigue"],
    "duration": "3 days",
    "severity": "moderate",
    "additional_context": "Patient also reports body aches"
  }'
```

**Response:**
```json
{
  "status": "success",
  "assessment": {
    "priority": "medium",
    "urgency_score": 6,
    "recommended_specialty": "general_practice",
    "red_flags": [],
    "recommended_action": "schedule_appointment",
    "reasoning": "Symptoms consistent with viral infection...",
    "disclaimer": "This is an AI-assisted preliminary assessment..."
  }
}
```

---

### POST /agents/diagnosis

Get preliminary diagnostic suggestions based on symptoms.

**Request:**
```bash
curl -X POST http://localhost:8000/agents/diagnosis \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "P002",
    "symptoms": ["chest pain", "shortness of breath", "sweating"],
    "age": 55,
    "sex": "M",
    "medical_history": "Hypertension, high cholesterol",
    "medications": "Lisinopril 10mg daily",
    "allergies": "Penicillin"
  }'
```

**Response:**
```json
{
  "status": "success",
  "diagnosis": {
    "differential_diagnosis": [
      {
        "condition": "Angina Pectoris",
        "probability": "high",
        "reasoning": "Classic cardiac chest pain presentation...",
        "supporting_symptoms": ["chest pain", "shortness of breath"],
        "contradicting_factors": []
      },
      {
        "condition": "Anxiety Attack",
        "probability": "medium",
        "reasoning": "Similar symptom presentation...",
        "supporting_symptoms": ["sweating", "chest discomfort"],
        "contradicting_factors": ["age", "cardiovascular risk factors"]
      }
    ],
    "recommended_tests": [
      "ECG",
      "Troponin levels",
      "Chest X-ray"
    ],
    "red_flags": [
      "Chest pain with cardiovascular risk factors"
    ],
    "confidence_level": "medium",
    "disclaimer": "This is an AI-generated preliminary assessment..."
  }
}
```

---

### POST /agents/scheduling

Manage appointment scheduling.

**Book Appointment Request:**
```bash
curl -X POST http://localhost:8000/agents/scheduling \
  -H "Content-Type: application/json" \
  -d '{
    "action": "book_appointment",
    "patient_id": "P003",
    "specialty": "cardiology",
    "urgency": "high",
    "preferred_time": "morning",
    "preferred_days": ["Monday", "Wednesday"],
    "reason": "Follow-up for chest pain",
    "available_doctors": [
      {
        "name": "Sarah Connor",
        "specialization": "Cardiology",
        "is_available": true
      }
    ]
  }'
```

**Find Slots Request:**
```bash
curl -X POST http://localhost:8000/agents/scheduling \
  -H "Content-Type: application/json" \
  -d '{
    "action": "find_slots",
    "specialty": "general_practice",
    "date_range": "next_week"
  }'
```

---

## Data Endpoints

### GET /api/patients

List all patients.

```bash
curl http://localhost:8000/api/patients?skip=0&limit=10
```

**Response:**
```json
[
  {
    "id": 1,
    "patient_id": "P001",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0101"
  }
]
```

---

### GET /api/patients/{patient_id}

Get specific patient details.

```bash
curl http://localhost:8000/api/patients/P001
```

---

### GET /api/doctors

List all doctors, optionally filtered by specialization.

```bash
# All doctors
curl http://localhost:8000/api/doctors

# Cardiologists only
curl http://localhost:8000/api/doctors?specialization=Cardiology
```

**Response:**
```json
[
  {
    "id": 1,
    "doctor_id": "D001",
    "name": "Dr. Sarah Connor",
    "specialization": "Cardiology",
    "is_available": true
  }
]
```

---

### GET /api/appointments

List appointments with optional filters.

```bash
# All appointments
curl http://localhost:8000/api/appointments

# For specific patient
curl http://localhost:8000/api/appointments?patient_id=P001

# By status
curl http://localhost:8000/api/appointments?status=scheduled
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "detail": "Invalid request parameters"
}
```

**404 Not Found:**
```json
{
  "detail": "Patient not found"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "error": "Error message details"
}
```

---

## Rate Limiting

The system implements rate limiting through Redis. Default limits:
- 100 requests per minute per IP
- 1000 requests per hour per agent

---

## Python Client Example

```python
import requests

BASE_URL = "http://localhost:8000"

# Perform triage assessment
def triage_patient(patient_id, symptoms):
    response = requests.post(
        f"{BASE_URL}/agents/triage",
        json={
            "patient_id": patient_id,
            "symptoms": symptoms,
            "severity": "moderate"
        }
    )
    return response.json()

# Get patient info
def get_patient(patient_id):
    response = requests.get(f"{BASE_URL}/api/patients/{patient_id}")
    return response.json()

# Usage
assessment = triage_patient("P001", ["fever", "cough"])
print(assessment)
```

---

## JavaScript/TypeScript Client Example

```typescript
const BASE_URL = "http://localhost:8000";

// Perform diagnosis
async function getDiagnosis(patientId: string, symptoms: string[]) {
  const response = await fetch(`${BASE_URL}/agents/diagnosis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patient_id: patientId,
      symptoms: symptoms,
      age: 45,
      sex: "M",
    }),
  });
  
  return response.json();
}

// Usage
const diagnosis = await getDiagnosis("P002", ["chest pain", "fatigue"]);
console.log(diagnosis);
```
