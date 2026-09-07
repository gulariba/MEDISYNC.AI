# Makefile for Healthcare Multi-Agent System

.PHONY: help install test run docker-up docker-down clean lint format

help:
	@echo "Healthcare Multi-Agent System - Available commands:"
	@echo ""
	@echo "  make install       - Install dependencies"
	@echo "  make dev-install   - Install dev dependencies"
	@echo "  make run           - Run the application"
	@echo "  make test          - Run tests"
	@echo "  make test-cov      - Run tests with coverage"
	@echo "  make lint          - Run linters"
	@echo "  make format        - Format code"
	@echo "  make docker-up     - Start Docker containers"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make db-init       - Initialize database"
	@echo "  make db-seed       - Load seed data"
	@echo "  make clean         - Clean build artifacts"
	@echo ""

install:
	pip install -r requirements.txt

dev-install:
	pip install -r requirements.txt
	pip install -r requirements-dev.txt

run:
	cd backend && python main.py

test:
	pytest

test-cov:
	pytest --cov=backend --cov-report=html --cov-report=term

lint:
	flake8 backend --count --select=E9,F63,F7,F82 --show-source --statistics
	flake8 backend --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics

format:
	black backend/
	isort backend/

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f api

db-init:
	python cli.py db init

db-seed:
	python cli.py db seed

db-reset:
	python cli.py db reset

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name "*.pyo" -delete 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf .pytest_cache .coverage htmlcov/ dist/ build/ 2>/dev/null || true

venv:
	python -m venv venv
	@echo "Virtual environment created. Activate with:"
	@echo "  source venv/bin/activate  (Unix/Mac)"
	@echo "  venv\\Scripts\\activate  (Windows)"
