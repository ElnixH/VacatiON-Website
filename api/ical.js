// api/ical.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://rdawaagwkopqogwnvbsy.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYXdhYWd3a29wcW9nd252YnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMDU3NjksImV4cCI6MjEwODY4MTc2OX0.tjmDNPgMSSOcbAKa3pPy1nGXotvo8sBCCBqyr1Ml0M8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function addOneDay(dateIso) {
  const d = new Date(`${dateIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

export default async function handler(req, res) {
  const propertyId = req.query.property || 'villa-leonora';

  const { data } = await supabase
    .from('s7_ari_store')
    .select('payload')
    .eq('id', 'master')
    .maybeSingle();

  const store = data?.payload || {};
  const propName = store?.properties?.[propertyId]?.name || propertyId;
  const cal = store?.calendar?.[propertyId] || {};

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vacation Tinos//S7 Cloud Channel Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${propName} - Availability`,
  ];

  Object.keys(cal)
    .sort()
    .forEach((dateIso) => {
      const entry = cal[dateIso];
      if (entry && entry.status && entry.status !== 'open') {
        const dtStart = dateIso.replace(/-/g, '');
        const dtEnd = addOneDay(dateIso);
        lines.push(
          'BEGIN:VEVENT',
          `UID:s7-${propertyId}-${dtStart}@vacationofficial.com`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `SUMMARY:CLOSED (${entry.status.toUpperCase()})`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      }
    });

  lines.push('END:VCALENDAR');

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  return res.status(200).send(lines.join('\r\n'));
}