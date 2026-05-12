import { CreditCard, IndianRupee, PhoneCall, ReceiptText } from "lucide-react";
import { workspace } from "@/lib/mock-data";
import { ProgressBar } from "@/components/progress-bar";

const usageRows = [
  { label: "Outbound call credits", used: 7160, limit: 20000 },
  { label: "WhatsApp follow-ups", used: 386, limit: 2500 },
  { label: "LLM summaries", used: 786, limit: 20000 },
  { label: "Training audio minutes", used: 94, limit: 500 },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
          Billing and usage
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
          Monthly credits model
        </h2>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">
              {workspace.subscriptionPlan}
            </h3>
          </div>
          <p className="mt-4 text-4xl font-semibold text-zinc-950">
            {workspace.callCreditBalance.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-sm text-ink-soft">Call credits remaining</p>
          <div className="mt-5 rounded-lg border border-line bg-panel-muted p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
              <IndianRupee className="h-4 w-4 text-emerald-700" />
              Suggested pilot pricing
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Monthly platform fee plus included call credits, overage billed by
              minute, and managed setup for campaign tuning.
            </p>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-emerald-700" />
            <h3 className="font-semibold text-zinc-950">Usage ledger</h3>
          </div>
          <div className="mt-5 space-y-5">
            {usageRows.map((row) => {
              const usage = Math.round((row.used / row.limit) * 100);
              return (
                <div key={row.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-800">
                      {row.label}
                    </span>
                    <span className="font-mono text-xs text-ink-soft">
                      {row.used.toLocaleString("en-IN")} /{" "}
                      {row.limit.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <ProgressBar value={usage} tone={usage > 75 ? "warning" : "brand"} />
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-cyan-800" />
          <h3 className="font-semibold text-zinc-950">Cost model inputs</h3>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {[
            ["Telephony", "Plivo/Twilio/Exotel per-minute"],
            ["Speech", "STT + TTS per minute"],
            ["LLM", "Summary and scoring tokens"],
            ["Ops", "Managed QA and campaign tuning"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line p-4">
              <p className="text-sm text-ink-soft">{label}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-950">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
