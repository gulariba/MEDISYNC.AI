#!/usr/bin/env python3
"""
Quick test script to verify database connection.
Fetches and prints all patients from the database.
"""

import sys
import os

# Add the project root to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

print("=" * 60)
print("Testing Database Connection")
print("=" * 60)
print(f"DATABASE_URL: {DATABASE_URL}")
print()

if not DATABASE_URL:
    print("✗ DATABASE_URL is not set in .env file")
    sys.exit(1)

# Create engine with short timeout
try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        connect_args={
            "connect_timeout": 5,  # 5 second timeout
            "options": "-c statement_timeout=5000"  # 5 second query timeout
        }
    )
    print("✓ Engine created successfully")
except Exception as e:
    print(f"✗ Failed to create engine: {e}")
    sys.exit(1)

# Test connection
try:
    print("Attempting to connect to database...")
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1 as test"))
        row = result.fetchone()
        print(f"✓ Connection successful! Test query returned: {row[0]}")
except Exception as e:
    print(f"✗ Connection failed: {e}")
    print()
    print("Common issues:")
    print("1. PostgreSQL is not running on localhost:5432")
    print("2. Database 'healthcare_db' does not exist")
    print("3. Username/password are incorrect")
    print("4. Firewall blocking connection")
    print()
    print("To fix:")
    print("- Update DATABASE_URL in .env with your actual database credentials")
    print("- Or use a cloud database like Neon (see .env comments)")
    sys.exit(1)

# If connection works, try to query patients
try:
    from backend.db.models import Patient, Doctor, Appointment, MedicalRecord
    from backend.db.connection import SessionLocal

    db = SessionLocal()

    # Check if tables exist
    print()
    print("Checking tables...")

    # Fetch all patients
    patients = db.query(Patient).all()
    print(f"✓ Found {len(patients)} patient(s)")

    if patients:
        print()
        print("Patients in database:")
        print("-" * 60)
        for patient in patients:
            print(f"  • {patient.patient_id}: {patient.name} (DOB: {patient.date_of_birth.date()})")

    # Fetch doctors
    doctors = db.query(Doctor).all()
    print(f"✓ Found {len(doctors)} doctor(s)")

    # Fetch appointments
    appointments = db.query(Appointment).all()
    print(f"✓ Found {len(appointments)} appointment(s)")

    # Fetch medical records
    records = db.query(MedicalRecord).all()
    print(f"✓ Found {len(records)} medical record(s)")

    db.close()

    print()
    print("=" * 60)
    print("✓ All tests passed! Database is ready.")
    print("=" * 60)

except Exception as e:
    print(f"✗ Error querying tables: {e}")
    print()
    print("The database exists but tables may not be created.")
    print("Run these SQL scripts to set up the database:")
    print("  1. mock_data/schema.sql")
    print("  2. mock_data/seed_data.sql")
    sys.exit(1)
