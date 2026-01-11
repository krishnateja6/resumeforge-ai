"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 space-y-4">
        <h1 className="text-2xl font-semibold">ResumeForge AI</h1>

        {status === "loading" ? (
          <p className="text-sm text-zinc-600">Loading…</p>
        ) : session?.user ? (
          <>
            <p className="text-sm">
              Logged in as{" "}
              <span className="font-medium">{session.user.email}</span>
            </p>

            <div className="flex gap-3">
              <Link className="px-4 py-2 rounded-md border" href="/dashboard">
                Dashboard
              </Link>

              <button
                className="px-4 py-2 rounded-md border"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-600">
              Sign in to generate your resume + portfolio.
            </p>

            <button
              className="w-full px-4 py-2 rounded-md border"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </main>
  );
}
