import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  Star,
} from "lucide-react";
import { buyerDemoPath, feedbackQuestions } from "@/lib/mock-data";

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to demo
          </Link>
          <Link
            href="/leads/lead_aanya"
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Inspect sample lead
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.6fr_0.4fr] lg:px-8">
        <div>
          <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-900">
              <MessageSquareText className="h-4 w-4" />
              Buyer feedback preview
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-zinc-950">
              Help us stress-test the admissions voice intelligence experience.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-700">
              This preview is designed for admissions leaders, founders, and
              sales heads evaluating whether AI voice can qualify leads before
              counselors spend time on them.
            </p>
          </div>

          <section className="mt-5 rounded-lg border border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-950">
              Feedback form
            </h2>
            <form action="/api/feedback" method="post" className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-800">
                    Name
                  </span>
                  <input
                    name="name"
                    className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-zinc-800">
                    Company
                  </span>
                  <input
                    name="company"
                    className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-800">
                    Role
                  </span>
                  <input
                    name="role"
                    placeholder="Founder, admissions head, sales lead"
                    className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-zinc-800">
                    Would you pilot this?
                  </span>
                  <select
                    name="pilotIntent"
                    className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
                    defaultValue="Maybe"
                  >
                    <option>Yes</option>
                    <option>Maybe</option>
                    <option>No</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-zinc-800">
                  What felt most valuable?
                </span>
                <textarea
                  name="mostValuable"
                  className="mt-2 min-h-24 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cyan-700"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-800">
                  What felt confusing, missing, or not credible yet?
                </span>
                <textarea
                  name="friction"
                  className="mt-2 min-h-28 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cyan-700"
                />
              </label>

              <button className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
                Submit feedback
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-700" />
              <h2 className="font-semibold text-zinc-950">
                Review checklist
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              {feedbackQuestions.map((question) => (
                <div
                  key={question}
                  className="flex gap-3 rounded-lg border border-line bg-panel-muted p-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <p className="text-sm leading-6 text-zinc-700">{question}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-950">Suggested walkthrough</h2>
            <div className="mt-4 space-y-3">
              {buyerDemoPath.map((item) => (
                <Link
                  key={item.step}
                  href={item.href}
                  className="flex gap-3 rounded-lg border border-line bg-panel-muted p-3 hover:bg-cyan-50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-sm font-semibold text-cyan-900 shadow-sm">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-950">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-ink-soft">
                      {item.detail}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
