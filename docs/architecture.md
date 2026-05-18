# VoiceLead AI Technical Architecture

## Recommended Stack

- Frontend: Next.js App Router, React, Tailwind CSS, lucide-react.
- UI system: shadcn-ready component patterns with local Tailwind primitives for this skeleton.
- Backend: Next.js Route Handlers for MVP, later extract high-throughput calling workers.
- Database: PostgreSQL on Supabase or Neon.
- ORM: Prisma schema included in `prisma/schema.prisma`.
- Auth: pilot-grade signed HTTP-only session cookie with env-configured admin credentials. Clerk/Supabase Auth can replace it when multiple client teams need self-serve signup.
- Storage: Supabase Storage, S3, or Cloudflare R2 for recordings, transcripts, and uploads.
- Telephony: Plivo-first MVP hook, evaluate Exotel for India production compliance and support.
- Queue: BullMQ + Redis for MVP, Temporal/Inngest later for durable retries.
- AI: OpenAI for summarization/scoring, Deepgram/OpenAI/Sarvam for STT, ElevenLabs/Sarvam/Azure/Google for TTS.

## System Architecture

1. Client uploads leads and training assets.
2. API validates leads and stores normalized rows.
3. Campaign scheduler enqueues calls within allowed calling windows.
4. Worker starts outbound call through telephony provider.
5. Provider sends call events and recordings to webhooks.
6. Plivo speech input captures short conversational turns for the pilot; STT/live streaming can replace this for richer real-time calls.
7. OpenAI Responses API generates structured summary, tags, objections, extracted fields, classification, and score. If no key is configured, a rule-based fallback keeps QA flows testable.
8. Follow-up engine creates WhatsApp, human callback, email, SMS, or CRM tasks.
9. Dashboard reads aggregated campaign, source, city, language, and objection metrics.

## API Routes in This Skeleton

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

## Telephony Integration Plan

MVP provider: Plivo for fast test calls through a simple outbound API.

Production validation:

- Confirm Indian outbound calling rules, caller ID, and KYC requirements.
- Validate call recording disclosure requirements.
- Validate DND/consent handling.
- Compare Exotel, Knowlarity, MyOperator, Airtel IQ, Tata Tele, and Ozonetel for India-specific support.

The current Plivo hook creates a call record in both dry-run and live modes. It returns a dry-run payload until these env vars are set:

- `PLIVO_AUTH_ID`
- `PLIVO_AUTH_TOKEN`
- `PLIVO_FROM_NUMBER`
- `APP_BASE_URL`
- `PLIVO_WEBHOOK_SECRET`

Pilot call behavior:

- `/api/telephony/plivo/start-call` creates a call record and starts the provider call.
- `/api/webhooks/plivo/answer` returns Plivo XML with a speech input prompt.
- `/api/webhooks/plivo/input` records short lead responses, asks the next AI-generated/fallback question, and summarizes after the final turn.
- `/api/webhooks/plivo/status` persists provider status, duration, recording URL, and payload metadata.

## AI Provider Comparison

- OpenAI: strong summarization, scoring, JSON extraction, and prompt guardrails.
- Deepgram: strong STT and real-time audio support.
- Sarvam AI: India-language fit and useful for Hindi/regional language roadmap.
- ElevenLabs: high-quality TTS, needs India-context testing.
- Azure/Google Speech: reliable enterprise speech infrastructure.

## Queue and Calling Logic

- Store campaign call jobs with lead ID, campaign ID, priority, attempt count, and scheduled time.
- Enforce per-workspace concurrency limits.
- Enforce Indian calling windows.
- Skip DNC and opt-out numbers before enqueue.
- Retry no-answer leads with backoff.
- Route call-back-later leads into scheduled jobs.
- Stop all future calls when a prospect opts out.

## Security and Compliance Plan

- Tenant isolation by `workspaceId` on every table.
- Hash phone numbers in DNC tables.
- Role-based access for owner, admin, manager, sales, and viewer.
- Encrypt recordings and uploaded assets at rest.
- Store audit logs for campaign launches, exports, call starts, and DNC changes.
- Mask phone numbers in training pipelines.
- Add DND/consent status before large-scale production calls.
- Rate limit upload, call start, and webhook endpoints.
- Do not claim to be human if disclosure is configured or legally required.

## Deployment Plan

- Deploy web app to Vercel.
- Use Supabase/Neon Postgres.
- Use Supabase Storage/R2 for files.
- Use Upstash Redis or managed Redis for BullMQ.
- Expose webhook base URL through `APP_BASE_URL`.
- Add environment-specific provider credentials.
- Run a small real-call pilot before enabling campaign-wide concurrency.

Operational pilot env vars:

- `DATABASE_URL`
- `VOICELEAD_SESSION_SECRET`
- `PILOT_ADMIN_EMAIL`
- `PILOT_ADMIN_PASSWORD`
- `BOOTSTRAP_TOKEN`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `PLIVO_AUTH_ID`
- `PLIVO_AUTH_TOKEN`
- `PLIVO_FROM_NUMBER`
- `PLIVO_WEBHOOK_SECRET`
- `APP_BASE_URL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`

## Cost Estimate Per Call

Use a formula instead of hardcoding vendor rates:

`telephony minutes + STT minutes + TTS minutes + LLM tokens + WhatsApp/SMS + storage + platform margin`

Pilot assumption for a 3-minute connected call:

- Telephony: provider per-minute rate multiplied by 3.
- STT/TTS: speech provider per-minute rate multiplied by 3.
- LLM: one conversation orchestration stream plus one structured summary/scoring call.
- Storage: small recording/transcript cost.

Target pilot pricing should leave room for managed QA and failed/no-answer attempts, not just connected call cost.

## MVP Roadmap

Week 1:

- Finalize admissions template, knowledge base, scoring rubric, dashboard, lead upload, and mock summaries.

Week 2:

- Add database/auth/storage, call queue, DNC suppression, Plivo test calls, webhook persistence.

Week 3:

- Add STT, LLM structured summary, WhatsApp follow-up, and counselor assignment.

Week 4:

- Run Masters' Union-style pilot batch, inspect call quality, refine scripts from transcripts/audio, and measure counselor conversion lift.
