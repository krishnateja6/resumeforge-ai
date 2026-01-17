"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  link?: string | null;
  githubLink?: string | null;
  description?: string | null;
  techStack?: string | null;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Project>>({
    title: "",
    link: "",
    githubLink: "",
    description: "",
    techStack: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const res = await fetch("/api/projects");
    if (res.status === 401) {
      router.push("/");
      return;
    }
    const data = await res.json();
    setProjects(data.projects ?? []);
    setLoading(false);
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Saved ✅");
      setShowForm(false);
      setForm({ title: "", link: "", githubLink: "", description: "", techStack: "" });
      loadProjects();
    } else {
      setMsg("Save failed ❌");
    }
  }

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="min-h-screen p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Projects</h1>

      {msg && <p className="text-sm">{msg}</p>}

      <button
        className="px-4 py-2 rounded-md border bg-blue-50"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "+ Add Project"}
      </button>

      {showForm && (
        <div className="border rounded-md p-4 space-y-3 bg-gray-50">
          <Input label="Project Title" value={form.title ?? ""} onChange={(v) => setForm({ ...form, title: v })} />
          <Input label="Project Link" value={form.link ?? ""} onChange={(v) => setForm({ ...form, link: v })} />
          <Input label="GitHub Link" value={form.githubLink ?? ""} onChange={(v) => setForm({ ...form, githubLink: v })} />
          <Input label="Tech Stack" value={form.techStack ?? ""} onChange={(v) => setForm({ ...form, techStack: v })} />
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full rounded-md border p-2 min-h-[100px]"
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button className="px-4 py-2 rounded-md border bg-green-50" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects added yet.</p>
        ) : (
          projects.map((proj) => (
            <div key={proj.id} className="border rounded-md p-4">
              <h3 className="font-semibold">{proj.title}</h3>
              {proj.techStack && <p className="text-sm text-gray-600 mt-1">{proj.techStack}</p>}
              {proj.description && <p className="text-sm mt-2">{proj.description}</p>}
              <div className="flex gap-3 mt-2">
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    🔗 Live Demo
                  </a>
                )}
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    💻 GitHub
                  </a>
                )}
              </div>
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
