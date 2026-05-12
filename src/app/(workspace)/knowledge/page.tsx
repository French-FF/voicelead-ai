import { Database, FileAudio, FileText, UploadCloud } from "lucide-react";
import { getCurrentSession } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import { StatusBadge } from "@/components/status-badge";

export default async function KnowledgePage() {
  const session = await getCurrentSession();
  const { knowledgeBaseEntries, trainingAssets } = await getWorkspaceSnapshot(
    session?.workspaceId,
  );

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
          Knowledge base
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
          Approved context and training inputs
        </h2>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-cyan-800" />
            <h3 className="font-semibold text-zinc-950">
              Upload transcripts or audio
            </h3>
          </div>
          <form
            action="/api/training-assets"
            method="post"
            encType="multipart/form-data"
            className="mt-5 space-y-4"
          >
            <label className="block">
              <span className="text-sm font-medium text-zinc-800">
                Asset title
              </span>
              <input
                name="title"
                defaultValue="Manual admissions reachout sample"
                className="mt-2 h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-cyan-700"
              />
            </label>
            <input
              name="file"
              type="file"
              accept=".txt,.csv,.docx,.mp3,.wav,.m4a"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
            <textarea
              name="notes"
              placeholder="Notes about consent, campaign, caller, or outcomes"
              className="min-h-24 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cyan-700"
            />
            <button className="focus-ring inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
              Process training asset
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <FileAudio className="h-5 w-5 text-emerald-700" />
            <h3 className="font-semibold text-zinc-950">
              Manual reachout insights
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {trainingAssets.map((asset) => (
              <article
                key={asset.id}
                className="rounded-lg border border-line bg-panel-muted p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-950">{asset.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{asset.type}</p>
                  </div>
                  <StatusBadge value={asset.status} />
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-700">
                  {asset.insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {knowledgeBaseEntries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-lg border border-line bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              {entry.type === "FAQ" ? (
                <FileText className="h-5 w-5 text-amber-700" />
              ) : (
                <Database className="h-5 w-5 text-cyan-800" />
              )}
              <StatusBadge value={entry.type} />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-950">{entry.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-700">
              {entry.content}
            </p>
            <p className="mt-4 text-xs text-ink-soft">
              {entry.source} · Updated {entry.updatedAt}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
