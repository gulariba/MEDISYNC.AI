#!/usr/bin/env python3
"""
Healthcare Multi-Agent System CLI Tool

Usage:
    python cli.py db init          # Initialize database
    python cli.py db seed          # Load seed data
    python cli.py db reset         # Reset database
    python cli.py server start     # Start the server
    python cli.py test patient     # Test with sample patient
    python cli.py logs tail        # Tail application logs
"""

import sys
import os
import subprocess
import argparse
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

def run_command(cmd, shell=True):
    """Run a shell command"""
    try:
        result = subprocess.run(cmd, shell=shell, check=True, capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}", file=sys.stderr)
        return False

def db_init():
    """Initialize database schema"""
    print("🔧 Initializing database schema...")
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not set in environment")
        return False

    schema_file = Path(__file__).parent / "mock_data" / "schema.sql"
    cmd = f'psql "{database_url}" < {schema_file}'
    return run_command(cmd)

def db_seed():
    """Load seed data"""
    print("🌱 Loading seed data...")
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not set in environment")
        return False

    seed_file = Path(__file__).parent / "mock_data" / "seed_data.sql"
    cmd = f'psql "{database_url}" < {seed_file}'
    return run_command(cmd)

def db_reset():
    """Reset database (drop and recreate)"""
    print("⚠️  WARNING: This will delete all data!")
    confirm = input("Type 'yes' to confirm: ")
    if confirm.lower() != 'yes':
        print("Cancelled")
        return False

    db_init()
    db_seed()
    return True

def server_start():
    """Start the FastAPI server"""
    print("🚀 Starting Healthcare Multi-Agent System server...")
    os.chdir(Path(__file__).parent / "backend")
    cmd = "python main.py"
    return run_command(cmd)

def test_patient():
    """Test system with a sample patient triage"""
    print("🧪 Testing system with sample patient...")
    import requests

    url = "http://localhost:8000/agents/triage"
    data = {
        "patient_id": "TEST001",
        "symptoms": ["fever", "cough", "fatigue"],
        "duration": "3 days",
        "severity": "moderate"
    }

    try:
        response = requests.post(url, json=data)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:\n{response.json()}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def logs_tail():
    """Tail application logs"""
    log_file = Path(__file__).parent / "logs" / "healthcare_system.log"
    if not log_file.exists():
        print(f"❌ Log file not found: {log_file}")
        return False

    cmd = f"tail -f {log_file}"
    return run_command(cmd)

def main():
    parser = argparse.ArgumentParser(description="Healthcare Multi-Agent System CLI")
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')

    # Database commands
    db_parser = subparsers.add_parser('db', help='Database operations')
    db_subparsers = db_parser.add_subparsers(dest='db_command')
    db_subparsers.add_parser('init', help='Initialize database schema')
    db_subparsers.add_parser('seed', help='Load seed data')
    db_subparsers.add_parser('reset', help='Reset database')

    # Server commands
    server_parser = subparsers.add_parser('server', help='Server operations')
    server_subparsers = server_parser.add_subparsers(dest='server_command')
    server_subparsers.add_parser('start', help='Start the server')

    # Test commands
    test_parser = subparsers.add_parser('test', help='Test operations')
    test_subparsers = test_parser.add_subparsers(dest='test_command')
    test_subparsers.add_parser('patient', help='Test with sample patient')

    # Logs commands
    logs_parser = subparsers.add_parser('logs', help='Log operations')
    logs_subparsers = logs_parser.add_subparsers(dest='logs_command')
    logs_subparsers.add_parser('tail', help='Tail application logs')

    args = parser.parse_args()

    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()

    # Execute command
    if args.command == 'db':
        if args.db_command == 'init':
            db_init()
        elif args.db_command == 'seed':
            db_seed()
        elif args.db_command == 'reset':
            db_reset()
    elif args.command == 'server':
        if args.server_command == 'start':
            server_start()
    elif args.command == 'test':
        if args.test_command == 'patient':
            test_patient()
    elif args.command == 'logs':
        if args.logs_command == 'tail':
            logs_tail()
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
