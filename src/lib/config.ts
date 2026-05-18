export const DEFAULT_WORKSPACE_ID = "ws_masters_union";

export function getBaseUrl(request?: Request) {
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/$/, "");
  }

  const origin = request?.headers.get("origin");
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const host = request?.headers.get("host");
  if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL || "gpt-5.2";
}

export function providerStatus() {
  return {
    database: hasDatabase(),
    openai: Boolean(process.env.OPENAI_API_KEY),
    plivo: Boolean(
      process.env.PLIVO_AUTH_ID &&
        process.env.PLIVO_AUTH_TOKEN &&
        process.env.PLIVO_FROM_NUMBER &&
        process.env.APP_BASE_URL &&
        process.env.PLIVO_WEBHOOK_SECRET,
    ),
    whatsapp: Boolean(
      process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID,
    ),
  };
}

export const providerRequirements = {
  database: ["DATABASE_URL"],
  openai: ["OPENAI_API_KEY"],
  plivo: [
    "PLIVO_AUTH_ID",
    "PLIVO_AUTH_TOKEN",
    "PLIVO_FROM_NUMBER",
    "APP_BASE_URL",
    "PLIVO_WEBHOOK_SECRET",
  ],
  whatsapp: ["WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID"],
} as const;

export function missingProviderEnv() {
  return Object.fromEntries(
    Object.entries(providerRequirements).map(([provider, keys]) => [
      provider,
      keys.filter((key) => !process.env[key]),
    ]),
  ) as Record<keyof typeof providerRequirements, string[]>;
}

export function operationalReadiness() {
  const providers = providerStatus();
  const missing = missingProviderEnv();

  return {
    providers,
    missing,
    readyForBuyerDemo: Boolean(
      providers.database ||
        (process.env.PILOT_ADMIN_EMAIL &&
          process.env.PILOT_ADMIN_PASSWORD &&
          process.env.VOICELEAD_SESSION_SECRET),
    ),
    readyForLiveCalls: Boolean(
      providers.database &&
        providers.openai &&
        providers.plivo &&
        missing.plivo.length === 0,
    ),
    readyForWhatsApp: providers.whatsapp,
  };
}

export function withPlivoWebhookSecret(rawUrl: string) {
  const secret = process.env.PLIVO_WEBHOOK_SECRET;
  if (!secret) return rawUrl;

  const url = new URL(rawUrl);
  url.searchParams.set("token", secret);
  return url.toString();
}

export function isPlivoWebhookAuthorized(request: Request) {
  const secret = process.env.PLIVO_WEBHOOK_SECRET;
  if (!secret) return true;

  const url = new URL(request.url);
  return (
    url.searchParams.get("token") === secret ||
    request.headers.get("x-voicelead-webhook-secret") === secret
  );
}
