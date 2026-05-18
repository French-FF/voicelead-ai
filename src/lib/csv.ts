export type ParsedLead = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  source?: string;
  campaignId?: string;
  leadType?: string;
  notes?: string;
  customFields: Record<string, string>;
};

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length > 0 && phone.trim().startsWith("+")) return phone.trim();
  return phone.trim();
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function cellToString(value: unknown) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function parseLeadRows(rows: unknown[][]): ParsedLead[] {
  const [headerRow, ...dataRows] = rows;
  if (!headerRow) return [];

  const headers = headerRow.map((header) =>
    cellToString(header).trim().toLowerCase(),
  );
  const known = new Set([
    "name",
    "phone",
    "phone number",
    "email",
    "city",
    "source",
    "campaign",
    "campaign id",
    "lead type",
    "notes",
  ]);

  return dataRows
    .map((row) => {
      const record = Object.fromEntries(
        headers.map((header, index) => [header, cellToString(row[index])]),
      );
      const customFields = Object.fromEntries(
        headers
          .filter((header) => !known.has(header))
          .map((header) => [header, record[header] ?? ""]),
      );

      return {
        name: record.name ?? "",
        phone: normalizePhone(record.phone ?? record["phone number"] ?? ""),
        email: record.email,
        city: record.city,
        source: record.source,
        campaignId: record["campaign id"] || record.campaign,
        leadType: record["lead type"],
        notes: record.notes,
        customFields,
      };
    })
    .filter((lead) => lead.name || lead.phone);
}

export function parseLeadCsv(text: string): ParsedLead[] {
  const rows = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map(parseCsvLine);

  return parseLeadRows(rows);
}

export function parseLeadXlsxRows(rows: unknown[][]): ParsedLead[] {
  return parseLeadRows(rows);
}

export function isValidIndianMobile(phone: string) {
  return /^\+91[6-9]\d{9}$/.test(phone);
}
