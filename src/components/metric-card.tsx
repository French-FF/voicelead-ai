type MetricCardProps = {
  label: string;
  value: string;
  delta: string;
};

export function MetricCard({ label, value, delta }: MetricCardProps) {
  return (
    <section className="rounded-lg border border-line bg-panel p-4 shadow-sm">
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-normal text-zinc-950">
          {value}
        </p>
        <p className="min-w-0 text-right text-xs font-medium text-emerald-700">
          {delta}
        </p>
      </div>
    </section>
  );
}
