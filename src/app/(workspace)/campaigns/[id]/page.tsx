import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Bot, ListChecks, PhoneCall } from "lucide-react";
import { getCurrentSession } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import { LeadTable } from "@/components/lead-table";
import { StatusBadge } from "@/components/status-badge";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentSession();
  const snapshot = await getWorkspaceSnapshot(session?.workspaceId);
  const campaign = snapshot.campaigns.find((item) => item.id === id);

  if (!campaign) {
    notFound();
  }

  const agent = snapshot.agents.find((item) => item.id === campaign.agentId);
  const campaignLeads = snapshot.leads.filter((lead) => lead.campaignId === campaign.id);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <StatusBadge value={campaign.status} type="campaign" />
            <h2 className="mt-3 text-2xl font-semibold text-zinc-950">
              {campaign.campaignName}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-700">
              {campaign.objective}
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Edit template
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          {[
            ["Leads", campaign.leadCount],
            ["Calls completed", campaign.callsCompleted],
            ["Connected calls", campaign.connectedCalls],
            ["Average score", campaign.averageScore],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line p-4">
              <p className="text-sm text-ink-soft">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">Agent</h3>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Name", agent?.name],
              ["Voice", agent?.voiceType],
              ["Tone", agent?.tone],
              ["Language", agent?.language],
              ["Disclosure", agent?.disclosure],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-ink-soft">{label}</dt>
                <dd className="text-right font-semibold text-zinc-950">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-emerald-700" />
            <h3 className="font-semibold text-zinc-950">Must-ask questions</h3>
          </div>
          <div className="mt-4 space-y-2">
            {campaign.qualificationQuestions.slice(0, 5).map((question) => (
              <div
                key={question}
                className="rounded-md border border-line bg-panel-muted px-3 py-2 text-sm text-zinc-700"
              >
                {question}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">Handoff rules</h3>
          </div>
          <div className="mt-4 space-y-2">
            {campaign.handoffRules.map((rule) => (
              <div
                key={rule}
                className="rounded-md border border-line bg-panel-muted px-3 py-2 text-sm text-zinc-700"
              >
                {rule}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold text-zinc-950">
          Campaign leads
        </h3>
        <LeadTable leads={campaignLeads} />
      </section>
    </div>
  );
}
