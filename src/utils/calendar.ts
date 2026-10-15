/**
 * Calendar integration utilities for Hair Salon Riccardo Academy
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: string; // YYYYMMDDTHHMMSSZ or YYYY-MM-DD
  endDate: string;
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${event.startDate.replace(/[-:]/g, '')}/${event.endDate.replace(/[-:]/g, '')}`,
  });
  return `${base}&${params.toString()}`;
}

export function downloadIcsFile(event: CalendarEvent, filename = "riccardo-masterclass.ics") {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hair Salon Riccardo//Academy Masterclass//SK",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `DTSTART:${event.startDate.replace(/[-:]/g, '')}`,
    `DTEND:${event.endDate.replace(/[-:]/g, '')}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
