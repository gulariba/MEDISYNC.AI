from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from openai import OpenAI, api_key
import os
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class BaseAgent(ABC):
    """Base class for all healthcare agents"""

    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.client = OpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1"
        )
        print("api key:", os.getenv("OPENROUTER_API_KEY"))
    @abstractmethod
    def get_system_prompt(self) -> str:
        """Return the system prompt for this agent"""
        pass

    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the input and return a response"""
        pass

    async def call_claude(self, user_message: str, max_tokens: int = 4096) -> str:
        """Make a call to OpenRouter API"""
        try:
            response = self.client.chat.completions.create(
                model="auto",  # Let OpenRouter handle model selection
                max_tokens=max_tokens,
                messages=[
                    {"role": "system", "content": self.get_system_prompt()},
                    {"role": "user", "content": user_message}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error calling OpenRouter API: {str(e)}")

    def log_action(self, action: str, input_data: Any, output_data: Any, status: str = "success", error: Optional[str] = None):
        """Log agent actions for audit trail"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent": self.name,
            "role": self.role,
            "action": action,
            "input": input_data,
            "output": output_data,
            "status": status,
            "error": error
        }
        # TODO: Store in database or logging system
        print(f"[{self.name}] {json.dumps(log_entry, indent=2)}")

    def validate_input(self, input_data: Dict[str, Any], required_fields: list) -> bool:
        """Validate that required fields are present in input"""
        for field in required_fields:
            if field not in input_data:
                raise ValueError(f"Missing required field: {field}")
        return True
