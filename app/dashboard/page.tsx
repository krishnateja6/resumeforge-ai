import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm">You are logged in.</p>
      <pre className="mt-4 rounded-md border p-3 text-xs overflow-auto">
        {JSON.stringify(session.user, null, 2)}
      </pre>
    </main>
  );
}
