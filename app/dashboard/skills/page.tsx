"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Skill = {
  id: string;
  name: string;
  level?: string | null;
};

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Skill>>({
    name: "",
    level: "",
  });

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    const res = await fetch("/api/skills");
    if (res.status === 401) {
      router.push("/");
      return;
    }
    const data = await res.json();
    setSkills(data.skills ?? []);
    setLoading(false);
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    
    if (res.ok) {
      setMsg("Saved ✅");
      setShowForm(false);
      setForm({ name: "", level: "" });
      loadSkills();
    } else if (res.status === 409) {
      const data = await res.json();
      setMsg(data.error || "Skill already exists ❌");
    } else {
      setMsg("Save failed ❌");
    }
  }

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="min-h-screen p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Skills</h1>

      {msg && <p className="text-sm">{msg}</p>}

      <button
        className="px-4 py-2 rounded-md border bg-blue-50"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "+ Add Skill"}
      </button>

      {showForm && (
        <div className="border rounded-md p-4 space-y-3 bg-gray-50">
          <Input label="Skill Name" value={form.name ?? ""} onChange={(v) => setForm({ ...form, name: v })} />
          <div>
            <label className="block text-sm font-medium mb-1">Level (optional)</label>
            <select
              className="w-full rounded-md border p-2"
              value={form.level ?? ""}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <option value="">Not specified</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <button className="px-4 py-2 rounded-md border bg-green-50" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {skills.length === 0 ? (
          <p className="text-gray-500">No skills added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="border rounded-md px-3 py-2 bg-white">
                <span className="font-medium">{skill.name}</span>
                {skill.level && <span className="text-xs text-gray-500 ml-2">({skill.level})</span>}
              </div>
            ))}
          </div>
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
