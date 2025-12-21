# SOTA Server Mode Configuration Guide

## Overview
WP Content Optimizer Pro v12.0 (SOTA Agent) uses server-side API routing via Cloudflare Pages Functions to eliminate client-side API key exposure.

## Architecture
- **Client**: React frontend (NO secrets)
- **Server**: Cloudflare Pages Functions + Secrets API
- **Storage**: Cloudflare KV (optional, encrypted)

## Required Cloudflare Secrets

### Infrastructure
- `ADMIN_TOKEN`: Admin UI protection (32 random hex chars)
- `MASTER_KEY_B64`: KV encryption key (base64, 32 bytes)

### API Keys
- `SERPER_API_KEY`: google.serper.dev
- `GEMINI_API_KEY`: Google Gemini (optional)
- `OPENAI_API_KEY`: OpenAI (optional)
- `ANTHROPIC_API_KEY`: Anthropic (optional)
- `OPENROUTER_API_KEY`: OpenRouter (optional)
- `GROQ_API_KEY`: Groq (optional)

### WordPress
- `WP_SITE_URL`: https://example.com
- `WP_USERNAME`: REST API user
- `WP_APP_PASSWORD`: Generated via WordPress Settings > Application Passwords

## Server Endpoints

### Health Check
- `GET /api/health` - Returns system readiness state

### Serper Search
- `POST /api/serper/search` - { query, num, type }

### WordPress Publishing
- `POST /api/wp/publish` - { title, content, slug, status }

## Setup

1. Generate ADMIN_TOKEN: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
2. Generate MASTER_KEY_B64: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
3. Add secrets: `npx wrangler secret put ADMIN_TOKEN`
4. WordPress: Create app password (NOT user password)
5. Deploy: `npm run deploy`

## Key Security Properties

✓ No API keys in browser
✓ No CORS failures on protected endpoints
✓ Encrypted config storage (optional KV)
✓ WordPress Basic Auth with Application Password
✓ Server-side Serper calls only

## Verification

```bash
curl https://your-site.pages.dev/api/health
```

Expect: `{"adminReady":true,"kmsReady":true,"kvReady":true,...}`
