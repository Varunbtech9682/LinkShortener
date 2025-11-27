"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function LinksTable({ links }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter((link) => {
      return (
        link.code.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q)
      );
    });
  }, [links, query]);

  async function handleDelete(code) {
    if (!confirm(`Delete short link "${code}"?`)) return;
    try {
      const res = await fetch(`/api/links/${code}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        alert("Failed to delete link.");
        return;
      }
      router.refresh();
    } catch {
      alert("Something went wrong while deleting.");
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("Unable to copy to clipboard in this browser.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by code or URL"
          className="w-full sm:w-72 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="text-[11px] text-slate-500">
          Showing {filtered.length} of {links.length} links
        </p>
      </div>
      <div className="overflow-auto rounded-xl border border-slate-800 bg-slate-950/60 table-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80 text-slate-300 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Target URL</th>
              <th className="px-3 py-2 text-right">Clicks</th>
              <th className="px-3 py-2 text-left">Last clicked</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-xs text-slate-500"
                >
                  No links yet. Create your first short link above.
                </td>
              </tr>
            ) : (
              filtered.map((link) => {
                const shortUrl = `${BASE_URL}/${link.code}`;
                return (
                  <tr
                    key={link.code}
                    className="border-t border-slate-800 hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-0.5">
                        <code className="text-xs bg-slate-900/80 rounded px-1.5 py-0.5">
                          {link.code}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(shortUrl)}
                          className="text-[10px] text-sky-400 hover:underline text-left"
                        >
                          Copy short URL
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top max-w-xs">
                      <div className="text-xs text-slate-200 truncate">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {link.url}
                        </a>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-right text-xs">
                      {link.clicks}
                    </td>
                    <td className="px-3 py-2 align-top text-xs text-slate-400">
                      {link.lastClicked
                        ? new Date(link.lastClicked).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 align-top text-right text-xs">
                      <div className="inline-flex gap-2">
                        <a
                          href={`/code/${link.code}`}
                          className="rounded-lg border border-slate-700 px-2 py-1 hover:border-sky-500 hover:text-sky-200 transition-colors"
                        >
                          Stats
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(link.code)}
                          className="rounded-lg border border-rose-700/70 px-2 py-1 text-rose-300 hover:bg-rose-950/60 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
