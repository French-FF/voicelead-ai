import { Download, Filter, UploadCloud } from "lucide-react";
import { leads, leadCategories } from "@/lib/mock-data";
import { LeadTable } from "@/components/lead-table";
import { StatusBadge } from "@/components/status-badge";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
            Leads
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
            UG 2027 lead pipeline
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100">
            <Download className="h-4 w-4" />
            Export hot/warm
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {leadCategories.slice(0, 10).map((category) => {
          const count = leads.filter((lead) => lead.classification === category).length;
          return (
            <div
              key={category}
              className="rounded-lg border border-line bg-white p-4 shadow-sm"
            >
              <StatusBadge value={category} type="category" />
              <p className="mt-3 text-2xl font-semibold text-zinc-950">
                {count}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5 text-cyan-800" />
          <h3 className="font-semibold text-zinc-950">CSV lead import</h3>
        </div>
        <form
          action="/api/leads/upload"
          method="post"
          encType="multipart/form-data"
          className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]"
        >
          <input
            name="file"
            type="file"
            accept=".csv,.xlsx"
            className="h-11 rounded-md border border-line bg-white px-3 py-2 text-sm"
          />
          <button className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
            Validate upload
          </button>
        </form>
      </section>

      <LeadTable leads={leads} />
    </div>
  );
}
