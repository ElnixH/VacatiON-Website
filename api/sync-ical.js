// api/sync-ical.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || 'https://rdawaagwkopqogwnvbsy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYXdhYWd3a29wcW9nd252YnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMDU3NjksImV4cCI6MjEwODY4MTc2OX0.tjmDNPgMSSOcbAKa3pPy1nGXotvo8sBCCBqyr1Ml0M8'
);

const DEFAULT_CRON_KEY = process.env.CRON_SECRET_KEY || 's7-tinos-cron-2027';

function parseIcsDates(icsText) {
  const events = icsText.split('BEGIN:VEVENT').slice(1);
  const dates = [];

  events.forEach((block) => {
    const startMatch = block.match(/DTSTART(?:;[^:]*)?:(\d{8})/);
    const endMatch = block.match(/DTEND(?:;[^:]*)?:(\d{8})/);
    if (startMatch && endMatch) {
      const s = startMatch[1];
      const e = endMatch[1];
      const curr = new Date(
        `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T00:00:00Z`
      );
      const end = new Date(
        `${e.slice(0, 4)}-${e.slice(4, 6)}-${e.slice(6, 8)}T00:00:00Z`
      );
      while (curr < end) {
        dates.push(curr.toISOString().slice(0, 10));
        curr.setUTCDate(curr.getUTCDate() + 1);
      }
    }
  });
  return dates;
}

async function fetchWithTimeout(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'VacationTinos-ChannelSync/1.0' },
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export default async function handler(req, res) {
  // Verify cron-job.org key via query (?key=...) or header (x-cron-secret)
  const providedKey = req.query.key || req.headers['x-cron-secret'];
  if (DEFAULT_CRON_KEY && providedKey && providedKey !== DEFAULT_CRON_KEY) {
    return res.status(401).json({ ok: false, error: 'Invalid cron key' });
  }

  try {
    const { data: row } = await supabaseAdmin
      .from('s7_ari_store')
      .select('payload')
      .eq('id', 'master')
      .maybeSingle();

    if (!row?.payload) {
      return res.status(200).json({ ok: true, status: 'empty_store' });
    }

    const store = row.payload;
    if (!store.calendar) store.calendar = {};
    if (!store.gateway) store.gateway = {};

    const nowIso = new Date().toISOString();
    let syncedNights = 0;
    let feedsChecked = 0;

    for (const pid of Object.keys(store.properties || {})) {
      const channels = store.properties[pid].channels || {};
      if (!store.calendar[pid]) store.calendar[pid] = {};

      for (const chKey of Object.keys(channels)) {
        const feedUrl = channels[chKey]?.icalImportUrl;
        if (feedUrl && feedUrl.startsWith('http')) {
          feedsChecked++;
          try {
            const resp = await fetchWithTimeout(feedUrl, 9000);
            if (resp.ok) {
              const icsText = await resp.text();
              const activeOtaDates = new Set(parseIcsDates(icsText));
              const channelTag = `${chKey.toUpperCase()} Auto-Sync`;

              // 1. Re-open any previous auto-synced dates from this channel that were cancelled
              Object.keys(store.calendar[pid]).forEach((iso) => {
                const existing = store.calendar[pid][iso];
                if (
                  existing?.status === 'booked-ota' &&
                  existing?.note === channelTag &&
                  !activeOtaDates.has(iso)
                ) {
                  store.calendar[pid][iso] = {
                    ...existing,
                    status: 'open',
                    note: '',
                  };
                }
              });

              // 2. Block all active booked dates from this OTA feed
              activeOtaDates.forEach((iso) => {
                const existing = store.calendar[pid][iso] || {};
                // Do not overwrite Direct Guest bookings
                if (existing.status !== 'booked-direct') {
                  store.calendar[pid][iso] = {
                    ...existing,
                    status: 'booked-ota',
                    note: channelTag,
                  };
                  syncedNights++;
                }
              });

              store.properties[pid].channels[chKey].lastSync = nowIso;
            }
          } catch {
            // Skip timed-out feed without failing the cron job
          }
        }
      }
    }

    store.gateway.lastCronRun = nowIso;

    await supabaseAdmin.from('s7_ari_store').upsert({
      id: 'master',
      payload: store,
      updated_at: nowIso,
    });

    // Compact JSON response (<200 bytes) so console.cron-job.org never flags "Output too large"
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      ok: true,
      feedsChecked,
      syncedNights,
      ts: nowIso,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}