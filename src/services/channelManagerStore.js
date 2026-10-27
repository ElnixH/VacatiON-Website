// src/services/channelManagerStore.js
const STORAGE_KEY = 'vacation_s7_ari_store_v1';
const AUTH_KEY = 'vacation_s7_session_v1';
const CREDENTIALS_KEY = 'vacation_s7_credentials_v1';

export const DEFAULT_PROPERTY_CONFIG = {
  'villa-leonora': {
    id: 'villa-leonora',
    name: 'Villa Leonora',
    code: 'VL-ARN-01',
    location: 'Arnados, Tinos',
    baseRate: 480,
    minStay: 3,
    currency: 'EUR',
    maxGuests: 4,
    otaMarkupPercent: 15,
    channels: {
      bookingCom: {
        enabled: true,
        hotelId: '7701258',
        roomId: 'VL-MAIN',
        ratePlanId: 'STD-RO',
        icalImportUrl: '',
        lastSync: null,
        status: 'connected',
      },
      airbnb: {
        enabled: true,
        listingId: 'abnb-vl-tinos',
        icalImportUrl: '',
        lastSync: null,
        status: 'connected',
      },
      vrbo: {
        enabled: false,
        listingId: 'vrbo-vl-tinos',
        icalImportUrl: '',
        lastSync: null,
        status: 'standby',
      },
    },
  },
  'andreas-traditional': {
    id: 'andreas-traditional',
    name: "Andrea's Traditional House",
    code: 'ATH-AGS-01',
    location: 'Agios Sostis, Tinos',
    baseRate: 210,
    minStay: 2,
    currency: 'EUR',
    maxGuests: 3,
    otaMarkupPercent: 12,
    channels: {
      bookingCom: {
        enabled: true,
        hotelId: '1487398',
        roomId: 'AND-TRAD-01',
        ratePlanId: 'STD-RO',
        icalImportUrl: '',
        lastSync: null,
        status: 'connected',
      },
      airbnb: {
        enabled: true,
        listingId: 'abnb-and-trad',
        icalImportUrl: '',
        lastSync: null,
        status: 'connected',
      },
      vrbo: {
        enabled: false,
        listingId: '',
        icalImportUrl: '',
        lastSync: null,
        status: 'standby',
      },
    },
  },
  'andreas-two-bed': {
    id: 'andreas-two-bed',
    name: "Andrea's Two-Bedroom House",
    code: 'ATB-AGS-02',
    location: 'Agios Sostis, Tinos',
    baseRate: 290,
    minStay: 2,
    currency: 'EUR',
    maxGuests: 5,
    otaMarkupPercent: 12,
    channels: {
      bookingCom: {
        enabled: true,
        hotelId: '1487398',
        roomId: 'AND-2BED-02',
        ratePlanId: 'STD-RO',
        icalImportUrl: '',
        lastSync: null,
        status: 'connected',
      },
      airbnb: {
        enabled: true,
        listingId: 'abnb-and-2bed',
        icalImportUrl: '',
        lastSync: null,
        status: 'connected',
      },
      vrbo: {
        enabled: false,
        listingId: '',
        icalImportUrl: '',
        lastSync: null,
        status: 'standby',
      },
    },
  },
};

const DEFAULT_GATEWAY_CONFIG = {
  provider: 'channex', // 'channex' | 'rentals-united' | 'beds24' | 'custom-webhook'
  endpointUrl: 'https://api.channex.io/api/v1/ari',
  apiKey: '',
  webhookSecret: '',
  autoSyncOnSave: true,
};

// Format Date to YYYY-MM-DD in local time
export function formatDateISO(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate array of YYYY-MM-DD strings between startDate and endDate (inclusive)
export function getDateRangeArray(startIso, endIso) {
  const dates = [];
  const curr = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  if (isNaN(curr.getTime()) || isNaN(end.getTime()) || curr > end) return dates;

  while (curr <= end) {
    dates.push(formatDateISO(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

// Load full ARI Store
export function loadAriStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = {
        properties: DEFAULT_PROPERTY_CONFIG,
        calendar: {
          'villa-leonora': {},
          'andreas-traditional': {},
          'andreas-two-bed': {},
        },
        gateway: DEFAULT_GATEWAY_CONFIG,
        auditLogs: [
          {
            id: 'init-1',
            timestamp: new Date().toISOString(),
            actor: 's7',
            action: 'SYSTEM_READY',
            details: 'S7 Channel Manager & ARI Vault initialized for 3 properties.',
          },
        ],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load S7 ARI store:', e);
    return {
      properties: DEFAULT_PROPERTY_CONFIG,
      calendar: {
        'villa-leonora': {},
        'andreas-traditional': {},
        'andreas-two-bed': {},
      },
      gateway: DEFAULT_GATEWAY_CONFIG,
      auditLogs: [],
    };
  }
}

export function saveAriStore(nextStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStore));
  window.dispatchEvent(new CustomEvent('s7-ari-updated', { detail: nextStore }));
}

// Get resolved ARI state for a specific property & date (YYYY-MM-DD)
export function getDayAri(store, propertyId, dateIso) {
  const prop = store.properties[propertyId] || DEFAULT_PROPERTY_CONFIG[propertyId];
  const override = store.calendar?.[propertyId]?.[dateIso] || {};

  // Seasonal smart default if no override is set (July/August peak adjustment)
  const month = parseInt(dateIso.split('-')[1], 10);
  const seasonalMultiplier = month === 7 || month === 8 ? 1.25 : month === 6 || month === 9 ? 1.1 : 1;
  const defaultSeasonalPrice = Math.round(prop.baseRate * seasonalMultiplier);

  const status = override.status || 'open'; // 'open' | 'closed' | 'booked-ota' | 'booked-direct' | 'maintenance'
  const price = override.price !== undefined ? Number(override.price) : defaultSeasonalPrice;
  const minStay = override.minStay !== undefined ? Number(override.minStay) : prop.minStay;
  const cta = Boolean(override.cta); // Closed to Arrival
  const ctd = Boolean(override.ctd); // Closed to Departure
  const note = override.note || '';

  return {
    date: dateIso,
    status,
    isAvailable: status === 'open',
    price,
    otaPrice: Math.round(price * (1 + (prop.otaMarkupPercent || 0) / 100)),
    minStay,
    cta,
    ctd,
    note,
    isCustomPrice: override.price !== undefined,
  };
}

// Bulk update dates for a property
export function updatePropertyDates(propertyId, dateArray, patch, actor = 's7') {
  const store = loadAriStore();
  if (!store.calendar[propertyId]) {
    store.calendar[propertyId] = {};
  }

  dateArray.forEach((dateIso) => {
    const existing = store.calendar[propertyId][dateIso] || {};
    const updated = { ...existing };

    if (patch.status !== undefined) updated.status = patch.status;
    if (patch.price !== undefined && patch.price !== '') {
      updated.price = patch.price === null ? undefined : Number(patch.price);
    }
    if (patch.minStay !== undefined && patch.minStay !== '') {
      updated.minStay = Number(patch.minStay);
    }
    if (patch.cta !== undefined) updated.cta = Boolean(patch.cta);
    if (patch.ctd !== undefined) updated.ctd = Boolean(patch.ctd);
    if (patch.note !== undefined) updated.note = patch.note;

    store.calendar[propertyId][dateIso] = updated;
  });

  store.auditLogs = [
    {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action: 'ARI_UPDATE',
      details: `${ store.properties[propertyId]?.name }: Updated ${dateArray.length} night(s) [${dateArray[0]} → ${dateArray[dateArray.length - 1]}] · ${JSON.stringify(patch)}`,
    },
    ...(store.auditLogs || []).slice(0, 99),
  ];

  saveAriStore(store);
  return store;
}

// Check if a Check-in -> Check-out range is bookable & calculate total price
export function evaluateStayQuote(propertyId, checkInIso, checkOutIso) {
  const store = loadAriStore();
  const prop = store.properties[propertyId];
  if (!prop || !checkInIso || !checkOutIso) return { valid: false, reason: 'Invalid dates' };

  const start = new Date(`${checkInIso}T00:00:00`);
  const end = new Date(`${checkOutIso}T00:00:00`);
  const nightsCount = Math.round((end - start) / (1000 * 60 * 60 * 24));

  if (nightsCount <= 0) {
    return { valid: false, reason: 'Check-out must be after check-in.' };
  }

  const stayDates = [];
  const cursor = new Date(start);
  while (cursor < end) {
    stayDates.push(formatDateISO(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const firstDayAri = getDayAri(store, propertyId, checkInIso);
  const checkOutDayAri = getDayAri(store, propertyId, checkOutIso);

  if (firstDayAri.cta) {
    return { valid: false, reason: `Check-in is not permitted on ${checkInIso} (Closed to Arrival).` };
  }
  if (checkOutDayAri.ctd) {
    return { valid: false, reason: `Check-out is not permitted on ${checkOutIso} (Closed to Departure).` };
  }
  if (nightsCount < firstDayAri.minStay) {
    return {
      valid: false,
      reason: `Minimum stay for ${prop.name} starting ${checkInIso} is ${firstDayAri.minStay} nights.`,
    };
  }

  let totalDirect = 0;
  let totalOta = 0;
  const blockedDates = [];

  stayDates.forEach((d) => {
    const day = getDayAri(store, propertyId, d);
    if (!day.isAvailable) {
      blockedDates.push(d);
    }
    totalDirect += day.price;
    totalOta += day.otaPrice;
  });

  if (blockedDates.length > 0) {
    return {
      valid: false,
      reason: `Selected range includes ${blockedDates.length} unavailable night(s): ${blockedDates.slice(0, 3).join(', ')}${blockedDates.length > 3 ? '...' : ''}`,
      blockedDates,
    };
  }

  return {
    valid: true,
    nights: nightsCount,
    totalDirect,
    totalOta,
    avgNightly: Math.round(totalDirect / nightsCount),
    currency: prop.currency || 'EUR',
  };
}

// Generate standard RFC 5545 iCal (.ics) feed for Booking.com / Airbnb / VRBO import
export function generatePropertyIcal(propertyId) {
  const store = loadAriStore();
  const prop = store.properties[propertyId];
  const cal = store.calendar[propertyId] || {};

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vacation Tinos//S7 Channel Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${prop.name} - Availability`,
  ];

  Object.keys(cal)
    .sort()
    .forEach((dateIso) => {
      const entry = cal[dateIso];
      if (entry && entry.status && entry.status !== 'open') {
        const dtStart = dateIso.replace(/-/g, '');
        const nextDay = new Date(`${dateIso}T00:00:00`);
        nextDay.setDate(nextDay.getDate() + 1);
        const dtEnd = formatDateISO(nextDay).replace(/-/g, '');

        lines.push(
          'BEGIN:VEVENT',
          `UID:s7-${propertyId}-${dtStart}@vacationofficial.com`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `DTSTART;VALUE=DATE:${dtStart}`,
          `DTEND;VALUE=DATE:${dtEnd}`,
          `SUMMARY:CLOSED (${entry.status.toUpperCase()})${entry.note ? ` - ${entry.note}` : ''}`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      }
    });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

// Parse incoming iCal (.ics) text and mark dates as 'booked-ota'
export function importPropertyIcal(propertyId, icsText) {
  const events = icsText.split('BEGIN:VEVENT').slice(1);
  const importedDates = [];

  events.forEach((block) => {
    const startMatch = block.match(/DTSTART(?:;[^:]*)?:(\d{8})/);
    const endMatch = block.match(/DTEND(?:;[^:]*)?:(\d{8})/);
    if (startMatch && endMatch) {
      const s = startMatch[1];
      const e = endMatch[1];
      const startIso = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
      const endIso = `${e.slice(0, 4)}-${e.slice(4, 6)}-${e.slice(6, 8)}`;

      const curr = new Date(`${startIso}T00:00:00`);
      const end = new Date(`${endIso}T00:00:00`);
      while (curr < end) {
        importedDates.push(formatDateISO(curr));
        curr.setDate(curr.getDate() + 1);
      }
    }
  });

  if (importedDates.length > 0) {
    updatePropertyDates(
      propertyId,
      importedDates,
      { status: 'booked-ota', note: 'iCal OTA Sync' },
      's7-ical-sync'
    );
  }
  return importedDates.length;
}

// Build standard Channel Manager ARI JSON payload & optionally push to webhook/API
export async function pushChannelManagerAri(propertyId = 'all') {
  const store = loadAriStore();
  const targetProps =
    propertyId === 'all' ? Object.keys(store.properties) : [propertyId];

  const payload = {
    meta: {
      operator: 's7',
      brand: 'VACATION_TINOS',
      legalEntity: 'THEODORA LEKASI PC',
      provider: store.gateway.provider,
      pushedAt: new Date().toISOString(),
    },
    inventoryUpdates: targetProps.map((pid) => {
      const prop = store.properties[pid];
      const overrides = store.calendar[pid] || {};
      return {
        propertyId: pid,
        internalCode: prop.code,
        baseRate: prop.baseRate,
        currency: prop.currency,
        otaMarkupPercent: prop.otaMarkupPercent,
        channelMappings: prop.channels,
        ariRecords: Object.entries(overrides).map(([date, data]) => {
          const resolved = getDayAri(store, pid, date);
          return {
            date,
            available: resolved.isAvailable ? 1 : 0,
            stopSell: !resolved.isAvailable,
            rateDirect: resolved.price,
            rateOta: resolved.otaPrice,
            minStay: resolved.minStay,
            closedToArrival: resolved.cta,
            closedToDeparture: resolved.ctd,
            statusTag: resolved.status,
          };
        }),
      };
    }),
  };

  let networkResult = { simulated: true, ok: true };

  // If admin s7 configured a live webhook/API key, dispatch actual HTTP POST
  if (store.gateway.endpointUrl && store.gateway.apiKey) {
    try {
      const res = await fetch(store.gateway.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.gateway.apiKey}`,
          'X-S7-Operator': 's7',
        },
        body: JSON.stringify(payload),
      });
      networkResult = { simulated: false, ok: res.ok, status: res.status };
    } catch (err) {
      networkResult = { simulated: false, ok: false, error: err.message };
    }
  }

  // Update timestamps on connected channels
  const nowIso = new Date().toISOString();
  targetProps.forEach((pid) => {
    Object.keys(store.properties[pid].channels).forEach((chKey) => {
      if (store.properties[pid].channels[chKey].enabled) {
        store.properties[pid].channels[chKey].lastSync = nowIso;
      }
    });
  });

  store.auditLogs = [
    {
      id: `sync-${Date.now()}`,
      timestamp: nowIso,
      actor: 's7',
      action: 'CHANNEL_ARI_PUSH',
      details: `Pushed ARI payload for [${targetProps.join(', ')}] via ${store.gateway.provider.toUpperCase()}.`,
    },
    ...(store.auditLogs || []).slice(0, 99),
  ];

  saveAriStore(store);
  return { payload, networkResult, store };
}

// Authentication helpers for Admin "s7"
export function verifyS7Login(username, passkey) {
  const normalizedUser = (username || '').trim().toLowerCase();
  if (normalizedUser !== 's7') {
    return { ok: false, error: 'Unauthorized Operator ID. Access restricted to s7.' };
  }

  const savedPass = localStorage.getItem(CREDENTIALS_KEY) || 's7-tinos-2027';
  // Allow either the custom/default passkey OR 's7' for immediate owner access
  if (passkey === savedPass || passkey === 's7') {
    const session = {
      operator: 's7',
      authenticatedAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 12, // 12-hour session
    };
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { ok: true, session };
  }

  return { ok: false, error: 'Invalid S7 Master Passkey.' };
}

export function getS7Session() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(AUTH_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function logoutS7Session() {
  sessionStorage.removeItem(AUTH_KEY);
}

export function updateS7Passkey(newPasskey) {
  if (!newPasskey || newPasskey.trim().length < 2) return false;
  localStorage.setItem(CREDENTIALS_KEY, newPasskey.trim());
  return true;
}