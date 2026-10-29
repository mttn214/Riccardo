import { Seminar, COMPANY_DETAILS, STYLIST_PROFILE } from '../data/content';

export interface CalendarEventDetails {
  seminar: Seminar;
  attendeeName: string;
  confirmationCode: string;
  tierName?: string;
  amountEUR?: number;
}

export interface ParsedDates {
  dtStart: string; // YYYYMMDDTHHMMSS
  dtEnd: string;   // YYYYMMDDTHHMMSS
  filename: string;
}

/**
 * Returns exact start and end dates/times in Europe/Bratislava local time
 * formatted for iCalendar (RFC 5545) and Google Calendar.
 */
export function getSeminarCalendarDates(seminar: Seminar): ParsedDates {
  const id = seminar.id || '';

  if (id.includes('biker') || id.includes('glamour') || id.includes('kuce') || seminar.dates?.includes('Máj 2027')) {
    return {
      dtStart: '20270517T093000',
      dtEnd: '20270518T173000',
      filename: 'Masterclass-Biker-Glamour-Riccardo-Lucenec.ics',
    };
  }

  if (id.includes('fukan') || id.includes('objem') || (seminar.dates?.includes('November 2026') && !id.includes('biker'))) {
    return {
      dtStart: '20261116T093000',
      dtEnd: '20261117T173000',
      filename: 'Masterclass-Styling-Riccardo-Lucenec.ics',
    };
  }

  if (id.includes('strih') || seminar.dates?.includes('Január 2027')) {
    return {
      dtStart: '20270118T093000',
      dtEnd: '20270119T173000',
      filename: 'Masterclass-Precizny-Strih-Riccardo-Lucenec.ics',
    };
  }

  if (id.includes('balayage') || seminar.dates?.includes('Marec 2027')) {
    return {
      dtStart: '20270315T093000',
      dtEnd: '20270316T173000',
      filename: 'Masterclass-Balayage-Riccardo-Lucenec.ics',
    };
  }

  // Dynamic upcoming Saturday for live verification / testing items
  const now = new Date();
  const daysUntilSaturday = ((6 - now.getDay()) + 7) % 7 || 7;
  const targetDate = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const y = targetDate.getFullYear();
  const m = pad(targetDate.getMonth() + 1);
  const d = pad(targetDate.getDate());

  return {
    dtStart: `${y}${m}${d}T093000`,
    dtEnd: `${y}${m}${d}T173000`,
    filename: 'Masterclass-Riccardo-Lucenec.ics',
  };
}

/**
 * Builds rich, detailed event description with all key information:
 * Salon address, attendee name, booking code, schedule, phone contact, and Google Maps.
 */
export function buildEventDescription(details: CalendarEventDetails): string {
  const { seminar, attendeeName, confirmationCode, tierName, amountEUR } = details;

  return [
    `OFICIÁLNA VIP REZERVÁCIA — HAIR SALON RICCARDO`,
    `Masterclass s Richardom Čonkom (víťaz Czech & Slovak Hairdressing Awards)`,
    ``,
    `Kód rezervácie / VIP vstupenky: ${confirmationCode}`,
    `Meno účastníka: ${attendeeName || 'Účastník'}`,
    `Názov kurzu: ${seminar.title}`,
    tierName ? `Typ balíčka: ${tierName}${amountEUR ? ` (${amountEUR} €)` : ''}` : '',
    ``,
    `MIESTO KONANIA:`,
    `Atelier Hair Salon Riccardo`,
    `J. Kármána 1727/30, 984 01 Lučenec, Slovensko`,
    `Google Maps navigácia: ${STYLIST_PROFILE.googleMapsUrl}`,
    ``,
    `HARMONOGRAM MASTERCLASSU:`,
    `1. Deň (09:30 – 18:00): Teória, rozbor štruktúry vlasu, živé modelky & praktický tréning.`,
    `2. Deň (09:30 – 17:30): Samostatná práca na modelkách, styling, odovzdanie certifikátov.`,
    ``,
    `ČO JE V CENE:`,
    `- Pomôcky a cvičný materiál`,
    `- Gurmánsky obed a celodenný catering po oba dni`,
    `- Oficiálny akreditovaný certifikát Riccardo Academy`,
    `- Profesionálne fotografie vašich prác pre sociálne siete`,
    ``,
    `KONTAKT & ASISTENCIA:`,
    `Telefón: ${COMPANY_DETAILS.phone} (asistentka) / ${COMPANY_DETAILS.secondaryPhone}`,
    `Email: ${COMPANY_DETAILS.contactEmail}`,
    `Prevádzkovateľ: ${COMPANY_DETAILS.legalName} (IČO: ${COMPANY_DETAILS.ico})`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Escapes characters for RFC 5545 iCalendar syntax.
 */
function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generates full RFC 5545 compliant .ics file content and clean filename.
 */
export function generateIcsCalendar(details: CalendarEventDetails): {
  icsContent: string;
  filename: string;
} {
  const { seminar, confirmationCode } = details;
  const dates = getSeminarCalendarDates(seminar);
  const description = buildEventDescription(details);
  const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `RIC-${confirmationCode || Date.now()}-${dates.dtStart}@hairsalonriccardo.sk`;
  const location = 'Atelier Hair Salon Riccardo, J. Kármána 1727/30, 984 01 Lučenec';
  const summary = `${seminar.title} — Hair Salon Riccardo`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hair Salon Riccardo//Masterclass Reservations//SK',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Hair Salon Riccardo Masterclass',
    'X-WR-TIMEZONE:Europe/Bratislava',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART;TZID=Europe/Bratislava:${dates.dtStart}`,
    `DTEND;TZID=Europe/Bratislava:${dates.dtEnd}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    'STATUS:CONFIRMED',
    'ORGANIZER;CN=Richard Čonka - Hair Salon Riccardo:mailto:hair.riccardo@gmail.com',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return {
    icsContent: icsLines.join('\r\n'),
    filename: dates.filename,
  };
}

/**
 * Triggers the browser download of the .ics file.
 */
export function downloadSeminarIcs(details: CalendarEventDetails) {
  const { icsContent, filename } = generateIcsCalendar(details);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generates Google Calendar web URL with local Europe/Bratislava time zone
 * and full pre-populated details.
 */
export function generateGoogleCalendarUrl(details: CalendarEventDetails): string {
  const { seminar } = details;
  const dates = getSeminarCalendarDates(seminar);
  const description = buildEventDescription(details);
  const location = 'Atelier Hair Salon Riccardo, J. Kármána 1727/30, 984 01 Lučenec';
  const summary = `${seminar.title} — Hair Salon Riccardo`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary,
    dates: `${dates.dtStart}/${dates.dtEnd}`,
    ctz: 'Europe/Bratislava',
    details: description,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
