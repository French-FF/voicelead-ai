import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Lead } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { ProgressBar } from "./progress-bar";

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-panel-muted text-left text-xs font-semibold uppercase tracking-normal text-ink-soft">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Call</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Next action</th>
              <th className="px-4 py-3 text-right">Open</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-zinc-50">
                <td className="px-4 py-4">
                  <div className="min-w-40">
                    <p className="font-semibold text-zinc-950">{lead.name}</p>
                    <p className="mt-1 font-mono text-xs text-ink-soft">
                      {lead.phone}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4 text-zinc-700">{lead.city}</td>
                <td className="px-4 py-4 text-zinc-700">{lead.source}</td>
                <td className="px-4 py-4">
                  <StatusBadge value={lead.callStatus} type="call" />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={lead.classification} type="category" />
                </td>
                <td className="px-4 py-4">
                  <div className="w-28">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold text-zinc-950">
                        {lead.conversionScore}
                      </span>
                      <span className="text-xs text-ink-soft">/100</span>
                    </div>
                    <ProgressBar
                      value={lead.conversionScore}
                      tone={
                        lead.conversionScore > 74
                          ? "success"
                          : lead.conversionScore > 44
                            ? "warning"
                            : "danger"
                      }
                    />
                  </div>
                </td>
                <td className="max-w-xs px-4 py-4 text-zinc-700">
                  <span>{lead.nextAction}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-zinc-700 hover:bg-zinc-100"
                    aria-label={`Open ${lead.name}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
