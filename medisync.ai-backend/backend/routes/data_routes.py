from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from ..db.connection import get_db
from ..db.models import Patient, Doctor, Appointment
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api", tags=["data"])

# Response Models
class PatientResponse(BaseModel):
    id: int
    patient_id: str
    name: str
    email: str
    phone: str

    class Config:
        from_attributes = True

class DoctorResponse(BaseModel):
    id: int
    doctor_id: str
    name: str
    specialization: str
    is_available: bool

    class Config:
        from_attributes = True

class AppointmentResponse(BaseModel):
    id: int
    appointment_id: str
    patient_id: int
    doctor_id: int
    scheduled_time: datetime
    status: str
    reason: str

    class Config:
        from_attributes = True

@router.get("/patients", response_model=List[PatientResponse])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get list of patients"""
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients

@router.get("/patients/{patient_id}")
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    """Get specific patient by ID"""
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.get("/doctors", response_model=List[DoctorResponse])
def get_doctors(specialization: str = None, db: Session = Depends(get_db)):
    """Get list of doctors, optionally filtered by specialization"""
    query = db.query(Doctor)
    if specialization:
        query = query.filter(Doctor.specialization == specialization)
    doctors = query.all()
    return doctors

@router.get("/appointments", response_model=List[AppointmentResponse])
def get_appointments(
    patient_id: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    """Get appointments, optionally filtered"""
    query = db.query(Appointment)

    if patient_id:
        patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
        if patient:
            query = query.filter(Appointment.patient_id == patient.id)

    if status:
        query = query.filter(Appointment.status == status)

    appointments = query.all()
    return appointments
