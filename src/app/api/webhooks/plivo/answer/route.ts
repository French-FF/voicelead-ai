export async function POST() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak language="en-IN" voice="WOMAN">
    Hi, this is the Masters Union admissions desk calling about the UGP 2027 program. Is this a good time to speak?
  </Speak>
</Response>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

export async function GET() {
  return POST();
}
