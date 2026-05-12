import Link from "next/link";
import { ArrowRight, Bot, GraduationCap, UploadCloud } from "lucide-react";

const steps = [
  {
    title: "Company context",
    icon: GraduationCap,
    fields: ["Masters' Union", "Education and admissions", "UGP 2027 batch"],
  },
  {
    title: "Voice agent",
    icon: Bot,
    fields: ["Hinglish + English", "Client-controlled disclosure", "Counselor escalation"],
  },
  {
    title: "Training inputs",
    icon: UploadCloud,
    fields: ["Manual transcripts", "Call audio recordings", "Approved FAQs"],
  },
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
            Workspace onboarding
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
            Configure Masters&apos; Union admissions outreach
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-700">
            The MVP starts as a managed workspace for one education use case:
            undergraduate lead qualification, real-call testing, WhatsApp follow-up, and
            training from historical manual reachouts.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <section
                key={step.title}
                className="rounded-lg border border-line bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-800">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-zinc-950">
                  {step.title}
                </h2>
                <div className="mt-4 space-y-2">
                  {step.fields.map((field) => (
                    <div
                      key={field}
                      className="rounded-md border border-line bg-panel-muted px-3 py-2 text-sm text-zinc-700"
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-5 rounded-lg border border-line bg-white p-6 shadow-sm">
          <form className="grid gap-4 lg:grid-cols-2">
            {[
              "Company name",
              "Website",
              "Target students",
              "Key geographies",
              "Common objections",
              "Approved admissions claims",
            ].map((label) => (
              <label key={label} className="block">
                <span className="text-sm font-medium text-zinc-800">
                  {label}
                </span>
                <input className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700" />
              </label>
            ))}
          </form>
          <div className="mt-6 flex justify-end">
            <Link
              href="/dashboard"
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Save workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
