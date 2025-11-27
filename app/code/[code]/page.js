import { notFound } from "next/navigation";
import { getLinkByCode } from "../../../lib/links.js";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function CodeStatsPage({ params }) {
  const { code } = params;
  const link = await getLinkByCode(code);

  if (!link) {
    notFound();
  }

  const shortUrl = `${BASE_URL}/${link.code}`;

  return (
    <div className="space-y-6">
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <h2 className="text-lg font-semibold mb-3">Stats for code: {link.code}</h2>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Short URL
            </dt>
            <dd className="mt-1">
              <a
                href={shortUrl}
                className="text-sky-400 hover:underline break-all"
                target="_blank"
                rel="noreferrer"
              >
                {shortUrl}
              </a>
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Target URL
            </dt>
            <dd className="mt-1 text-slate-100 break-all text-xs">
              <a
                href={link.url}
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {link.url}
              </a>
            </dd>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Total clicks
              </dt>
              <dd className="mt-1 text-2xl font-semibold">{link.clicks}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                Last clicked
              </dt>
              <dd className="mt-1 text-xs text-slate-200">
                {link.lastClicked
                  ? new Date(link.lastClicked).toLocaleString()
                  : "Never"}
              </dd>
            </div>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-400">
              Created at
            </dt>
            <dd className="mt-1 text-xs text-slate-200">
              {link.createdAt
                ? new Date(link.createdAt).toLocaleString()
                : "Unknown"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 text-xs text-slate-400">
        <p>
          Each time someone visits <code>/{link.code}</code>, TinyLink performs a{" "}
          <code>302</code> redirect to the target URL and increments the click count.
        </p>
      </section>
    </div>
  );
}
