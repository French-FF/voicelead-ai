import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MessageCircle, PhoneCall, UserRound } from "lucide-react";
import { getCallsForLead, getLeadById } from "@/lib/mock-data";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBadge } from "@/components/status-badge";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = getLeadById(id);

  if (!lead) {
    notFound();
  }

  const leadCalls = getCallsForLead(lead.id);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.68fr_0.32fr]">
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-800">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-950">
                    {lead.name}
                  </h2>
                  <p className="font-mono text-sm text-ink-soft">{lead.phone}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge value={lead.classification} type="category" />
                <StatusBadge value={lead.callStatus} type="call" />
                {lead.tags.map((tag) => (
                  <StatusBadge key={tag} value={tag} />
                ))}
              </div>
            </div>
            <Link
              href={leadCalls[0] ? `/calls/${leadCalls[0].id}` : "/campaigns"}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
            >
              Open call
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Email", lead.email],
              ["City", lead.city],
              ["Source", lead.source],
              ["Owner", lead.assignedTo],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line p-4">
                <p className="text-sm text-ink-soft">{label}</p>
                <p className="mt-2 truncate font-semibold text-zinc-950">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-800">
                Conversion probability
              </span>
              <span className="font-semibold text-zinc-950">
                {lead.conversionScore}/100
              </span>
            </div>
            <ProgressBar
              value={lead.conversionScore}
              tone={lead.conversionScore > 74 ? "success" : "warning"}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-700" />
              <h3 className="font-semibold text-zinc-950">Recommended action</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              {lead.nextAction}
            </p>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-cyan-800" />
              <h3 className="font-semibold text-zinc-950">Custom fields</h3>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              {Object.entries(lead.customFields).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <dt className="text-ink-soft">{key}</dt>
                  <dd className="text-right font-semibold text-zinc-950">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-zinc-950">Call history</h3>
        <div className="mt-4 space-y-3">
          {leadCalls.length ? (
            leadCalls.map((call) => (
              <Link
                key={call.id}
                href={`/calls/${call.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-panel-muted p-4 hover:bg-zinc-100"
              >
                <div>
                  <p className="font-semibold text-zinc-950">
                    {call.shortSummary}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {call.duration} · {call.languageUsed} ·{" "}
                    {new Date(call.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <StatusBadge value={call.classification} type="category" />
              </Link>
            ))
          ) : (
            <p className="rounded-lg border border-line bg-panel-muted p-4 text-sm text-ink-soft">
              No completed call yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
