@echo off
REM Healthcare Multi-Agent System - Startup Script for Windows

echo 🏥 Starting Healthcare Multi-Agent System...

REM Check if virtual environment exists
if not exist "venv\" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Please create one from .env.example
    echo    copy .env.example .env
    echo    Then edit .env with your configuration
    exit /b 1
)

REM Prompt for database initialization
set /p INIT_DB="Do you want to initialize the database schema? (y/n): "
if /i "%INIT_DB%"=="y" (
    echo 📊 Initializing database...
    echo Please run: psql %DATABASE_URL% ^< mock_data/schema.sql

    set /p SEED_DB="Do you want to load seed data? (y/n): "
    if /i "%SEED_DB%"=="y" (
        echo 🌱 Loading seed data...
        echo Please run: psql %DATABASE_URL% ^< mock_data/seed_data.sql
    )
)

REM Start the server
echo 🚀 Starting FastAPI server...
echo 📍 API will be available at http://localhost:8000
echo 📖 API docs will be available at http://localhost:8000/docs
echo.

cd backend
python main.py
