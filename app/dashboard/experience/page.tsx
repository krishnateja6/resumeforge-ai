"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
};

export default function ExperiencePage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Experience>>({
    company: "",
    role: "",
    location: "",
    description: "",
    isCurrent: false,
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    const res = await fetch("/api/experience");
    if (res.status === 401) {
      router.push("/");
      return;
    }
    const data = await res.json();
    setExperiences(data.experiences ?? []);
    setLoading(false);
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Saved ✅");
      setShowForm(false);
      setForm({ company: "", role: "", location: "", description: "", isCurrent: false });
      loadExperiences();
    } else {
      setMsg("Save failed ❌");
    }
  }

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="min-h-screen p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Experience</h1>

      {msg && <p className="text-sm">{msg}</p>}

      <button
        className="px-4 py-2 rounded-md border bg-blue-50"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "+ Add Experience"}
      </button>

      {showForm && (
        <div className="border rounded-md p-4 space-y-3 bg-gray-50">
          <Input label="Company" value={form.company ?? ""} onChange={(v) => setForm({ ...form, company: v })} />
          <Input label="Role/Title" value={form.role ?? ""} onChange={(v) => setForm({ ...form, role: v })} />
          <Input label="Location" value={form.location ?? ""} onChange={(v) => setForm({ ...form, location: v })} />
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full rounded-md border p-2 min-h-[100px]"
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isCurrent ?? false}
              onChange={(e) => setForm({ ...form, isCurrent: e.target.checked })}
            />
            <label className="text-sm">Currently working here</label>
          </div>
          <button className="px-4 py-2 rounded-md border bg-green-50" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {experiences.length === 0 ? (
          <p className="text-gray-500">No experiences added yet.</p>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="border rounded-md p-4">
              <h3 className="font-semibold">{exp.role}</h3>
              <p className="text-sm text-gray-600">{exp.company}</p>
              {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
              <p className="text-xs text-gray-400 mt-1">{exp.isCurrent ? "Current" : "Past"}</p>
              {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
            </div>
          ))
        )}
      </div>
    </main>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input className="w-full rounded-md border p-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
