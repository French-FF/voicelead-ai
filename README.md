# VoiceLead AI

AI-powered outbound voice calling and lead qualification for Indian education teams.

This MVP is built around the first pilot use case: Masters' Union-style UGP 2027 admissions outreach. It includes a premium SaaS dashboard, campaign builder, lead table, lead/call intelligence views, AI agent settings, knowledge base, manual transcript/audio training uploads, billing usage, admin controls, and integration hooks for real outbound calling.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- TypeScript
- Prisma schema for PostgreSQL
- Plivo-first telephony hook for MVP testing
- OpenAI-backed call intelligence with rule-based fallback
- WhatsApp Business Cloud API hook with dry-run fallback

## Run Locally

```bash
npm install
npm run db:push # only when DATABASE_URL is configured
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Local pilot login defaults:

```bash
email: admin@voicelead.ai
password: voicelead-pilot
```

Set `PILOT_ADMIN_EMAIL`, `PILOT_ADMIN_PASSWORD`, and `VOICELEAD_SESSION_SECRET`
before sharing with external testers.

## Live Preview

- Public platform: [https://voicelead-ai.vercel.app](https://voicelead-ai.vercel.app)
- Buyer feedback page: [https://voicelead-ai.vercel.app/feedback](https://voicelead-ai.vercel.app/feedback)

## Useful Routes

- `/dashboard` - admissions outreach cockpit
- `/campaigns` - campaign list
- `/campaigns/new` - controlled campaign creation flow
- `/leads` - lead table and CSV upload
- `/leads/lead_aanya` - lead detail example
- `/calls` - call intelligence queue
- `/calls/call_aanya_01` - call intelligence example
- `/agent` - AI voice agent settings
- `/knowledge` - knowledge base and transcript/audio uploads
- `/analytics` - source, city, language, and objection analytics
- `/billing` - monthly credits and usage
- `/admin` - SaaS owner console
- `/feedback` - buyer feedback collection page

## API Hooks

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/admin/seed`
- `GET /api/campaigns`
- `POST /api/campaigns`
- `GET /api/leads`
- `GET /api/leads/export`
- `POST /api/leads/upload`
- `POST /api/training-assets`
- `POST /api/calls/mock-summarize`
- `POST /api/telephony/plivo/start-call`
- `GET|POST /api/webhooks/plivo/answer`
- `POST /api/webhooks/plivo/input`
- `POST /api/webhooks/plivo/status`
- `POST /api/followups/whatsapp`
- `POST /api/feedback`

## Operational MVP Setup

Create `.env.local` from `.env.example`.

Minimum secure pilot:

```bash
VOICELEAD_SESSION_SECRET=
PILOT_ADMIN_EMAIL=
PILOT_ADMIN_PASSWORD=
```

DB-backed pilot:

```bash
DATABASE_URL=
BOOTSTRAP_TOKEN=
npm run db:push
curl -X POST http://localhost:3000/api/admin/seed \
  -H "x-bootstrap-token: $BOOTSTRAP_TOKEN"
```

Live AI call intelligence:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.2
```

Real-call test:

The Plivo start-call route returns a dry-run payload until these are set:

```bash
PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM_NUMBER=
PLIVO_WEBHOOK_SECRET=
APP_BASE_URL=
```

WhatsApp follow-up:

```bash
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_GRAPH_VERSION=v25.0
WHATSAPP_TEMPLATE_NAME= # optional approved template name
WHATSAPP_TEMPLATE_LANGUAGE=en
```

Pilot upload limits:

```bash
LEAD_UPLOAD_MAX_BYTES=5242880
TRAINING_ASSET_MAX_BYTES=26214400
```

## End-to-End Pilot Flow

1. Sign in at `/login`.
2. Seed demo workspace through `/api/admin/seed` if using a fresh database.
3. Create a campaign at `/campaigns/new`.
4. Upload a CSV or XLSX at `/leads`.
5. Open a lead detail page and click `Start test call`.
6. Plivo answers through `/api/webhooks/plivo/answer` and speech turns route through `/api/webhooks/plivo/input`.
7. If live AI is configured, call summaries use OpenAI. Otherwise the rule-based fallback still classifies and scores.
8. Click `Send WhatsApp follow-up` from a lead detail page.
9. Review call intelligence, lead category, score, tags, and next action.

## Docs

- Product requirements: `docs/product-requirements.md`
- Technical architecture: `docs/architecture.md`
- Preview hosting: `docs/preview-hosting.md`
- Live pilot checklist: `docs/live-pilot-checklist.md`
- Database schema: `prisma/schema.prisma`
