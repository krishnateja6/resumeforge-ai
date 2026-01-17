"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  fullName?: string | null;
  headline?: string | null;
  location?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  summary?: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/profile");
      if (res.status === 401) {
        router.push("/");
        return;
      }
      const data = await res.json();
      setForm(data.profile ?? {});
      setLoading(false);
    })();
  }, [router]);

  async function onSave() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved ✅" : "Save failed ❌");
  }

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="min-h-screen p-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>

      {msg && <p className="text-sm">{msg}</p>}

      <Input label="Full Name" value={form.fullName ?? ""} onChange={(v) => setForm({ ...form, fullName: v })} />
      <Input label="Headline" value={form.headline ?? ""} onChange={(v) => setForm({ ...form, headline: v })} />
      <Input label="Location" value={form.location ?? ""} onChange={(v) => setForm({ ...form, location: v })} />
      <Input label="Website" value={form.website ?? ""} onChange={(v) => setForm({ ...form, website: v })} />
      <Input label="GitHub" value={form.github ?? ""} onChange={(v) => setForm({ ...form, github: v })} />
      <Input label="LinkedIn" value={form.linkedin ?? ""} onChange={(v) => setForm({ ...form, linkedin: v })} />

      <div>
        <label className="block text-sm font-medium mb-1">Summary</label>
        <textarea
          className="w-full rounded-md border p-2 min-h-[140px]"
          value={form.summary ?? ""}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
      </div>

      <button className="px-4 py-2 rounded-md border" onClick={onSave} disabled={saving}>
        {saving ? "Saving…" : "Save Profile"}
      </button>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input className="w-full rounded-md border p-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
