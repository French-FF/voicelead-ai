import { Activity, AlertTriangle, Building2, ShieldCheck } from "lucide-react";
import { campaigns, workspace } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

const platformRows = [
  ["Clients", "1 active pilot"],
  ["Provider", "Plivo first, Exotel fallback"],
  ["AI usage", "Mock summaries plus OpenAI hook next"],
  ["Compliance", "DNC, audit logs, calling windows"],
  ["Failed calls", "42 this week"],
  ["Estimated gross margin", "Needs live provider data"],
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
          Super admin
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
          SaaS owner console
        </h2>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">Pilot workspace</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            {workspace.companyName} · {workspace.industry}
          </p>
        </article>
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-700" />
            <h3 className="font-semibold text-zinc-950">Usage health</h3>
          </div>
          <p className="mt-3 text-3xl font-semibold text-zinc-950">Normal</p>
        </article>
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-700" />
            <h3 className="font-semibold text-zinc-950">Risks</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-700">
            Live-call pricing and DLT/telecom compliance need provider-side
            validation before production traffic.
          </p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            <h3 className="font-semibold text-zinc-950">Platform controls</h3>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-line">
            <table className="min-w-full divide-y divide-line text-sm">
              <tbody className="divide-y divide-line">
                {platformRows.map(([label, value]) => (
                  <tr key={label}>
                    <td className="bg-panel-muted px-4 py-3 font-medium text-zinc-800">
                      {label}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-zinc-950">Campaign governance</h3>
          <div className="mt-4 space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-lg border border-line bg-panel-muted p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-zinc-950">
                    {campaign.campaignName}
                  </p>
                  <StatusBadge value={campaign.status} type="campaign" />
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  {campaign.callsCompleted} completed calls ·{" "}
                  {campaign.averageScore}/100 avg score
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
