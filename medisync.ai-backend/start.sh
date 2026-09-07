#!/bin/bash

# Healthcare Multi-Agent System - Startup Script

echo "🏥 Starting Healthcare Multi-Agent System..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please create one from .env.example"
    echo "   cp .env.example .env"
    echo "   Then edit .env with your configuration"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Initialize database (optional - run schema if needed)
read -p "Do you want to initialize the database schema? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 Initializing database..."
    psql $DATABASE_URL < mock_data/schema.sql

    read -p "Do you want to load seed data? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Loading seed data..."
        psql $DATABASE_URL < mock_data/seed_data.sql
    fi
fi

# Start the server
echo "🚀 Starting FastAPI server..."
echo "📍 API will be available at http://localhost:8000"
echo "📖 API docs will be available at http://localhost:8000/docs"
echo ""

cd backend
python main.py
