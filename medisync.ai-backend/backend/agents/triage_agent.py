from typing import Dict, Any
from .base_agent import BaseAgent
from ..hooks.enforcement_hooks import EnforcementHooks

class TriageAgent(BaseAgent):
    """
    Triage Agent: Assesses patient symptoms and assigns priority levels
    """

    def __init__(self):
        super().__init__(name="triage_agent", role="symptom_assessment")

    def get_system_prompt(self) -> str:
        return """You are a medical triage AI assistant. Your role is to:

1. Assess the severity of patient symptoms
2. Assign appropriate priority levels (critical, high, medium, low)
3. Recommend the appropriate medical specialty
4. Identify any red flag symptoms that require immediate attention

Always err on the side of caution. If symptoms could indicate a serious condition,
assign a higher priority level.

Provide your assessment in JSON format with the following structure:
{
    "priority": "critical|high|medium|low",
    "urgency_score": 1-10,
    "recommended_specialty": "string",
    "red_flags": ["list of concerning symptoms"],
    "recommended_action": "immediate_er|urgent_care|schedule_appointment|self_care",
    "reasoning": "explanation of your assessment"
}

IMPORTANT: You are an AI assistant. Your assessment should always be reviewed by
a qualified healthcare professional. Include appropriate disclaimers."""

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process patient symptoms and provide triage assessment"""
        try:
            # Validate input
            self.validate_input(input_data, ["symptoms", "patient_id"])

            # Check access permissions
            EnforcementHooks.validate_data_access(
                self.name,
                input_data["patient_id"],
                "read"
            )

            # Check rate limits
            EnforcementHooks.check_rate_limits(self.name, "assess_symptoms")

            # Build user message
            user_message = f"""
Patient ID: {input_data['patient_id']}
Symptoms: {', '.join(input_data['symptoms'])}
Duration: {input_data.get('duration', 'not specified')}
Severity (patient-reported): {input_data.get('severity', 'not specified')}
Additional context: {input_data.get('additional_context', 'none')}

Please provide a triage assessment.
"""

            # Call Claude API
            response = await self.call_claude(user_message)

            # Parse response
            import json
            assessment = json.loads(response)

            # Add disclaimer
            assessment["disclaimer"] = (
                "This is an AI-assisted preliminary assessment. "
                "Seek immediate medical attention if symptoms worsen or if you have any concerns."
            )

            # Log action
            self.log_action("assess_symptoms", input_data, assessment, "success")

            # Log for audit
            EnforcementHooks.log_sensitive_action(self.name, "triage_assessment", input_data)

            return {
                "status": "success",
                "assessment": assessment
            }

        except Exception as e:
            self.log_action("assess_symptoms", input_data, None, "failure", str(e))
            return {
                "status": "error",
                "error": str(e)
            }
