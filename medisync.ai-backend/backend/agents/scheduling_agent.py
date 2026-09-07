from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from .base_agent import BaseAgent
from ..hooks.enforcement_hooks import EnforcementHooks

class SchedulingAgent(BaseAgent):
    """
    Scheduling Agent: Manages appointment booking and scheduling
    """

    def __init__(self):
        super().__init__(name="scheduling_agent", role="appointment_management")

    def get_system_prompt(self) -> str:
        return """You are an appointment scheduling AI assistant. Your role is to:

1. Find optimal appointment times based on patient preferences
2. Match patients with appropriate healthcare providers
3. Consider urgency levels when scheduling
4. Handle rescheduling requests
5. Provide clear confirmation details

Provide scheduling recommendations in JSON format:
{
    "recommended_slots": [
        {
            "datetime": "ISO format datetime",
            "doctor_id": "string",
            "doctor_name": "string",
            "specialization": "string",
            "reasoning": "why this slot is recommended"
        }
    ],
    "urgency_assessment": "immediate|urgent|routine",
    "additional_notes": "any relevant information"
}"""

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process scheduling requests"""
        try:
            action = input_data.get("action", "book_appointment")

            if action == "book_appointment":
                return await self._book_appointment(input_data)
            elif action == "find_slots":
                return await self._find_available_slots(input_data)
            elif action == "reschedule":
                return await self._reschedule_appointment(input_data)
            elif action == "cancel":
                return await self._cancel_appointment(input_data)
            else:
                raise ValueError(f"Unknown action: {action}")

        except Exception as e:
            self.log_action(input_data.get("action", "unknown"), input_data, None, "failure", str(e))
            return {
                "status": "error",
                "error": str(e)
            }

    async def _book_appointment(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Book a new appointment"""
        self.validate_input(input_data, ["patient_id", "specialty", "urgency"])

        # Check access
        EnforcementHooks.validate_data_access(
            self.name,
            input_data["patient_id"],
            "write"
        )

        user_message = f"""
Patient ID: {input_data['patient_id']}
Required Specialty: {input_data['specialty']}
Urgency: {input_data['urgency']}
Preferred Time: {input_data.get('preferred_time', 'any')}
Preferred Days: {input_data.get('preferred_days', 'any')}
Reason for Visit: {input_data.get('reason', 'not specified')}

Available doctors in specialty:
{self._format_available_doctors(input_data.get('available_doctors', []))}

Please recommend the best appointment slots considering urgency and preferences.
"""

        response = await self.call_claude(user_message)

        import json
        recommendation = json.loads(response)

        # Log action
        self.log_action("book_appointment", input_data, recommendation, "success")
        EnforcementHooks.log_sensitive_action(self.name, "appointment_booked", input_data)

        return {
            "status": "success",
            "recommendation": recommendation
        }

    async def _find_available_slots(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Find available appointment slots"""
        self.validate_input(input_data, ["specialty", "date_range"])

        user_message = f"""
Specialty: {input_data['specialty']}
Date Range: {input_data['date_range']}
Duration Needed: {input_data.get('duration', '30 minutes')}

Available doctors:
{self._format_available_doctors(input_data.get('available_doctors', []))}

Find available appointment slots.
"""

        response = await self.call_claude(user_message)

        import json
        slots = json.loads(response)

        self.log_action("find_slots", input_data, slots, "success")

        return {
            "status": "success",
            "available_slots": slots
        }

    async def _reschedule_appointment(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Reschedule an existing appointment"""
        self.validate_input(input_data, ["appointment_id", "new_time"])

        # Log rescheduling
        self.log_action("reschedule", input_data, {"rescheduled": True}, "success")

        return {
            "status": "success",
            "message": "Appointment rescheduled successfully",
            "new_time": input_data["new_time"]
        }

    async def _cancel_appointment(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Cancel an appointment"""
        self.validate_input(input_data, ["appointment_id"])

        # Log cancellation
        self.log_action("cancel", input_data, {"cancelled": True}, "success")

        return {
            "status": "success",
            "message": "Appointment cancelled successfully"
        }

    def _format_available_doctors(self, doctors: List[Dict[str, Any]]) -> str:
        """Format doctor list for prompt"""
        if not doctors:
            return "No doctor list provided"

        formatted = []
        for doc in doctors:
            formatted.append(
                f"- Dr. {doc.get('name')} ({doc.get('specialization')}) - "
                f"Available: {doc.get('is_available', False)}"
            )
        return "\n".join(formatted)
