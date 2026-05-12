import Link from "next/link";
import { ArrowRight, Clock3, MessageCircle, PhoneCall } from "lucide-react";
import {
  campaigns,
  dashboardMetrics,
  followUpTasks,
  leads,
  objectionTrends,
  sourcePerformance,
} from "@/lib/mock-data";
import { LeadTable } from "@/components/lead-table";
import { MetricCard } from "@/components/metric-card";
import { ProgressBar } from "@/components/progress-bar";
import { DemoPath } from "@/components/demo-path";
import { ReadinessPanel } from "@/components/readiness-panel";
import { StatusBadge } from "@/components/status-badge";

export default function DashboardPage() {
  const liveCampaign = campaigns[0];
  const priorityLeads = leads
    .filter((lead) =>
      ["Hot", "Needs Human Follow-Up", "Call Back Later"].includes(
        lead.classification,
      ),
    )
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <DemoPath />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
                Campaign performance
              </p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                {liveCampaign.campaignName}
              </h2>
            </div>
            <StatusBadge value={liveCampaign.status} type="campaign" />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            {[
              ["Leads", liveCampaign.leadCount.toLocaleString()],
              ["Completed", liveCampaign.callsCompleted.toLocaleString()],
              ["Connected", liveCampaign.connectedCalls.toLocaleString()],
              ["Avg score", `${liveCampaign.averageScore}/100`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line p-4">
                <p className="text-sm text-ink-soft">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-950">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold text-zinc-950">Top objections</h3>
              <div className="mt-3 space-y-4">
                {objectionTrends.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium text-zinc-800">
                        {item.label}
                      </span>
                      <span className="font-mono text-xs text-ink-soft">
                        {item.count}
                      </span>
                    </div>
                    <ProgressBar value={item.share} tone="warning" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-950">
                Source performance
              </h3>
              <div className="mt-3 overflow-hidden rounded-lg border border-line">
                <table className="min-w-full divide-y divide-line text-sm">
                  <thead className="bg-panel-muted text-left text-xs font-semibold uppercase tracking-normal text-ink-soft">
                    <tr>
                      <th className="px-3 py-2">Source</th>
                      <th className="px-3 py-2">Score</th>
                      <th className="px-3 py-2">Hot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {sourcePerformance.map((source) => (
                      <tr key={source.source}>
                        <td className="px-3 py-3 text-zinc-800">
                          {source.source}
                        </td>
                        <td className="px-3 py-3 font-semibold text-zinc-950">
                          {source.score}
                        </td>
                        <td className="px-3 py-3 text-emerald-700">
                          {source.hotRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ReadinessPanel />

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-cyan-800" />
              <h2 className="font-semibold text-zinc-950">Call readiness</h2>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Provider</dt>
                <dd className="font-semibold text-zinc-950">Plivo first</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Mode</dt>
                <dd className="font-semibold text-zinc-950">Real-call hooks</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Calling window</dt>
                <dd className="font-semibold text-zinc-950">10 AM - 7 PM</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Disclosure</dt>
                <dd className="font-semibold text-zinc-950">Client controlled</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-700" />
              <h2 className="font-semibold text-zinc-950">Follow-up queue</h2>
            </div>
            <div className="mt-4 space-y-3">
              {followUpTasks.map((task) => {
                const lead = leads.find((item) => item.id === task.leadId);
                return (
                  <div
                    key={task.id}
                    className="rounded-lg border border-line bg-panel-muted p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-zinc-950">
                          {lead?.name}
                        </p>
                        <p className="mt-1 text-sm text-ink-soft">
                          {task.taskType}
                        </p>
                      </div>
                      <StatusBadge value={task.status} />
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-zinc-600">
                      <Clock3 className="h-3.5 w-3.5" />
                      {new Date(task.dueDate).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              Priority leads
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Hot, callback, and human-follow-up leads from the active campaign.
            </p>
          </div>
          <Link
            href="/leads"
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            View leads
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <LeadTable leads={priorityLeads} />
      </section>
    </div>
  );
}
