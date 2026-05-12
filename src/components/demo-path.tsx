import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buyerDemoPath } from "@/lib/mock-data";

export function DemoPath() {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-cyan-800">
            Guided buyer demo
          </p>
          <h2 className="mt-1 text-xl font-semibold text-zinc-950">
            The story reviewers should follow
          </h2>
        </div>
        <Link
          href="/feedback"
          className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Feedback page
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-5">
        {buyerDemoPath.map((item) => (
          <Link
            key={item.step}
            href={item.href}
            className="group rounded-lg border border-line bg-panel-muted p-4 transition hover:border-cyan-300 hover:bg-cyan-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-semibold text-cyan-900 shadow-sm">
              {item.step}
            </div>
            <h3 className="mt-4 text-sm font-semibold text-zinc-950">
              {item.title}
            </h3>
            <p className="mt-2 text-xs leading-5 text-ink-soft">
              {item.detail}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
