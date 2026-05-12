import { CheckCircle2, Clock3 } from "lucide-react";
import { demoReadiness } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";

export function ReadinessPanel() {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
        <h2 className="font-semibold text-zinc-950">Pilot readiness</h2>
      </div>
      <div className="mt-4 space-y-3">
        {demoReadiness.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-line bg-panel-muted p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-zinc-950">{item.label}</p>
                <p className="mt-1 text-sm leading-5 text-ink-soft">
                  {item.detail}
                </p>
              </div>
              <StatusBadge value={item.status} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <Clock3 className="h-4 w-4 shrink-0" />
        Temporary previews are ideal for UX feedback; live calling should stay
        in a controlled pilot batch.
      </div>
    </section>
  );
}
