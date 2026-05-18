import { BarChart3, Clock3, Languages, MapPin } from "lucide-react";
import { dashboardMetrics } from "@/lib/mock-data";
import {
  getCityPerformance,
  getLanguagePerformance,
  getObjectionTrends,
  getSourcePerformance,
  getTimeOfDayPerformance,
} from "@/lib/analytics";
import { getCurrentSession } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import { MetricCard } from "@/components/metric-card";
import { ProgressBar } from "@/components/progress-bar";

export default async function AnalyticsPage() {
  const session = await getCurrentSession();
  const snapshot = await getWorkspaceSnapshot(session?.workspaceId);
  const objectionTrends = getObjectionTrends(snapshot.calls);
  const cityPerformance = getCityPerformance(snapshot.leads);
  const languagePerformance = getLanguagePerformance(snapshot.calls);
  const sourcePerformance = getSourcePerformance(snapshot.leads);
  const timeSlots = getTimeOfDayPerformance(snapshot.calls);
  const metrics = [
    { label: "Total leads", value: snapshot.leads.length.toLocaleString("en-IN"), delta: `${snapshot.mode} mode` },
    {
      label: "Calls analyzed",
      value: snapshot.calls.filter((call) => call.shortSummary).length.toLocaleString("en-IN"),
      delta: "Transcript intelligence generated",
    },
    {
      label: "Hot leads",
      value: snapshot.leads.filter((lead) => lead.classification === "Hot").length.toLocaleString("en-IN"),
      delta: "Counselor priority",
    },
    {
      label: "DNC",
      value: snapshot.leads.filter((lead) => lead.classification === "Do Not Contact").length.toLocaleString("en-IN"),
      delta: "Suppressed from future calls",
    },
    {
      label: "Avg score",
      value:
        snapshot.leads.length > 0
          ? Math.round(snapshot.leads.reduce((sum, lead) => sum + lead.conversionScore, 0) / snapshot.leads.length).toString()
          : "0",
      delta: "Lead conversion probability",
    },
    { label: "Campaigns", value: snapshot.campaigns.length.toString(), delta: "Configured flows" },
  ];

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
          Analytics
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
          Admissions intelligence
        </h2>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {(snapshot.leads.length ? metrics : dashboardMetrics).map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">Objection analysis</h3>
          </div>
          <div className="mt-5 space-y-4">
            {objectionTrends.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-800">{item.label}</span>
                  <span className="font-semibold text-zinc-950">
                    {item.share}%
                  </span>
                </div>
                <ProgressBar value={item.share} tone="warning" />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-700" />
            <h3 className="font-semibold text-zinc-950">City performance</h3>
          </div>
          <div className="mt-5 space-y-4">
            {cityPerformance.map((item) => (
              <div key={item.city}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-800">{item.city}</span>
                  <span className="font-semibold text-zinc-950">
                    {item.score}/100
                  </span>
                </div>
                <ProgressBar
                  value={item.score}
                  tone={item.score > 70 ? "success" : "brand"}
                />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">
              Language performance
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {languagePerformance.map((item) => (
              <div key={item.language} className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-zinc-950">{item.language}</p>
                  <p className="text-sm text-ink-soft">
                    {item.connected} connected
                  </p>
                </div>
                <div className="mt-3">
                  <ProgressBar value={item.score} tone="success" />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-amber-700" />
            <h3 className="font-semibold text-zinc-950">
              Time-of-day connect rate
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {timeSlots.map((item) => (
              <div key={item.slot}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-zinc-800">{item.slot}</span>
                  <span className="font-semibold text-zinc-950">
                    {item.rate}%
                  </span>
                </div>
                <ProgressBar value={item.rate} tone="brand" />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-zinc-950">
            Source-wise conversion potential
          </h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-line">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-panel-muted text-left text-xs font-semibold uppercase tracking-normal text-ink-soft">
                <tr>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Leads</th>
                  <th className="px-3 py-2">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {sourcePerformance.map((item) => (
                  <tr key={item.source}>
                    <td className="px-3 py-3 text-zinc-800">{item.source}</td>
                    <td className="px-3 py-3 text-zinc-700">{item.leads}</td>
                    <td className="px-3 py-3 font-semibold text-zinc-950">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
