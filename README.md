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

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live Preview

- Public platform: [https://voicelead-ai.vercel.app](https://voicelead-ai.vercel.app)
- Buyer feedback page: [https://voicelead-ai.vercel.app/feedback](https://voicelead-ai.vercel.app/feedback)

## Useful Routes

- `/dashboard` - admissions outreach cockpit
- `/campaigns` - campaign list
- `/campaigns/new` - controlled campaign creation flow
- `/leads` - lead table and CSV upload
- `/leads/lead_aanya` - lead detail example
- `/calls/call_aanya_01` - call intelligence example
- `/agent` - AI voice agent settings
- `/knowledge` - knowledge base and transcript/audio uploads
- `/analytics` - source, city, language, and objection analytics
- `/billing` - monthly credits and usage
- `/admin` - SaaS owner console
- `/feedback` - buyer feedback collection page

## API Hooks

- `GET /api/campaigns`
- `POST /api/campaigns`
- `GET /api/leads`
- `POST /api/leads/upload`
- `POST /api/training-assets`
- `POST /api/calls/mock-summarize`
- `POST /api/telephony/plivo/start-call`
- `GET|POST /api/webhooks/plivo/answer`
- `POST /api/webhooks/plivo/status`
- `POST /api/followups/whatsapp`
- `POST /api/feedback`

## Real-Call Test Env Vars

The Plivo start-call route returns a dry-run payload until these are set:

```bash
PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM_NUMBER=
APP_BASE_URL=
```

## Docs

- Product requirements: `docs/product-requirements.md`
- Technical architecture: `docs/architecture.md`
- Preview hosting: `docs/preview-hosting.md`
- Database schema: `prisma/schema.prisma`
