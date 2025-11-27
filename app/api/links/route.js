import { NextResponse } from "next/server";
import {
  getAllLinks,
  createLink,
  isValidCode,
  isValidUrl,
  generateCode
} from "../../../lib/links.js";
import { pool } from "../../../lib/db.js";

export async function GET() {
  try {
    const links = await getAllLinks();
    return NextResponse.json(links, { status: 200 });
  } catch (err) {
    console.error("GET /api/links error", err);
    return NextResponse.json(
      { error: "Failed to list links" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const url = String(body.url || "").trim();
    let code = body.code ? String(body.code).trim() : undefined;

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    if (code) {
      if (!isValidCode(code)) {
        return NextResponse.json(
          {
            error:
              "Custom code must be 6–8 characters long and contain only letters and numbers."
          },
          { status: 400 }
        );
      }
    } else {
      // Generate a unique code
      for (let i = 0; i < 5; i++) {
        const candidate = generateCode(6);
        const exists = await pool.query(
          "SELECT 1 FROM links WHERE code = $1 LIMIT 1",
          [candidate]
        );
        if (exists.rowCount === 0) {
          code = candidate;
          break;
        }
      }
      if (!code) {
        return NextResponse.json(
          { error: "Unable to generate unique code. Try again." },
          { status: 500 }
        );
      }
    }

    // Check unique
    const existing = await pool.query(
      "SELECT 1 FROM links WHERE code = $1 LIMIT 1",
      [code]
    );
    if (existing.rowCount > 0) {
      return NextResponse.json(
        { error: "This code is already in use." },
        { status: 409 }
      );
    }

    const created = await createLink({ url, code });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/links error", err);
    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}
