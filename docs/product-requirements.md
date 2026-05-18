# VoiceLead AI PRD

## Product Positioning

VoiceLead AI is a managed B2B SaaS platform for Indian admissions teams that turns outbound and inbound lead calls into qualified pipeline intelligence. The first pilot vertical is education, starting with Masters' Union-style undergraduate admissions outreach for the 2027 intake cycle.

The product is not a basic calling bot. It is a first-layer sales development system that calls, qualifies, summarizes, scores, tags, and routes leads.

## Locked MVP Decisions

- First ICP: education and coaching, specifically undergraduate admissions.
- First client context: Masters' Union undergraduate admissions outreach.
- First calling type: inbound lead qualification and warm outbound follow-up.
- Languages: Hinglish and English.
- AI disclosure: configurable by client, with compliance guardrails.
- Calling mode: real test calls in MVP, with mock intelligence data available for demos.
- Provider choice: Plivo-first hook for testing, Exotel as India-production fallback to validate.
- Follow-up: WhatsApp included in MVP as a queue/API hook.
- SaaS motion: agency-assisted first.
- Pricing: monthly credits with managed setup and usage overage.
- Script customization: controlled templates plus editable sections.
- Industry scope: one industry first.
- Training context: clients can upload manual call transcripts and audio recordings.

## MVP Feature List

- Public landing page and login screen.
- Managed workspace onboarding.
- Company profile and admissions context setup.
- Campaign list and create-campaign flow.
- AI agent settings for voice, tone, Hinglish behavior, disclosure, do-not-say rules, and escalation.
- CSV/XLSX lead upload endpoint with validation for missing/invalid numbers and duplicates.
- Lead table, filters, status badges, temperature categories, and priority lead export.
- Lead detail page with custom fields, call history, score, tags, and next action.
- Call detail page with mock transcript, summary, objections, extracted fields, score, tags, and recording placeholder.
- Knowledge base with approved course context, FAQs, objection handling, and manual transcript/audio upload.
- Dashboard with campaign metrics, objections, source performance, callback queue, and call readiness.
- Analytics for source, city, language, objection, and time-of-day performance.
- Billing/usage page for monthly credits.
- Super-admin page for SaaS owner controls.
- API hooks for campaigns, leads, CSV/XLSX upload, lead export, training assets, mock summaries, Plivo calls, Plivo webhooks, and WhatsApp follow-up.

## Primary User Journeys

1. Client onboarding
   Admissions operator creates a managed workspace, enters college/course context, uploads approved FAQs, selects Hinglish + English, and configures disclosure.

2. Campaign launch
   Operator creates the UGP 2027 qualification campaign from a controlled template, edits the opening pitch and must-ask questions, uploads leads, validates numbers, and launches calls inside allowed windows.

3. AI qualification
   Agent calls the prospect, confirms identity and availability, asks adaptive qualification questions, handles objections from the approved knowledge base, and routes high-intent or sensitive calls to humans.

4. Sales follow-up
   Counselor views hot/warm/human-follow-up leads, reads summaries, sees objections and extracted fields, then calls or sends WhatsApp follow-up.

5. Agent refinement
   Client uploads manual reachout transcripts/audio. The system extracts winning openings, common objections, Hinglish patterns, and handoff triggers for agent QA.

## Dashboard Wireframe Structure

- Top metrics: total leads, calls completed, connected calls, hot leads, callback requests, average score, credits left.
- Main campaign panel: status, call completion, connection rate, hot/warm breakdown, average score.
- Objection analysis: fee, scholarships, parent discussion, college comparison, early-stage interest.
- Source performance: website forms, Meta leads, education fair, Google Ads, referrals.
- Call readiness: provider, calling mode, calling window, disclosure setting.
- Follow-up queue: WhatsApp tasks and human callbacks.
- Priority lead table: hot, call-back-later, and human-follow-up leads.

## Campaign Creation Flow

1. Select objective: lead qualification.
2. Select template: education admissions UGP.
3. Define campaign basics: name, language, target audience, city focus.
4. Configure agent: voice, tone, speed, disclosure, escalation.
5. Edit opening pitch and qualification questions.
6. Define scoring rules and lead categories.
7. Upload or import leads.
8. Validate DND/DNC/duplicate/invalid numbers.
9. Set calling windows, concurrency, retry policy.
10. Launch test batch, inspect summaries, then scale.

## Lead Scoring Framework

- Interest signals: asks about admissions, deadlines, curriculum, campus, scholarship, or career outcomes.
- Fit signals: current class, student/parent role, target program, geography, application cycle.
- Engagement signals: stays on call, gives full answers, asks questions, requests WhatsApp details.
- Conversion signals: agrees to counselor callback, shares parent availability, asks next steps.
- Negative signals: not interested, wrong program, postgraduate-only interest, invalid number, opt-out.

Default scoring:

- Hot: 75-100
- Warm: 50-74
- Cold: 20-49
- Not interested/wrong target/DNC: rule-based override
- Needs human follow-up: sensitive or high-value escalation trigger

## AI Conversation Flow

1. Start call.
2. Greet naturally in English or Hinglish.
3. Confirm identity if lead name is present.
4. Ask if it is a good time.
5. If no, capture callback time.
6. Explain approved reason for call.
7. Ask qualification questions.
8. Adapt follow-ups to student/parent, class, city, interest, and timeline.
9. Handle objections only from approved context.
10. Offer WhatsApp details or counselor callback.
11. Respect opt-out immediately.
12. Close politely.
13. Generate summary, classification, score, tags, and follow-up task.

## Industry-Specific Use Case: Education Admissions

- Inbound web form qualification.
- Education fair lead follow-up.
- Masterclass invitation.
- Parent counseling callback booking.
- Scholarship objection routing.
- Dormant lead reactivation.
- WhatsApp brochure follow-up.

## Pricing Suggestions

- Pilot plan: monthly platform fee plus included call credits.
- Growth plan: higher call credits, WhatsApp credits, managed tuning, and analytics.
- Overage: billed by call minute plus AI processing margin.
- Setup: one-time managed onboarding for templates, QA, knowledge base, compliance, and test calls.

## GTM Strategy for Indian Businesses

- Start with admissions teams that already buy leads and run call centers.
- Sell ROI as counselor time saved and faster hot-lead routing.
- Offer a 2-week managed pilot with 500-1,000 leads.
- Use before/after metrics: connect rate, hot lead rate, callback acceptance, counselor conversion, and cost per qualified lead.
- Expand from one UGP campaign to webinars, reactivation, scholarship counseling, and parent follow-up.
