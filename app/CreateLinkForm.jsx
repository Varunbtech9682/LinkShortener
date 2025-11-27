"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  url: "",
  code: ""
};

export default function CreateLinkForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.url.trim()) {
      setError("Target URL is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: form.url.trim(),
          code: form.code.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create link.");
      } else {
        setSuccess("Short link created!");
        setForm(initialState);
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-300">
          Target URL
        </label>
        <input
          type="url"
          required
          placeholder="https://example.com/docs"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          value={form.url}
          onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-300">
            Custom code (optional)
          </label>
          <span className="text-[10px] text-slate-500">
            6–8 letters or numbers, must be unique
          </span>
        </div>
        <input
          type="text"
          pattern="[A-Za-z0-9]{6,8}"
          title="6–8 characters, letters and numbers only"
          placeholder="docs123"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          value={form.code}
          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800 rounded-md px-2 py-1">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800 rounded-md px-2 py-1">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Creating..." : "Shorten URL"}
      </button>
    </form>
  );
}
