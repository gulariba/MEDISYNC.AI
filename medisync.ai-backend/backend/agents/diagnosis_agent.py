from typing import Dict, Any, List
from .base_agent import BaseAgent
from ..hooks.enforcement_hooks import EnforcementHooks

class DiagnosisAgent(BaseAgent):
    """
    Diagnosis Agent: Provides preliminary diagnostic suggestions based on symptoms
    """

    def __init__(self):
        super().__init__(name="diagnosis_agent", role="preliminary_diagnosis")

    def get_system_prompt(self) -> str:
        return """You are a medical diagnosis AI assistant. Your role is to:

1. Analyze patient symptoms and medical history
2. Generate a differential diagnosis (list of possible conditions)
3. Suggest relevant diagnostic tests or examinations
4. Provide probability estimates for each condition
5. Recommend next steps for evaluation

CRITICAL DISCLAIMERS:
- You provide preliminary suggestions only, NOT definitive diagnoses
- All assessments must be reviewed and confirmed by licensed healthcare providers
- Your suggestions are educational and supportive of clinical decision-making
- Do not recommend specific medications or treatments

Provide your assessment in JSON format:
{
    "differential_diagnosis": [
        {
            "condition": "condition name",
            "probability": "high|medium|low",
            "reasoning": "explanation",
            "supporting_symptoms": ["list"],
            "contradicting_factors": ["list"]
        }
    ],
    "recommended_tests": ["list of diagnostic tests"],
    "red_flags": ["list of concerning findings"],
    "follow_up_questions": ["list of clarifying questions for the provider"],
    "confidence_level": "high|medium|low",
    "reasoning": "overall clinical reasoning"
}"""

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate preliminary diagnostic suggestions"""
        try:
            # Validate input
            self.validate_input(input_data, ["symptoms", "patient_id"])

            # Validate access
            EnforcementHooks.validate_data_access(
                self.name,
                input_data["patient_id"],
                "read"
            )

            # Build comprehensive context
            user_message = f"""
Patient ID: {input_data['patient_id']}

PRESENTING SYMPTOMS:
{self._format_symptoms(input_data['symptoms'])}

PATIENT HISTORY:
Age: {input_data.get('age', 'not specified')}
Sex: {input_data.get('sex', 'not specified')}
Medical History: {input_data.get('medical_history', 'none reported')}
Current Medications: {input_data.get('medications', 'none reported')}
Allergies: {input_data.get('allergies', 'none reported')}

ADDITIONAL CONTEXT:
{input_data.get('additional_context', 'none')}

Please provide a preliminary diagnostic assessment with differential diagnosis.
"""

            # Call Claude API
            response = await self.call_claude(user_message, max_tokens=8192)

            # Parse response
            import json
            diagnosis = json.loads(response)

            # Validate and add constraints
            EnforcementHooks.validate_diagnosis_constraints({
                **diagnosis,
                "ai_generated": True
            })

            # Add mandatory disclaimer
            diagnosis["disclaimer"] = (
                "This is an AI-generated preliminary assessment for educational and "
                "clinical decision support purposes only. It is NOT a definitive diagnosis. "
                "All findings must be evaluated and confirmed by a licensed healthcare provider "
                "through appropriate clinical examination and diagnostic testing."
            )

            # Log the action
            self.log_action("generate_diagnosis", input_data, diagnosis, "success")
            EnforcementHooks.log_sensitive_action(self.name, "diagnosis_generated", input_data)

            return {
                "status": "success",
                "diagnosis": diagnosis
            }

        except Exception as e:
            self.log_action("generate_diagnosis", input_data, None, "failure", str(e))
            return {
                "status": "error",
                "error": str(e)
            }

    def _format_symptoms(self, symptoms: List[str]) -> str:
        """Format symptoms list for better readability"""
        if isinstance(symptoms, list):
            return "\n".join(f"- {symptom}" for symptom in symptoms)
        return str(symptoms)
