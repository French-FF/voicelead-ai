import type { CallStatus, CampaignStatus, LeadCategory } from "@/lib/types";

const categoryStyles: Record<LeadCategory, string> = {
  Hot: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Warm: "border-amber-200 bg-amber-50 text-amber-800",
  Cold: "border-sky-200 bg-sky-50 text-sky-800",
  "Not Interested": "border-zinc-200 bg-zinc-100 text-zinc-700",
  "Wrong Target Group": "border-violet-200 bg-violet-50 text-violet-800",
  "Call Back Later": "border-cyan-200 bg-cyan-50 text-cyan-800",
  "Invalid Number": "border-red-200 bg-red-50 text-red-800",
  Converted: "border-teal-200 bg-teal-50 text-teal-800",
  "Needs Human Follow-Up": "border-orange-200 bg-orange-50 text-orange-800",
  "Do Not Contact": "border-rose-200 bg-rose-50 text-rose-800",
};

const callStyles: Record<CallStatus, string> = {
  Connected: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Pending: "border-zinc-200 bg-zinc-100 text-zinc-700",
  Failed: "border-red-200 bg-red-50 text-red-800",
  "No Answer": "border-amber-200 bg-amber-50 text-amber-800",
  Scheduled: "border-cyan-200 bg-cyan-50 text-cyan-800",
  "In Progress": "border-indigo-200 bg-indigo-50 text-indigo-800",
};

const campaignStyles: Record<CampaignStatus, string> = {
  Draft: "border-zinc-200 bg-zinc-100 text-zinc-700",
  Ready: "border-cyan-200 bg-cyan-50 text-cyan-800",
  Live: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Paused: "border-amber-200 bg-amber-50 text-amber-800",
  Completed: "border-indigo-200 bg-indigo-50 text-indigo-800",
};

type StatusBadgeProps = {
  value: LeadCategory | CallStatus | CampaignStatus | string;
  type?: "category" | "call" | "campaign" | "neutral";
};

export function StatusBadge({ value, type = "neutral" }: StatusBadgeProps) {
  const styles =
    type === "category"
      ? categoryStyles[value as LeadCategory]
      : type === "call"
        ? callStyles[value as CallStatus]
        : type === "campaign"
          ? campaignStyles[value as CampaignStatus]
          : "border-zinc-200 bg-white text-zinc-700";

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-md border px-2 py-1 text-xs font-medium ${styles}`}
    >
      <span className="truncate">{value}</span>
    </span>
  );
}
