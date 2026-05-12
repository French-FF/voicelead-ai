import { AppShell } from "@/components/app-shell";
import { getCurrentSession } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const snapshot = await getWorkspaceSnapshot(session.workspaceId);

  return (
    <AppShell
      mode={snapshot.mode}
      sessionEmail={session.email}
      workspace={snapshot.workspace}
    >
      {children}
    </AppShell>
  );
}
