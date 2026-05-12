import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { campaigns, dashboardMetrics, workspace } from "@/lib/mock-data";
import { MetricCard } from "@/components/metric-card";
import { DemoPath } from "@/components/demo-path";

export default function Home() {
  const primaryCampaign = campaigns[0];

  return (
    <main className="min-h-screen bg-background">
      <section className="surface-grid border-b border-line bg-white">
        <div className="mx-auto grid min-h-[88vh] max-w-7xl content-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-900">
              <PhoneCall className="h-4 w-4" />
              India-first admissions voice intelligence
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-6xl">
              VoiceLead AI
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-700">
              An AI outbound calling platform for Masters&apos; Union style
              admissions teams: qualify undergraduate prospects, capture messy
              Hinglish conversations, and route the right leads to counselors.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/feedback"
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
              >
                Review as buyer
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                "Hinglish + English calls",
                "Undergraduate admissions context",
                "Manual transcripts/audio training",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-panel p-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-cyan-800">
                  Live campaign
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-950">
                  {primaryCampaign.campaignName}
                </h2>
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                {primaryCampaign.status}
              </div>
            </div>
            <div className="grid gap-3 py-4 sm:grid-cols-2">
              {dashboardMetrics.slice(0, 4).map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-line bg-panel-muted p-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-cyan-800" />
                  <p className="font-semibold text-zinc-950">
                    AI call outcome
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Aanya is a high-intent Class XII student. She asked for
                  WhatsApp details and agreed to a counselor callback today.
                </p>
              </div>
              <div className="rounded-lg border border-line bg-panel-muted p-4">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-5 w-5 text-emerald-700" />
                  <p className="font-semibold text-zinc-950">Next action</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Send approved UGP brochure on WhatsApp and assign Rhea from
                  admissions for a same-day call.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-zinc-950">
                    Compliance mode
                  </p>
                  <p className="text-sm text-ink-soft">
                    {workspace.complianceMode}, DNC suppression, allowed calling
                    windows
                  </p>
                </div>
              </div>
              <Link
                href="/agent"
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
              >
                Agent settings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DemoPath />
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            {
              title: "For admissions leaders",
              text: "See which enquiries deserve counselor time, why the AI classified them, and what to do next.",
            },
            {
              title: "For counselors",
              text: "Open one lead, read the summary, check objections, and call only when the prospect is ready.",
            },
            {
              title: "For pilots",
              text: "Start with 500-1,000 warm leads, run real test calls, collect feedback, then tune scripts.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-line bg-panel-muted p-5"
            >
              <h2 className="text-lg font-semibold text-zinc-950">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
