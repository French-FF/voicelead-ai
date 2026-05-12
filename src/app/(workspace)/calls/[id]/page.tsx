import { notFound } from "next/navigation";
import { Bot, FileAudio, ListChecks, MessageSquareText } from "lucide-react";
import { getCallById, getLeadById } from "@/lib/mock-data";
import { ProgressBar } from "@/components/progress-bar";
import { StatusBadge } from "@/components/status-badge";

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const call = getCallById(id);

  if (!call) {
    notFound();
  }

  const lead = getLeadById(call.leadId);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
                Call intelligence
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
                {lead?.name ?? "Unknown lead"}
              </h2>
              <p className="mt-1 font-mono text-sm text-ink-soft">
                {lead?.phone}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={call.callStatus} type="call" />
              <StatusBadge value={call.classification} type="category" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            {[
              ["Duration", call.duration],
              ["Language", call.languageUsed],
              ["Sentiment", call.sentiment],
              ["Intent", `${call.intentScore}/100`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line p-4">
                <p className="text-sm text-ink-soft">{label}</p>
                <p className="mt-2 font-semibold text-zinc-950">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-800">
                Conversion probability
              </span>
              <span className="font-semibold text-zinc-950">
                {call.conversionScore}/100
              </span>
            </div>
            <ProgressBar
              value={call.conversionScore}
              tone={call.conversionScore > 74 ? "success" : "warning"}
            />
          </div>
        </div>

        <aside className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <FileAudio className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">Recording</h3>
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-line bg-panel-muted p-5 text-sm text-ink-soft">
            Recording placeholder: {call.recordingUrl}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {call.tags.map((tag) => (
              <StatusBadge key={tag} value={tag} />
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">AI summary</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-700">
            {call.detailedSummary}
          </p>
          <div className="mt-5 rounded-lg border border-line bg-panel-muted p-4">
            <p className="text-sm font-semibold text-zinc-950">
              Next recommended action
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              {call.nextAction}
            </p>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-emerald-700" />
            <h3 className="font-semibold text-zinc-950">Extracted fields</h3>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            {Object.entries(call.extractedFields).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="text-ink-soft">{key}</dt>
                <dd className="text-right font-semibold text-zinc-950">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-zinc-950">Objections</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {call.objections.map((objection) => (
                  <StatusBadge key={objection} value={objection} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-950">Questions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {call.questionsAsked.map((question) => (
                  <StatusBadge key={question} value={question} />
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-cyan-800" />
          <h3 className="font-semibold text-zinc-950">Transcript</h3>
        </div>
        <p className="mt-4 whitespace-pre-wrap rounded-lg border border-line bg-panel-muted p-4 text-sm leading-7 text-zinc-700">
          {call.transcript}
        </p>
      </section>
    </div>
  );
}
