# Healthcare Multi-Agent System - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- OpenRouter API Key

### Installation

1. **Clone and navigate to project:**
   ```bash
   cd C:\Users\AK\Desktop\alibaba
   ```

2. **Set up environment:**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate (Windows)
   venv\Scripts\activate
   
   # Activate (Unix/Mac)
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/healthcare"
   REDIS_URL="redis://localhost:6379/0"
   OPENROUTER_API_KEY="your_api_key_here"
   ```

4. **Initialize database:**
   ```bash
   # Using CLI tool
   python cli.py db init
   python cli.py db seed
   
   # Or manually
   psql $DATABASE_URL < mock_data/schema.sql
   psql $DATABASE_URL < mock_data/seed_data.sql
   ```

5. **Start the server:**
   ```bash
   python cli.py server start
   
   # Or directly
   cd backend
   python main.py
   ```

6. **Test the system:**
   ```bash
   # Open browser
   http://localhost:8000/docs
   
   # Or test with CLI
   python cli.py test patient
   ```

## 🐳 Docker Quick Start

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your OPENROUTER_API_KEY

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## 📝 First API Call

```bash
# Health check
curl http://localhost:8000/health

# Triage assessment
curl -X POST http://localhost:8000/agents/triage \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "P001",
    "symptoms": ["fever", "cough"],
    "severity": "moderate"
  }'
```

## 🧪 Running Tests

```bash
# Install test dependencies
pip install -r requirements-dev.txt

# Run all tests
pytest

# Run with coverage
pytest --cov=backend

# Run specific test file
pytest test_api.py
```

## 📚 Documentation

- **API Docs:** http://localhost:8000/docs
- **API Examples:** [API_EXAMPLES.md](./API_EXAMPLES.md)
- **Development Guide:** [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Main README:** [README.md](./README.md)

## 🔧 Common Commands

```bash
# Database operations
python cli.py db init     # Initialize schema
python cli.py db seed     # Load test data
python cli.py db reset    # Reset database

# Server operations
python cli.py server start

# Testing
python cli.py test patient

# Logs
python cli.py logs tail
```

## 🆘 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

### API Key Issues
```bash
# Verify API key is set
echo $OPENROUTER_API_KEY

# Check .env file
cat .env | grep OPENROUTER
```

## 📊 Project Structure

```
alibaba/
├── backend/
│   ├── agents/           # AI agent implementations
│   ├── db/               # Database models
│   ├── hooks/            # Compliance enforcement
│   ├── routes/           # API endpoints
│   ├── utils/            # Utilities
│   ├── config.py         # Configuration
│   └── main.py           # Application entry
├── mock_data/            # Sample data
├── .env.example          # Environment template
├── cli.py                # CLI tool
├── docker-compose.yml    # Docker setup
└── requirements.txt      # Dependencies
```

## 🔐 Security Notes

- Change `SECRET_KEY` in production
- Never commit `.env` file
- Use HTTPS in production
- Configure proper CORS origins
- Enable encryption for PHI data
- Regular security audits

## 📞 Support

For issues or questions:
1. Check [DEVELOPMENT.md](./DEVELOPMENT.md)
2. Review [API_EXAMPLES.md](./API_EXAMPLES.md)
3. Check GitHub Issues (if applicable)

## 📝 Next Steps

1. ✅ Complete quick setup above
2. 📖 Read [API_EXAMPLES.md](./API_EXAMPLES.md) for usage examples
3. 🧑‍💻 Review [DEVELOPMENT.md](./DEVELOPMENT.md) for development guidelines
4. 🧪 Run tests to verify everything works
5. 🚀 Start building your healthcare application!
