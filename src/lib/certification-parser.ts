import { Buffer } from 'node:buffer';
import { VENDORS } from './vendors';

const MONTH_MAP: Record<string, number> = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sept: 8,
  sep: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
};

const DATE_PATTERNS = [
  /\b(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\b/g,
  /\b(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})\b/g,
  /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b/gi,
];

function sanitizeText(text: string): string {
  return text
    .replace(/[^\x09\x0A\x0D\x20-\x7E]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function bufferToText(buffer: Buffer, mimeType: string, fileName: string): string {
  if (/text\//.test(mimeType) || /json/.test(mimeType)) {
    return buffer.toString('utf8');
  }

  if (/pdf/.test(mimeType) || fileName.toLowerCase().endsWith('.pdf')) {
    // Attempt a naive extraction by converting binary to latin1 text.
    return buffer.toString('latin1');
  }

  return buffer.toString('utf8');
}

function parseDateString(raw: string): Date | null {
  const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const slashMatch = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})$/);
  if (slashMatch) {
    const [, a, b, c] = slashMatch;
    const year = c.length === 2 ? Number(`20${c}`) : Number(c);
    const monthFirst = Number(a) > 12 ? false : true;
    const month = monthFirst ? Number(a) - 1 : Number(b) - 1;
    const day = monthFirst ? Number(b) : Number(a);
    return new Date(year, month, day);
  }

  const monthMatch = raw.match(/^(?<month>[a-zA-Z]+)\s+(?<day>\d{1,2}),?\s+(?<year>\d{4})$/);
  if (monthMatch?.groups) {
    const month = MONTH_MAP[monthMatch.groups.month.toLowerCase()];
    if (month === undefined) return null;
    return new Date(Number(monthMatch.groups.year), month, Number(monthMatch.groups.day));
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function extractDates(text: string): Date[] {
  const matches: string[] = [];
  for (const pattern of DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      matches.push(match[0]);
    }
  }

  const uniqueDates: Date[] = [];
  for (const raw of matches) {
    const parsed = parseDateString(raw.trim());
    if (parsed && !uniqueDates.some(date => date.getTime() === parsed.getTime())) {
      uniqueDates.push(parsed);
    }
  }

  uniqueDates.sort((a, b) => a.getTime() - b.getTime());
  return uniqueDates;
}

function extractVendor(text: string, fileName: string): string | null {
  const haystack = `${text} ${fileName}`.toLowerCase();
  for (const vendorKey of Object.keys(VENDORS)) {
    const vendor = VENDORS[vendorKey as keyof typeof VENDORS];
    const name = vendor.name.toLowerCase();
    if (haystack.includes(name)) {
      return vendor.name;
    }
  }
  return null;
}

function extractCertificateName(text: string, fileName: string): string | null {
  const normalized = text.replace(/\r/g, '\n');
  const lines = normalized
    .split(/\n+/)
    .map(line => sanitizeText(line))
    .filter(Boolean);

  const candidate = lines.find(line => /certificate|certification/i.test(line));
  if (candidate) {
    return candidate;
  }

  if (lines.length > 0) {
    return lines[0];
  }

  const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
  return baseName || null;
}

function extractCertificateNumber(text: string): string | null {
  const match = text.match(/(?:certificate\s*(?:no|number)|id|credential)[:\s#-]*([A-Z0-9-]{4,})/i);
  return match ? match[1].trim() : null;
}

export interface ParsedCertification {
  vendor: string | null;
  certificateName: string | null;
  acquiredOn: Date | null;
  expiresOn: Date | null;
  certificateNumber: string | null;
  rawText: string;
}

export async function parseCertificationFile(file: File): Promise<ParsedCertification> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const text = bufferToText(buffer, file.type, file.name);
  const cleanText = sanitizeText(text);

  const dates = extractDates(cleanText);
  const acquiredOn = dates[0] ?? null;
  const expiresOn = dates.length > 1 ? dates[dates.length - 1] : null;

  return {
    vendor: extractVendor(cleanText, file.name),
    certificateName: extractCertificateName(text, file.name),
    acquiredOn,
    expiresOn,
    certificateNumber: extractCertificateNumber(cleanText),
    rawText: cleanText,
  };
}
