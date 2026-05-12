"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CreditCard,
  Database,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  PhoneCall,
  Plus,
  ShieldCheck,
  LogOut,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Workspace } from "@/lib/types";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Calls", href: "/calls/call_aanya_01", icon: PhoneCall },
  { label: "AI Agent", href: "/agent", icon: Bot },
  { label: "Knowledge", href: "/knowledge", icon: Database },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Admin", href: "/admin", icon: ShieldCheck },
  { label: "Feedback", href: "/feedback", icon: MessageSquareText },
];

export function AppShell({
  children,
  mode,
  sessionEmail,
  workspace,
}: {
  children: React.ReactNode;
  mode: "database" | "memory";
  sessionEmail: string;
  workspace: Workspace;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-line bg-white lg:flex lg:flex-col">
        <div className="border-b border-line px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-zinc-950">
                VoiceLead AI
              </p>
              <p className="truncate text-xs font-medium text-ink-soft">
                Education voice intelligence
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-50 text-cyan-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <div className="rounded-lg border border-line bg-panel-muted p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-ink-soft">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Managed workspace
            </div>
            <p className="mt-2 text-sm font-semibold text-zinc-950">
              {workspace.companyName}
            </p>
            <p className="mt-1 text-xs text-ink-soft">{workspace.industry}</p>
            <p className="mt-2 text-xs font-medium text-cyan-800">
              {mode === "database" ? "DB-backed pilot" : "In-memory pilot"}
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-normal text-cyan-800">
                Masters&apos; Union UG 2027
              </p>
              <h1 className="truncate text-lg font-semibold text-zinc-950">
                Admissions outreach cockpit
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-md border border-line px-2 py-1 text-xs font-medium text-ink-soft md:inline-flex">
                {sessionEmail}
              </span>
              <Link
                href="/feedback"
                className="focus-ring hidden h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 sm:inline-flex"
              >
                <MessageSquareText className="h-4 w-4" />
                Share feedback
              </Link>
              <Link
                href="/campaigns/new"
                className="focus-ring inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4" />
                New campaign
              </Link>
              <form action="/api/auth/logout" method="post">
                <button
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-zinc-700 hover:bg-zinc-100"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-line px-4 py-2 sm:px-6 lg:hidden">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-ring inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium ${
                    isActive
                      ? "bg-cyan-50 text-cyan-900"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
