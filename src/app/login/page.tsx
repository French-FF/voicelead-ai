import Link from "next/link";
import { ArrowRight, Building2, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
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

        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-800">Email</span>
            <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-line bg-white px-3">
              <Mail className="h-4 w-4 text-ink-soft" />
              <input
                type="email"
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
                type="password"
                placeholder="Password"
                className="w-full border-0 bg-transparent text-sm outline-none"
              />
            </div>
          </label>
          <Link
            href="/dashboard"
            className="focus-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </form>
      </section>
    </main>
  );
}
