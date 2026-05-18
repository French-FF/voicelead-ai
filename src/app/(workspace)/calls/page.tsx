import Link from "next/link";
import { ArrowUpRight, FileAudio, PhoneCall } from "lucide-react";
import { getCurrentSession } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBadge } from "@/components/status-badge";

export default async function CallsPage() {
  const session = await getCurrentSession();
  const snapshot = await getWorkspaceSnapshot(session?.workspaceId);
  const connected = snapshot.calls.filter(
    (call) => call.callStatus === "Connected",
  ).length;
  const analyzed = snapshot.calls.filter((call) => call.transcript).length;
  const averageScore = snapshot.calls.length
    ? Math.round(
        snapshot.calls.reduce((sum, call) => sum + call.conversionScore, 0) /
          snapshot.calls.length,
      )
    : 0;

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
            Calls
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            Call intelligence queue
          </h2>
        </div>
        <Link
          href="/leads"
          className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
        >
          Start from leads
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Total calls", snapshot.calls.length.toLocaleString("en-IN")],
          ["Connected", connected.toLocaleString("en-IN")],
          ["Analyzed", analyzed.toLocaleString("en-IN")],
          ["Avg score", `${averageScore}/100`],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-lg border border-line bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-ink-soft">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-line bg-panel-muted px-4 py-3">
          <PhoneCall className="h-5 w-5 text-cyan-800" />
          <h3 className="font-semibold text-zinc-950">Recent calls</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-white text-left text-xs font-semibold uppercase tracking-normal text-ink-soft">
              <tr>
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {snapshot.calls.length ? (
                snapshot.calls.map((call) => {
                  const lead = snapshot.leads.find((item) => item.id === call.leadId);

                  return (
                    <tr key={call.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-zinc-950">
                          {lead?.name ?? "Unknown lead"}
                        </p>
                        <p className="mt-1 font-mono text-xs text-ink-soft">
                          {lead?.phone ?? call.leadId}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value={call.callStatus} type="call" />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value={call.classification} type="category" />
                      </td>
                      <td className="px-4 py-4 text-zinc-700">{call.duration}</td>
                      <td className="px-4 py-4">
                        <div className="w-28">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-semibold text-zinc-950">
                              {call.conversionScore}
                            </span>
                            <span className="text-xs text-ink-soft">/100</span>
                          </div>
                          <ProgressBar
                            value={call.conversionScore}
                            tone={call.conversionScore > 74 ? "success" : "warning"}
                          />
                        </div>
                      </td>
                      <td className="max-w-sm px-4 py-4 text-zinc-700">
                        {call.shortSummary}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/calls/${call.id}`}
                          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-zinc-700 hover:bg-zinc-100"
                          aria-label={`Open call for ${lead?.name ?? call.leadId}`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-soft">
                    No call records yet. Start a test call from a lead detail page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <FileAudio className="h-5 w-5 text-emerald-700" />
          <h3 className="font-semibold text-zinc-950">QA reminder</h3>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-700">
          Before live pilots, review transcripts for disclosure, hallucinated
          claims, opt-out handling, and whether the next action is useful for a
          counselor.
        </p>
      </section>
    </div>
  );
}
