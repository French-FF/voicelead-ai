type ProgressBarProps = {
  value: number;
  tone?: "success" | "warning" | "danger" | "brand";
};

const toneStyles = {
  success: "bg-emerald-600",
  warning: "bg-amber-500",
  danger: "bg-rose-600",
  brand: "bg-cyan-700",
};

export function ProgressBar({ value, tone = "brand" }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-sm bg-zinc-100">
      <div
        className={`h-full rounded-sm ${toneStyles[tone]}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
