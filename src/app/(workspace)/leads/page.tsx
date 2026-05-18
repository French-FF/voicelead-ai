import { Download, Filter, UploadCloud } from "lucide-react";
import { leadCategories } from "@/lib/mock-data";
import { getCurrentSession } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import { LeadTable } from "@/components/lead-table";
import { StatusBadge } from "@/components/status-badge";

type LeadsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const session = await getCurrentSession();
  const params = (await searchParams) ?? {};
  const snapshot = await getWorkspaceSnapshot(session?.workspaceId);
  const { leads, campaigns } = snapshot;
  const selectedCategory = firstParam(params.category) ?? "all";
  const selectedCampaign = firstParam(params.campaignId) ?? "all";
  const exportParams = new URLSearchParams();

  if (selectedCategory !== "all") exportParams.set("category", selectedCategory);
  if (selectedCampaign !== "all") exportParams.set("campaignId", selectedCampaign);

  const filteredLeads = leads.filter((lead) => {
    const categoryMatch =
      selectedCategory === "all" || lead.classification === selectedCategory;
    const campaignMatch =
      selectedCampaign === "all" || lead.campaignId === selectedCampaign;

    return categoryMatch && campaignMatch;
  });
  const exportHref = `/api/leads/export${
    exportParams.size ? `?${exportParams.toString()}` : ""
  }`;

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
          <form method="get" className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="category-filter">
              Lead category
            </label>
            <select
              id="category-filter"
              name="category"
              defaultValue={selectedCategory}
              className="h-10 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800"
            >
              <option value="all">All categories</option>
              {leadCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="campaign-filter">
              Campaign
            </label>
            <select
              id="campaign-filter"
              name="campaignId"
              defaultValue={selectedCampaign}
              className="h-10 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800"
            >
              <option value="all">All campaigns</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.campaignName}
                </option>
              ))}
            </select>
            <button className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100">
              <Filter className="h-4 w-4" />
              Apply
            </button>
          </form>
          <a
            href={exportHref}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            <Download className="h-4 w-4" />
            Export priority
          </a>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-white p-3 text-sm text-zinc-700 shadow-sm">
        <Filter className="h-4 w-4 text-cyan-800" />
        Showing <span className="font-semibold text-zinc-950">{filteredLeads.length}</span>{" "}
        of <span className="font-semibold text-zinc-950">{leads.length}</span> leads
        {selectedCategory !== "all" ? (
          <StatusBadge value={selectedCategory} type="category" />
        ) : null}
        {selectedCampaign !== "all" ? (
          <span className="rounded-md bg-panel-muted px-2 py-1 text-xs font-semibold text-zinc-700">
            {campaigns.find((campaign) => campaign.id === selectedCampaign)?.campaignName}
          </span>
        ) : null}
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
            name="campaignId"
            type="hidden"
            value={campaigns[0]?.id ?? "camp_ugp_2027"}
          />
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

      <LeadTable leads={filteredLeads} />
    </div>
  );
}
