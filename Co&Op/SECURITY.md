# MySideKik Security Guidelines

## Environment Variables
- **NEVER commit `.env` file** - it contains your OpenAI API key
- `.env` is in `.gitignore` for security
- Use `.env.example` as a template (rename to `.env` and add your real API key)

## Backend Security

### Rate Limiting
- **Chat endpoint**: 30 requests per 15 minutes
- **API calls**: Limited to prevent spam and abuse
- Prevents DOS attacks and API quota exhaustion

### Input Validation
- Messages limited to 1000 characters (enforced server-side)
- Input type checking (must be string)
- Empty message rejection
- Mode parameter sanitization (only valid modes accepted)

### Error Handling
- No sensitive information exposed in error messages
- Stack traces logged to console only (not sent to frontend)
- Generic error messages returned to client
- API key never exposed in responses

### API Security
- CORS enabled for local development
- JSON body size limited to 1MB
- Request timeout protection (30 second limit)
- API key stored only in backend environment variables

## Frontend Security

### No API Secrets
- OpenAI API key **never** in JavaScript or HTML
- All API calls go through backend proxy
- Frontend communicates only with local server

### Character Limits
- Frontend enforces 1000 character limit
- Backend validates and enforces again
- Defense in depth approach

## Deployment Checklist

Before deploying to production:

1. [ ] Set `OPENAI_API_KEY` in production environment
2. [ ] Use environment variables, NOT hardcoded secrets
3. [ ] Enable HTTPS/TLS for all connections
4. [ ] Consider stricter rate limits based on user base
5. [ ] Monitor API usage and costs
6. [ ] Set up logging and alerting
7. [ ] Test error handling with invalid inputs
8. [ ] Verify .env is not in git history

## Running Locally

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your OpenAI API key
echo "OPENAI_API_KEY=sk-..." >> .env

# Start server
node server.js
```

## API Endpoints

All requests are rate limited to 30 per 15 minutes per IP.

### POST /chat
- **Body**: `{ message: string, mode: string }`
- **Limits**: 1000 characters max
- **Returns**: `{ reply: string }` or `{ error: string }`

### POST /reset
- **Body**: empty
- **Returns**: `{ message: string }`

## Monitoring

Monitor these metrics in production:
- API request rate (spikes may indicate abuse)
- Error rates (troubleshoot failures)
- Response times (OpenAI API performance)
- Rate limit hits (blocked requests)
