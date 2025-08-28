export function icsFromCerts(opts: { 
  certs: { id: string; title: string; expiresOn: Date | null }[]; 
  timezone: string; 
}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KeepMyCert//EN',
    `X-WR-TIMEZONE:${opts.timezone}`,
  ];

  for (const cert of opts.certs) {
    if (!cert.expiresOn) continue;
    
    const eventDate = formatICSDate(opts.timezone, cert.expiresOn);
    const timestamp = formatICSDateUTC(new Date());
    
    lines.push(
      'BEGIN:VEVENT',
      `UID:${cert.id}@keepmycert.com`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;TZID=${opts.timezone}:${eventDate}`,
      `SUMMARY:${escapeICS(`Certification expires — ${cert.title}`)}`,
      'END:VEVENT'
    );
  }
  
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function escapeICS(text: string): string {
  return text.replace(/[,;]/g, '\\$&');
}

function pad(num: number): string {
  return String(num).padStart(2, '0');
}

function formatICSDate(timezone: string, date: Date): string {
  // Simple local date at 09:00
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}${month}${day}T090000`;
}

function formatICSDateUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}