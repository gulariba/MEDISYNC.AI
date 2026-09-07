# Contributing to Healthcare Multi-Agent System

Thank you for your interest in contributing to the Healthcare Multi-Agent System! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding a New Agent](#adding-a-new-agent)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize patient safety and HIPAA compliance
- Report security vulnerabilities privately

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/alibaba.git
   cd alibaba
   ```
3. **Set up development environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```
4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

```bash
# 1. Make your changes
# 2. Run tests
pytest

# 3. Check code style
make lint

# 4. Format code
make format

# 5. Commit changes
git add .
git commit -m "feat: add your feature description"

# 6. Push to your fork
git push origin feature/your-feature-name

# 7. Open a Pull Request
```

## Adding a New Agent

Here's how to add a new agent to the system:

### 1. Create the Agent File

Create `backend/agents/your_agent.py`:

```python
from typing import Dict, Any
from .base_agent import BaseAgent
from ..hooks.enforcement_hooks import EnforcementHooks

class YourAgent(BaseAgent):
    """
    Your Agent: Brief description of what this agent does
    """

    def __init__(self):
        super().__init__(name="your_agent", role="your_role")

    def get_system_prompt(self) -> str:
        return """You are a [description] AI assistant. Your role is to:

1. [Primary responsibility]
2. [Secondary responsibility]
3. [Tertiary responsibility]

Provide your response in JSON format:
{
    "field1": "value",
    "field2": "value"
}"""

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the input and return a response"""
        try:
            # Validate input
            self.validate_input(input_data, ["required_field1", "required_field2"])

            # Check permissions if needed
            EnforcementHooks.validate_data_access(
                self.name,
                input_data.get("patient_id"),
                "read"
            )

            # Build user message
            user_message = f"""
Your specific prompt here with:
- {input_data.get('field1')}
- {input_data.get('field2')}

Please provide your analysis.
"""

            # Call Claude API
            response = await self.call_claude(user_message)

            # Parse and return
            import json
            result = json.loads(response)

            # Log the action
            self.log_action("your_action", input_data, result, "success")
            EnforcementHooks.log_sensitive_action(self.name, "action_completed", input_data)

            return {
                "status": "success",
                "result": result
            }

        except Exception as e:
            self.log_action("your_action", input_data, None, "failure", str(e))
            return {
                "status": "error",
                "error": str(e)
            }
```

### 2. Register the Agent

Update `backend/agents/__init__.py`:

```python
from .base_agent import BaseAgent
from .triage_agent import TriageAgent
from .diagnosis_agent import DiagnosisAgent
from .scheduling_agent import SchedulingAgent
from .your_agent import YourAgent  # Add this

__all__ = [
    "BaseAgent",
    "TriageAgent",
    "DiagnosisAgent",
    "SchedulingAgent",
    "YourAgent"  # Add this
]
```

### 3. Add API Route

Update `backend/routes/agent_routes.py`:

```python
from ..agents.your_agent import YourAgent

# Initialize agent
your_agent = YourAgent()

# Add request model
class YourAgentRequest(BaseModel):
    field1: str
    field2: Optional[str] = None

# Add endpoint
@router.post("/your-agent")
async def your_agent_endpoint(request: YourAgentRequest):
    """
    Your agent endpoint description
    """
    try:
        result = await your_agent.process(request.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 4. Add Tests

Create tests in `test_agents.py`:

```python
def test_your_agent_initialization():
    """Test your agent initialization"""
    agent = YourAgent()
    assert agent.name == "your_agent"
    assert agent.role == "your_role"
```

### 5. Update Documentation

Add your agent to:
- `README.md` (Agents section)
- `API_EXAMPLES.md` (with usage example)
- `PROJECT_SUMMARY.md` (update agent count)

## Coding Standards

### Python Style
- Follow PEP 8
- Use type hints
- Maximum line length: 100 characters
- Use meaningful variable names
- Add docstrings to all functions and classes

### Example:
```python
def calculate_age(date_of_birth: datetime) -> int:
    """
    Calculate age from date of birth.
    
    Args:
        date_of_birth: Patient's date of birth
        
    Returns:
        Age in years
        
    Raises:
        ValueError: If date_of_birth is in the future
    """
    today = datetime.utcnow()
    if date_of_birth > today:
        raise ValueError("Date of birth cannot be in the future")
    
    age = today.year - date_of_birth.year
    if today.month < date_of_birth.month:
        age -= 1
    return age
```

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

Examples:
- `feat: add prescription validation agent`
- `fix: correct triage priority calculation`
- `docs: update API examples for scheduling agent`

## Testing Guidelines

### Writing Tests
```python
import pytest
from backend.agents import YourAgent

@pytest.fixture
def agent():
    return YourAgent()

def test_agent_validates_input(agent):
    """Test that agent validates required input"""
    invalid_input = {}
    with pytest.raises(ValueError):
        agent.validate_input(invalid_input, ["required_field"])

@pytest.mark.asyncio
async def test_agent_processes_valid_input(agent):
    """Test agent processes valid input successfully"""
    valid_input = {
        "required_field": "value"
    }
    result = await agent.process(valid_input)
    assert result["status"] == "success"
```

### Running Tests
```bash
# All tests
pytest

# Specific file
pytest test_agents.py

# With coverage
pytest --cov=backend --cov-report=html

# Specific test
pytest test_agents.py::test_agent_validates_input
```

## Pull Request Process

1. **Ensure all tests pass**
2. **Update documentation**
3. **Add test coverage for new code**
4. **Follow the commit message format**
5. **Fill out the PR template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No breaking changes
```

## HIPAA Compliance Considerations

When contributing, always consider:
- **Data Privacy:** Never log or expose PHI unnecessarily
- **Access Control:** Validate permissions appropriately
- **Audit Trail:** Log all data access and modifications
- **Data Minimization:** Only request/store necessary data
- **Disclaimers:** Include appropriate medical disclaimers for AI-generated content

## Questions or Issues?

- Check existing [GitHub Issues](https://github.com/YOUR_ORG/alibaba/issues)
- Read the [DEVELOPMENT.md](./DEVELOPMENT.md) guide
- Review [API_EXAMPLES.md](./API_EXAMPLES.md) for usage patterns

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to healthcare AI! 🏥
