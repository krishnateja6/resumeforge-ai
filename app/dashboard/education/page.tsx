"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Education = {
  id: string;
  school: string;
  degree?: string | null;
  field?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  grade?: string | null;
  description?: string | null;
};

export default function EducationPage() {
  const router = useRouter();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Education>>({
    school: "",
    degree: "",
    field: "",
    grade: "",
    description: "",
  });

  useEffect(() => {
    loadEducations();
  }, []);

  async function loadEducations() {
    const res = await fetch("/api/education");
    if (res.status === 401) {
      router.push("/");
      return;
    }
    const data = await res.json();
    setEducations(data.educations ?? []);
    setLoading(false);
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/e86f3351-5db4-4051-ba5e-9159be634730',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/education/page.tsx:50',message:'Education save initiated',data:{school:form.school,schoolLength:form.school?.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const res = await fetch("/api/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Saved ✅");
      setShowForm(false);
      setForm({ school: "", degree: "", field: "", grade: "", description: "" });
      loadEducations();
    } else {
      setMsg("Save failed ❌");
    }
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/e86f3351-5db4-4051-ba5e-9159be634730',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/education/page.tsx:68',message:'Education save result',data:{success:res.ok,status:res.status},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
  }

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="min-h-screen p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Education</h1>

      {msg && <p className="text-sm">{msg}</p>}

      <button
        className="px-4 py-2 rounded-md border bg-blue-50"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "+ Add Education"}
      </button>

      {showForm && (
        <div className="border rounded-md p-4 space-y-3 bg-gray-50">
          <Input label="School/University" value={form.school ?? ""} onChange={(v) => setForm({ ...form, school: v })} />
          <Input label="Degree" value={form.degree ?? ""} onChange={(v) => setForm({ ...form, degree: v })} />
          <Input label="Field of Study" value={form.field ?? ""} onChange={(v) => setForm({ ...form, field: v })} />
          <Input label="Grade/GPA" value={form.grade ?? ""} onChange={(v) => setForm({ ...form, grade: v })} />
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
        {educations.length === 0 ? (
          <p className="text-gray-500">No education records added yet.</p>
        ) : (
          educations.map((edu) => (
            <div key={edu.id} className="border rounded-md p-4">
              <h3 className="font-semibold">{edu.school}</h3>
              {edu.degree && <p className="text-sm text-gray-600">{edu.degree}</p>}
              {edu.field && <p className="text-sm text-gray-500">{edu.field}</p>}
              {edu.grade && <p className="text-xs text-gray-400 mt-1">Grade: {edu.grade}</p>}
              {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
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
