import { ArrowRight, Building2, LockKeyhole, Mail } from "lucide-react";
import { safeRedirectPath } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = safeRedirectPath(params.next);
  const showLocalDefaults = process.env.NODE_ENV !== "production";

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-950">
              Sign in to VoiceLead AI
            </h1>
            <p className="text-sm text-ink-soft">Agency-assisted workspace</p>
          </div>
        </div>

        {params.error ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
            Invalid pilot credentials. Check the configured email and password.
          </div>
        ) : null}

        <form action="/api/auth/login" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="text-sm font-medium text-zinc-800">Email</span>
            <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-line bg-white px-3">
              <Mail className="h-4 w-4 text-ink-soft" />
              <input
                name="email"
                type="email"
                defaultValue="admin@voicelead.ai"
                placeholder="admissions@company.com"
                className="w-full border-0 bg-transparent text-sm outline-none"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-800">Password</span>
            <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-line bg-white px-3">
              <LockKeyhole className="h-4 w-4 text-ink-soft" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border-0 bg-transparent text-sm outline-none"
              />
            </div>
          </label>
          <button
            className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {showLocalDefaults ? (
          <p className="mt-4 text-xs leading-5 text-ink-soft">
            Local default for development: admin@voicelead.ai / voicelead-pilot.
            Change `PILOT_ADMIN_EMAIL` and `PILOT_ADMIN_PASSWORD` before sharing.
          </p>
        ) : (
          <p className="mt-4 text-xs leading-5 text-ink-soft">
            Use the pilot credentials shared by your VoiceLead AI admin.
          </p>
        )}
      </section>
    </main>
  );
}
