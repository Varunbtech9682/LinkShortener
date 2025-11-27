export async function GET() {
  const body = {
    ok: true,
    version: "1.0"
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
