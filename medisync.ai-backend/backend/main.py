from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv

from backend.db.connection import get_db, engine
from backend.db.models import Base, Patient, Doctor, Appointment, MedicalRecord
from backend.utils.cache import cache
from backend.config import settings

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Healthcare Multi-Agent System API",
    description="AI-powered healthcare platform with patient management and appointment booking",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== Pydantic Response Models =====

class PatientResponse(BaseModel):
    id: int
    patient_id: str
    name: str
    date_of_birth: datetime
    email: Optional[str]
    phone: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class DoctorResponse(BaseModel):
    id: int
    doctor_id: str
    name: str
    specialization: str
    email: Optional[str]
    phone: Optional[str]
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
    reason: Optional[str]
    notes: Optional[str]
    created_at: datetime
    patient: Optional[PatientResponse] = None
    doctor: Optional[DoctorResponse] = None

    class Config:
        from_attributes = True


class MedicalRecordResponse(BaseModel):
    id: int
    record_id: str
    patient_id: int
    record_type: str
    content: str
    created_by: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class BookAppointmentRequest(BaseModel):
    patient_id: str = Field(..., description="Patient's unique identifier")
    doctor_id: str = Field(..., description="Doctor's unique identifier")
    scheduled_time: datetime = Field(..., description="Appointment date and time")
    reason: Optional[str] = Field(None, description="Reason for appointment")
    notes: Optional[str] = Field(None, description="Additional notes")


class ErrorResponse(BaseModel):
    error: str
    detail: str


# ===== Root Endpoints =====

@app.get("/")
async def root():
    return {
        "message": "Healthcare Multi-Agent System API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint with service status"""
    db_status = "connected"
    try:
        engine.connect()
    except Exception as e:
        db_status = f"disconnected: {str(e)}"

    redis_status = "connected" if cache.health_check() else "disconnected"
    overall_status = "healthy" if db_status == "connected" and redis_status == "connected" else "degraded"

    return {
        "status": overall_status,
        "services": {
            "database": db_status,
            "redis": redis_status
        },
        "version": "1.0.0"
    }


# ===== Patient Endpoints =====

@app.get(
    "/patients/{patient_id}",
    response_model=PatientResponse,
    responses={404: {"model": ErrorResponse}}
)
async def get_patient(patient_id: str, db: Session = Depends(get_db)):
    """
    Get patient profile by patient_id.

    Returns complete patient information including demographics and contact details.
    """
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found"
        )

    return patient


@app.get(
    "/patients/{patient_id}/appointments",
    response_model=List[AppointmentResponse],
    responses={404: {"model": ErrorResponse}}
)
async def get_patient_appointments(patient_id: str, db: Session = Depends(get_db)):
    """
    Get appointment history for a patient.

    Returns all appointments (past and future) for the specified patient,
    including doctor information for each appointment.
    """
    # First verify patient exists
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found"
        )

    # Get all appointments for this patient, ordered by scheduled time (most recent first)
    appointments = (
        db.query(Appointment)
        .filter(Appointment.patient_id == patient.id)
        .order_by(Appointment.scheduled_time.desc())
        .all()
    )

    return appointments


@app.get(
    "/patients/{patient_id}/reports",
    response_model=List[MedicalRecordResponse],
    responses={404: {"model": ErrorResponse}}
)
async def get_patient_reports(patient_id: str, db: Session = Depends(get_db)):
    """
    Get all medical reports for a patient.

    Returns all medical records (diagnoses, lab results, prescriptions, etc.)
    associated with the specified patient.
    """
    # First verify patient exists
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found"
        )

    # Get all medical records for this patient, ordered by creation date (most recent first)
    reports = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == patient.id)
        .order_by(MedicalRecord.created_at.desc())
        .all()
    )

    return reports


# ===== Reports Endpoints =====

@app.get(
    "/reports/{report_id}",
    response_model=MedicalRecordResponse,
    responses={404: {"model": ErrorResponse}}
)
async def get_report(report_id: str, db: Session = Depends(get_db)):
    """
    Get a single medical report by report_id.

    Returns the complete medical record including raw_findings in the content field.
    """
    report = db.query(MedicalRecord).filter(MedicalRecord.record_id == report_id).first()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' not found"
        )

    return report


# ===== Doctor Endpoints =====

@app.get(
    "/doctors/{doctor_id}/appointments",
    response_model=List[AppointmentResponse],
    responses={404: {"model": ErrorResponse}}
)
async def get_doctor_appointments(doctor_id: str, db: Session = Depends(get_db)):
    """
    Get appointment schedule for a doctor.

    Returns all appointments for the specified doctor, ordered by scheduled time.
    Includes patient information for each appointment.
    """
    # First verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.doctor_id == doctor_id).first()

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with ID '{doctor_id}' not found"
        )

    # Get all appointments for this doctor, ordered by scheduled time (upcoming first)
    appointments = (
        db.query(Appointment)
        .filter(Appointment.doctor_id == doctor.id)
        .order_by(Appointment.scheduled_time.asc())
        .all()
    )

    return appointments


# ===== Appointment Booking Endpoint =====

@app.post(
    "/appointments/book",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        404: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
        423: {"model": ErrorResponse}
    }
)
async def book_appointment(
    booking: BookAppointmentRequest,
    db: Session = Depends(get_db)
):
    """
    Book a new appointment with double-booking prevention.

    Uses Redis lock to prevent race conditions when multiple clients
    try to book the same time slot simultaneously.

    - Verifies patient and doctor exist
    - Checks doctor availability
    - Prevents double-booking using Redis lock
    - Creates appointment with unique ID
    """
    # Verify patient exists
    patient = db.query(Patient).filter(Patient.patient_id == booking.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{booking.patient_id}' not found"
        )

    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.doctor_id == booking.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Doctor with ID '{booking.doctor_id}' not found"
        )

    # Check if doctor is available
    if not doctor.is_available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Doctor '{doctor.name}' is currently not available for appointments"
        )

    # Create Redis lock key for this time slot
    scheduled_time_str = booking.scheduled_time.isoformat()
    lock_key = f"appointment_lock:{booking.doctor_id}:{scheduled_time_str}"

    # Try to acquire lock (set lock with 30-second expiry)
    try:
        # Check if lock already exists (another booking in progress)
        existing_lock = cache.client.get(lock_key)
        if existing_lock:
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail="Another booking is in progress for this time slot. Please try again in a moment."
            )

        # Set the lock (expires in 30 seconds)
        cache.client.setex(lock_key, 30, "locked")

        # Check for existing appointments at this time
        existing_appointment = (
            db.query(Appointment)
            .filter(
                Appointment.doctor_id == doctor.id,
                Appointment.scheduled_time == booking.scheduled_time,
                Appointment.status != "cancelled"
            )
            .first()
        )

        if existing_appointment:
            # Release lock
            cache.delete(lock_key)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Doctor '{doctor.name}' already has an appointment at {scheduled_time_str}"
            )

        # Create the appointment
        appointment_id = f"APT-{uuid.uuid4().hex[:12].upper()}"
        new_appointment = Appointment(
            appointment_id=appointment_id,
            patient_id=patient.id,
            doctor_id=doctor.id,
            scheduled_time=booking.scheduled_time,
            status="scheduled",
            reason=booking.reason,
            notes=booking.notes
        )

        db.add(new_appointment)
        db.commit()
        db.refresh(new_appointment)

        # Release lock
        cache.delete(lock_key)

        return new_appointment

    except HTTPException:
        # Re-raise HTTP exceptions (404, 409, 423)
        raise
    except Exception as e:
        # Clean up lock on any error
        cache.delete(lock_key)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to book appointment: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
