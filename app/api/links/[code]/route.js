import { NextResponse } from "next/server";
import { getLinkByCode, deleteLink } from "../../../../lib/links.js";

export async function GET(_req, { params }) {
  try {
    const { code } = params;
    const link = await getLinkByCode(code);
    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(link, { status: 200 });
  } catch (err) {
    console.error("GET /api/links/:code error", err);
    return NextResponse.json(
      { error: "Failed to fetch link" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { code } = params;
    const ok = await deleteLink(code);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/links/:code error", err);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}
