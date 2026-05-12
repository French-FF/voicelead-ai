# Temporary Preview Hosting

Yes, VoiceLead AI can be hosted temporarily so admissions leaders, founders, and early buyers can review the UX.

## Recommended Option

Use Vercel first because this is a Next.js app and Vercel creates a unique deployment URL for every deploy. That is the fastest way to share a working preview without buying a domain.

Current live preview:

- App: https://voicelead-ai.vercel.app
- Feedback: https://voicelead-ai.vercel.app/feedback

## Good Alternatives

- Netlify: strong deploy previews and a built-in review drawer for stakeholder comments.
- Cloudflare Pages: preview deployments with noindex headers by default.
- Railway/Render: useful later if the backend grows beyond Next.js route handlers.

## Safe Preview Checklist

- Keep the app in demo mode with mock data.
- Do not add real student phone numbers to the preview.
- Do not enable live calling for public reviewers.
- Use fake API credentials or no credentials for telephony/WhatsApp.
- Add password protection if sharing beyond a small trusted buyer group.
- Capture feedback through `/feedback`, Tally, Typeform, Airtable, Notion, or Google Forms.

## Vercel Preview Steps

1. Build locally with `npm run build`.
2. Deploy a preview with Vercel.
3. Share the generated preview URL with reviewers.
4. Ask reviewers to follow the guided demo path and submit feedback.
5. Iterate before adding real-call credentials.

## Environment Variables Needed Later

```bash
PLIVO_AUTH_ID=
PLIVO_AUTH_TOKEN=
PLIVO_FROM_NUMBER=
APP_BASE_URL=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
DATABASE_URL=
```
