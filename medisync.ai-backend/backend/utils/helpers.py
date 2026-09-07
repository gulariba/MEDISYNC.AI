from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import hashlib
import json

def generate_hash(data: Dict[str, Any]) -> str:
    """
    Generate a hash from dictionary data
    Useful for caching and deduplication
    """
    serialized = json.dumps(data, sort_keys=True)
    return hashlib.sha256(serialized.encode()).hexdigest()

def mask_phi(text: str, mask_char: str = "*") -> str:
    """
    Mask Protected Health Information (PHI) in text
    Simple implementation - in production, use more sophisticated methods
    """
    # This is a basic implementation
    # In production, use NLP/NER to identify and mask actual PHI
    sensitive_patterns = [
        "ssn", "social security", "dob", "date of birth",
        "phone", "email", "address"
    ]

    masked_text = text
    for pattern in sensitive_patterns:
        if pattern in text.lower():
            masked_text = masked_text.replace(pattern, mask_char * len(pattern))

    return masked_text

def format_datetime(dt: Optional[datetime] = None, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Format datetime to string"""
    if dt is None:
        dt = datetime.utcnow()
    return dt.strftime(format_str)

def parse_datetime(date_string: str, format_str: str = "%Y-%m-%d %H:%M:%S") -> datetime:
    """Parse string to datetime"""
    return datetime.strptime(date_string, format_str)

def calculate_age(date_of_birth: datetime) -> int:
    """Calculate age from date of birth"""
    today = datetime.utcnow()
    age = today.year - date_of_birth.year
    if today.month < date_of_birth.month or (
        today.month == date_of_birth.month and today.day < date_of_birth.day
    ):
        age -= 1
    return age

def sanitize_input(text: str) -> str:
    """
    Sanitize user input to prevent injection attacks
    """
    # Remove potentially dangerous characters
    dangerous_chars = ["<", ">", "&", '"', "'", ";", "--", "/*", "*/"]
    sanitized = text
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, "")
    return sanitized.strip()

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone: str) -> bool:
    """Basic phone number validation"""
    import re
    # Remove common formatting characters
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    # Check if it's a valid number (10-15 digits)
    return bool(re.match(r'^\d{10,15}$', cleaned))

def chunk_list(items: list, chunk_size: int) -> list:
    """Split a list into chunks of specified size"""
    return [items[i:i + chunk_size] for i in range(0, len(items), chunk_size)]

def retry_with_backoff(func, max_attempts: int = 3, initial_delay: float = 1.0):
    """
    Decorator for retrying functions with exponential backoff
    """
    import time
    from functools import wraps

    @wraps(func)
    def wrapper(*args, **kwargs):
        delay = initial_delay
        last_exception = None

        for attempt in range(max_attempts):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                if attempt < max_attempts - 1:
                    time.sleep(delay)
                    delay *= 2  # Exponential backoff

        raise last_exception

    return wrapper

def get_severity_color(severity: str) -> str:
    """Get color code for severity level (for CLI output)"""
    colors = {
        "critical": "\033[91m",  # Red
        "high": "\033[93m",      # Yellow
        "medium": "\033[94m",    # Blue
        "low": "\033[92m",       # Green
        "info": "\033[97m"       # White
    }
    reset = "\033[0m"
    return colors.get(severity.lower(), reset)
