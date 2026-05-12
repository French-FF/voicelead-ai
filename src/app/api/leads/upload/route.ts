import { NextResponse } from "next/server";

type ParsedLead = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  source?: string;
  notes?: string;
};

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return phone.trim();
}

function parseCsv(text: string): ParsedLead[] {
  const [headerLine, ...rows] = text.trim().split(/\r?\n/);
  if (!headerLine) return [];

  const headers = headerLine.split(",").map((header) => header.trim().toLowerCase());

  return rows
    .map((row) => {
      const values = row.split(",").map((value) => value.trim());
      const record = Object.fromEntries(
        headers.map((header, index) => [header, values[index] ?? ""]),
      );

      return {
        name: record.name ?? "",
        phone: normalizePhone(record.phone ?? record["phone number"] ?? ""),
        email: record.email,
        city: record.city,
        source: record.source,
        notes: record.notes,
      };
    })
    .filter((lead) => lead.name || lead.phone);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Upload a CSV or XLSX file under the field name 'file'." },
      { status: 400 },
    );
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "xlsx") {
    return NextResponse.json({
      fileName: file.name,
      status: "queued",
      message:
        "XLSX received. The production parser should convert the workbook into the normalized lead schema.",
    });
  }

  const text = await file.text();
  const parsed = parseCsv(text);
  const seen = new Set<string>();
  const duplicates: string[] = [];
  const invalid: ParsedLead[] = [];

  for (const lead of parsed) {
    if (!/^\+91\d{10}$/.test(lead.phone)) {
      invalid.push(lead);
      continue;
    }
    if (seen.has(lead.phone)) {
      duplicates.push(lead.phone);
    }
    seen.add(lead.phone);
  }

  return NextResponse.json({
    fileName: file.name,
    parsedCount: parsed.length,
    validCount: parsed.length - invalid.length - duplicates.length,
    duplicateNumbers: duplicates,
    invalidRows: invalid,
    normalizedPreview: parsed.slice(0, 5),
  });
}
