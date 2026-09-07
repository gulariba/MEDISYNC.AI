# OpenRouter Setup Guide

## Quick Setup

### 1. Get Your API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to your [API Keys page](https://openrouter.ai/keys)
4. Click "Create Key" and copy your API key
5. Add credits to your account (pay-as-you-go pricing)

### 2. Configure Your Project

Add the API key to your `.env` file:

```bash
OPENROUTER_API_KEY="sk-or-v1-..."
```

### 3. That's It!

The system will automatically:
- ✅ Select the best available model for each request
- ✅ Fall back to alternative models if needed
- ✅ Optimize for cost and performance
- ✅ Handle rate limiting and retries

## Model Selection

This project uses `model="auto"` which allows OpenRouter to:

1. **Choose the best model** based on:
   - Task complexity
   - Current availability
   - Cost efficiency
   - Response quality

2. **Common models selected:**
   - Claude 3.5 Sonnet (high quality medical reasoning)
   - GPT-4 Turbo (balanced performance)
   - Claude 3 Haiku (fast responses)
   - Llama 3 70B (cost-effective)

3. **Automatic fallback:**
   - If primary model is unavailable, automatically switches
   - No code changes needed
   - Seamless user experience

## Pricing

OpenRouter uses pay-as-you-go pricing:

- **Claude 3.5 Sonnet:** ~$3 per million input tokens
- **GPT-4 Turbo:** ~$10 per million input tokens
- **Claude 3 Haiku:** ~$0.25 per million input tokens

Typical healthcare query costs: $0.01 - $0.05 per interaction

**Tip:** OpenRouter's auto mode balances quality and cost automatically.

## Testing Your Setup

```bash
# Test API key
curl https://openrouter.ai/api/v1/auth/key \
  -H "Authorization: Bearer $OPENROUTER_API_KEY"

# Should return: {"data": {"label": "...", "limit": ...}}

# Test in the app
python cli.py test patient
```

## Advanced Configuration

### Set Model Preferences (Optional)

If you want to specify models instead of using `auto`, edit `backend/agents/base_agent.py`:

```python
# For highest quality
model="anthropic/claude-3.5-sonnet"

# For cost optimization
model="anthropic/claude-3-haiku"

# For balance
model="openai/gpt-4-turbo"

# For automatic selection (default)
model="auto"
```

### Set Routing Preferences (Optional)

Add to your API requests:

```python
# Prefer Claude models
extra_headers={
    "X-Title": "Healthcare System",
    "HTTP-Referer": "https://your-domain.com",
    "X-Model-Preference": "anthropic"
}
```

## Monitoring Usage

1. Visit [OpenRouter Dashboard](https://openrouter.ai/activity)
2. View:
   - Total requests
   - Cost per request
   - Model usage distribution
   - Response times
   - Error rates

## Rate Limits

OpenRouter provides generous rate limits:
- **Free tier:** Limited requests for testing
- **Paid tier:** Based on credits purchased
- **No hard limits:** Pay for what you use

## Support

- **Documentation:** [openrouter.ai/docs](https://openrouter.ai/docs)
- **Discord:** Join OpenRouter community
- **Email:** support@openrouter.ai

## Benefits Over Direct API

✅ **Multi-provider access** - Claude, GPT-4, Llama, and more  
✅ **No vendor lock-in** - Easy to switch models  
✅ **Cost optimization** - Automatic routing to best value  
✅ **Higher reliability** - Fallback models prevent downtime  
✅ **Unified billing** - One account for all models  
✅ **Better rates** - Volume pricing across models  

## Security

- API keys are never logged
- All traffic is encrypted (HTTPS)
- Keys can be rotated anytime
- Supports IP whitelisting (enterprise)

---

**Ready to go!** Your OpenRouter integration is complete.
