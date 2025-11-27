import { NextResponse } from "next/server";
import { incrementClick } from "../../lib/links.js";

export async function GET(_request, { params }) {
  const { code } = params;

  try {
    const link = await incrementClick(code);
    if (!link) {
      return new Response("Not found", { status: 404 });
    }
    return NextResponse.redirect(link.url, 302);
  } catch (err) {
    console.error("Redirect error for code", code, err);
    return new Response("Server error", { status: 500 });
  }
}
