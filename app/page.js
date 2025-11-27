import CreateLinkForm from "./CreateLinkForm.jsx";
import LinksTable from "./LinksTable.jsx";
import { getAllLinks } from "../lib/links.js";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const links = await getAllLinks();

  return (
    <div className="space-y-6">
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <h2 className="text-lg font-medium mb-1">Create short link</h2>
        <p className="text-xs text-slate-400 mb-4">
          Paste a long URL, optionally choose a custom code, and TinyLink will create a short link.
        </p>
        <CreateLinkForm />
      </section>

      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h2 className="text-lg font-medium">All links</h2>
            <p className="text-xs text-slate-400">
              Manage your short links, see click counts, and open the stats page.
            </p>
          </div>
        </div>
        <LinksTable links={links} />
      </section>
    </div>
  );
}
