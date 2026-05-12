import Link from "next/link";
import { ArrowRight, Bot, ListChecks, Plus } from "lucide-react";
import { getCurrentSession } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBadge } from "@/components/status-badge";

export default async function CampaignsPage() {
  const session = await getCurrentSession();
  const { agents, campaigns } = await getWorkspaceSnapshot(session?.workspaceId);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
            Campaigns
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            Admissions calling programs
          </h2>
        </div>
        <Link
          href="/campaigns/new"
          className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Create campaign
        </Link>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {campaigns.map((campaign) => {
          const agent = agents.find((item) => item.id === campaign.agentId);
          return (
            <article
              key={campaign.id}
              className="rounded-lg border border-line bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <StatusBadge value={campaign.status} type="campaign" />
                  <h3 className="mt-3 text-xl font-semibold text-zinc-950">
                    {campaign.campaignName}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">
                    {campaign.objective}
                  </p>
                </div>
                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-zinc-700 hover:bg-zinc-100"
                  aria-label={`Open ${campaign.campaignName}`}
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ["Leads", campaign.leadCount],
                  ["Completed", campaign.callsCompleted],
                  ["Hot", campaign.hotLeads],
                  ["Callbacks", campaign.callbackRequests],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-line p-3">
                    <p className="text-xs text-ink-soft">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-zinc-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-800">
                    Average conversion score
                  </span>
                  <span className="font-semibold text-zinc-950">
                    {campaign.averageScore}/100
                  </span>
                </div>
                <ProgressBar
                  value={campaign.averageScore}
                  tone={campaign.averageScore > 65 ? "success" : "warning"}
                />
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-line bg-panel-muted p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
                    <Bot className="h-4 w-4 text-cyan-800" />
                    {agent?.name}
                  </div>
                  <p className="mt-2 text-xs text-ink-soft">
                    {campaign.language} · {agent?.tone} · {agent?.disclosure}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-panel-muted p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
                    <ListChecks className="h-4 w-4 text-emerald-700" />
                    {campaign.qualificationQuestions.length} qualification
                    questions
                  </div>
                  <p className="mt-2 text-xs text-ink-soft">
                    Controlled template with editable sections
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
