# 🔄 API Migration Notice

## OpenRouter Integration

This project now uses **OpenRouter** instead of Anthropic's direct API. OpenRouter provides:

- ✅ **Auto model selection** - OpenRouter intelligently selects the best available model
- ✅ **Model fallback** - Automatic failover if a model is unavailable
- ✅ **Cost optimization** - Routes to cost-effective models when appropriate
- ✅ **Multiple providers** - Access to Claude, GPT-4, and other models through one API

## What Changed

### API Configuration
- **Before:** `ANTHROPIC_API_KEY`
- **After:** `OPENROUTER_API_KEY`

### Dependencies
- **Before:** `anthropic` Python package
- **After:** `openai` Python package (OpenRouter uses OpenAI-compatible API)

### Model Selection
- **Before:** Explicitly specified `claude-sonnet-5`
- **After:** `model="auto"` (OpenRouter selects the best model)

## Setup

1. **Get API Key:**
   - Visit [OpenRouter.ai](https://openrouter.ai/)
   - Create an account and generate an API key
   - Add credits to your account

2. **Configure Environment:**
   ```bash
   # In .env file
   OPENROUTER_API_KEY="sk-or-v1-..."
   ```

3. **No other changes needed** - All agent functionality remains the same

## Benefits

- **Reliability:** Automatic fallback if one model is down
- **Flexibility:** Access to multiple AI providers
- **Cost Control:** OpenRouter can route to cheaper models when appropriate
- **Future-proof:** Easy to switch between different AI models

## API Compatibility

OpenRouter uses OpenAI's API format, making it easy to:
- Switch between providers
- Use with existing OpenAI-compatible tools
- Maintain consistent code structure

## Testing

Verify your setup:

```bash
# Test API connection
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"

# Test the system
python cli.py test patient
```

## Documentation

For more information:
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Supported Models](https://openrouter.ai/models)
- [Pricing](https://openrouter.ai/docs#pricing)

---

All code changes are minimal and isolated to:
- `backend/agents/base_agent.py` - API client
- `backend/config.py` - Configuration
- `.env.example` - Environment template
- `requirements.txt` - Dependencies

**No changes to agent logic, database, or API endpoints.**
