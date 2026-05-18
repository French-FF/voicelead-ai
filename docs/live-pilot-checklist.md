# Live Pilot Checklist

Use this checklist before sharing VoiceLead AI with a buyer or running a real admissions calling test.

## Current Hosted App

- Production URL: https://voicelead-ai.vercel.app
- Feedback URL: https://voicelead-ai.vercel.app/feedback
- Health check: https://voicelead-ai.vercel.app/api/health

## 1. Durable Database

The code is ready for PostgreSQL through Prisma. Vercel marketplace provisioning currently requires account-side acceptance of Prisma marketplace terms before the free Postgres resource can be installed.

After reading and accepting the marketplace terms in the Vercel dashboard, run:

```bash
npx vercel integration add prisma/prisma-postgres \
  --scope krish-goyals-projects-3de50306 \
  --plan free \
  --name voicelead-postgres \
  -m region=sin1 \
  -e production
```

Then push the schema and seed the demo workspace:

```bash
npx vercel env pull .env.production.local --environment=production
set -a
source .env.production.local
set +a
npm run db:push
curl -X POST https://voicelead-ai.vercel.app/api/admin/seed \
  -H "x-bootstrap-token: $BOOTSTRAP_TOKEN"
```

## 2. Live AI Intelligence

Set these in Vercel production:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.2
```

Without these, `/api/calls/mock-summarize` and the Plivo webhook flow use the rule-based fallback.

## 3. Real Calling

Set these in Vercel production:

```bash
PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM_NUMBER=
APP_BASE_URL=https://voicelead-ai.vercel.app
```

The answer URL generated for Plivo is:

```text
https://voicelead-ai.vercel.app/api/webhooks/plivo/answer
```

Run a controlled test with 2-3 internal numbers before using student leads.

## 4. WhatsApp Follow-Up

Set these in Vercel production:

```bash
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_GRAPH_VERSION=v25.0
WHATSAPP_TEMPLATE_NAME=
WHATSAPP_TEMPLATE_LANGUAGE=en
```

If `WHATSAPP_TEMPLATE_NAME` is blank, the route attempts a session text message. For outbound follow-up at scale, use an approved WhatsApp template.

## 5. End-to-End Test Script

1. Sign in.
2. Create a campaign.
3. Upload a CSV or XLSX lead list.
4. Filter leads by category and campaign.
5. Export priority leads.
6. Open a lead and start a test call.
7. Submit a transcript to `/api/calls/mock-summarize` or complete a Plivo test call.
8. Send a WhatsApp follow-up.
9. Confirm the call summary, classification, score, tags, and next action update.
10. Submit buyer feedback through `/feedback`.

## 6. Compliance Gates

- Use fictional leads for open demos.
- Use internal test numbers for live-call validation.
- Do not call outside the agreed India calling window.
- Confirm opt-out handling before any scaled calling.
- Keep call recording disclosure aligned with the pilot client policy.
