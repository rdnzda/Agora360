import { getSession } from "@/lib/get-session"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "Utilisateur"}
      userRole={session.user.role}
      userImage={session.user.image}
    >
      {children}
    </DashboardShell>
  )
}
