import { Bot, Gauge, Mic2, ShieldCheck } from "lucide-react";
import { getCurrentSession } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";

export default async function AgentPage() {
  const session = await getCurrentSession();
  const { agents } = await getWorkspaceSnapshot(session?.workspaceId);
  const agent = agents[0];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-800">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
                AI agent settings
              </p>
              <h2 className="text-2xl font-semibold text-zinc-950">
                {agent.name}
              </h2>
            </div>
          </div>
          <StatusBadge value="Real-call ready" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.62fr_0.38fr]">
        <div className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Mic2 className="h-5 w-5 text-cyan-800" />
              <h3 className="font-semibold text-zinc-950">Voice behavior</h3>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["Agent name", agent.name],
                ["Voice type", agent.voiceType],
                ["Language", agent.language],
                ["Tone", agent.tone],
                ["Speaking speed", agent.speed],
                ["Assertiveness", agent.assertiveness],
                ["AI disclosure", agent.disclosure],
              ].map(([label, value]) => (
                <label key={label} className="block">
                  <span className="text-sm font-medium text-zinc-800">
                    {label}
                  </span>
                  <input
                    defaultValue={value}
                    className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-zinc-800">
                Opening pitch
              </span>
              <textarea
                defaultValue={agent.openingPitch}
                className="mt-2 min-h-24 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cyan-700"
              />
            </label>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-700" />
              <h3 className="font-semibold text-zinc-950">Guardrails</h3>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-zinc-950">Do not say</p>
                <div className="mt-3 space-y-2">
                  {agent.doNotSay.map((item) => (
                    <div
                      key={item}
                      className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-950">
                  Escalation rules
                </p>
                <div className="mt-3 space-y-2">
                  {agent.escalationRules.map((item) => (
                    <div
                      key={item}
                      className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-amber-700" />
            <h3 className="font-semibold text-zinc-950">Conversation engine</h3>
          </div>
          <div className="mt-4 space-y-3">
            {[
              "Greet and confirm identity",
              "Ask if it is a good time",
              "Explain UGP outreach reason",
              "Ask adaptive qualification questions",
              "Handle objections from approved context",
              "Offer WhatsApp or counselor callback",
              "Classify, score, summarize, and create tasks",
            ].map((item, index) => (
              <div key={item} className="flex gap-3 rounded-lg border border-line p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-sm font-semibold text-cyan-900">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-zinc-700">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
