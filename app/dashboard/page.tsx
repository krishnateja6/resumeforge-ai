import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <main className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="flex gap-3">
        <Link className="px-4 py-2 rounded-md border" href="/dashboard/profile">
          Edit Profile
        </Link>
        <Link className="px-4 py-2 rounded-md border" href="/dashboard/experience">
          Experience
        </Link>
        <Link className="px-4 py-2 rounded-md border" href="/dashboard/education">
          Education
        </Link>
        <Link href="/dashboard/projects" className="rounded-md border px-4 py-2">
  Projects
</Link>
<Link href="/dashboard/skills" className="rounded-md border px-4 py-2">
  Skills
</Link>



      </div>

      <pre className="rounded-md border p-3 text-xs overflow-auto">
        {JSON.stringify(session.user, null, 2)}
      </pre>
    </main>
  );
}
