// src/components/S7AdminPortal.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

import {
  Shield,
  Lock,
  Unlock,
  Calendar as CalendarIcon,
  RefreshCw,
  Link2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  LogOut,
  Layers,
  Euro,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  ArrowUpRight,
  MousePointerClick,
  RotateCcw,
  List,
  Grid,
  History,
  Check,
  X,
  Info,
  Clock,
} from 'lucide-react';
import {
  loadAriStore,
  saveAriStore,
  syncAriStoreFromCloud,
  getDayAri,
  updatePropertyDates,
  formatDateISO,
  getDateRangeArray,
  generatePropertyIcal,
  importPropertyIcal,
  pushChannelManagerAri,
} from '../services/channelManagerStore';

// High-contrast status styles with explicit short text badges for color-blind & mobile clarity
const BRIGHT_STATUS_STYLES = {
  open: {
    label: 'Open & Bookable',
    shortLabel: 'OPEN',
    cardBg: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-950',
    badgeBg: 'bg-emerald-600 text-white',
    dot: 'bg-emerald-500',
    isProtected: false,
  },
  closed: {
    label: 'Owner Closed',
    shortLabel: 'CLOSED',
    cardBg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-300 text-rose-950',
    badgeBg: 'bg-rose-600 text-white',
    dot: 'bg-rose-500',
    isProtected: false,
  },
  'booked-direct': {
    label: 'Booked (Direct Guest)',
    shortLabel: 'DIRECT',
    cardBg: 'bg-blue-50 hover:bg-blue-100/80 border-blue-300 text-blue-950',
    badgeBg: 'bg-blue-600 text-white',
    dot: 'bg-blue-600',
    isProtected: true,
  },
  'booked-ota': {
    label: 'Booked (OTA Channel)',
    shortLabel: 'OTA',
    cardBg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-300 text-amber-950',
    badgeBg: 'bg-amber-600 text-white',
    dot: 'bg-amber-500',
    isProtected: true,
  },
  maintenance: {
    label: 'Maintenance Hold',
    shortLabel: 'MAINT',
    cardBg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-300 text-purple-950',
    badgeBg: 'bg-purple-600 text-white',
    dot: 'bg-purple-600',
    isProtected: true,
  },
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const euroFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

// Session Timeout Constants (1 Hour Default vs 7 Days with Remember Me)
const SESSION_META_KEY = 'vacation_s7_session_timeout_v1';
const REMEMBER_POLICY_KEY = 'vacation_s7_allow_remember_me_v1';
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 Hour (3,600,000 ms)
const REMEMBER_ME_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days

// Derive truthful connection state from actual property channel configuration
function getPropertyConnectionState(prop, syncError) {
  if (syncError) {
    return {
      label: 'Sync Error · Retry Needed',
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300',
      dotClass: 'bg-rose-500',
    };
  }
  const channels = Object.values(prop?.channels || {});
  const enabledChannels = channels.filter((c) => c.enabled);
  const syncedChannels = enabledChannels.filter((c) => Boolean(c.lastSync));

  if (enabledChannels.length === 0) {
    return {
      label: 'Not Connected (Local Only)',
      badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300',
      dotClass: 'bg-slate-400',
    };
  }
  if (syncedChannels.length > 0) {
    return {
      label: `Synced (${syncedChannels.length} OTA${syncedChannels.length > 1 ? 's' : ''})`,
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      dotClass: 'bg-emerald-500',
    };
  }
  return {
    label: 'Configured · Awaiting Sync',
    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300',
    dotClass: 'bg-amber-500',
  };
}

export default function S7AdminPortal({ setView }) {
  // ==========================================================================
  // 1. SUPABASE AUTHENTICATION, RATE-LIMIT & 1-HOUR SESSION TIMEOUT STATE
  // ==========================================================================
  const [session, setSession] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);

  // Admin "Remember Me" Permission & 1-Hour Session Timer State
  const [allowRememberMePolicy, setAllowRememberMePolicy] = useState(() => {
    const saved = localStorage.getItem(REMEMBER_POLICY_KEY);
    return saved === null ? true : saved === 'true';
  });
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const [isExtendedSession, setIsExtendedSession] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(3600);

  // ==========================================================================
  // 2. STORE, UNDO STACK & NAVIGATION STATE
  // ==========================================================================
  const [store, setStore] = useState(() => loadAriStore());
  const [undoStack, setUndoStack] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'matrix' | 'channels' | 'history' | 'security'
  const [selectedProperty, setSelectedProperty] = useState('villa-leonora');
  const [calendarViewMode, setCalendarViewMode] = useState('grid'); // 'grid' | 'list'

  // 1-Click Paint Mode ('select' | 'paint-open' | 'paint-closed' | 'paint-price')
  const [clickMode, setClickMode] = useState('select');
  const [quickPaintPrice, setQuickPaintPrice] = useState('480');

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDates, setSelectedDates] = useState([]);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');

  // Side Inspector Controls for Selected Dates
  const [editStatus, setEditStatus] = useState('open');
  const [editPrice, setEditPrice] = useState('');
  const [editMinStay, setEditMinStay] = useState('');
  const [editCta, setEditCta] = useState(false);
  const [editCtd, setEditCtd] = useState(false);
  const [editNote, setEditNote] = useState('');

  // Protected Date Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState(null);

  // Explicit Save/Cancel Draft State for Property Defaults
  const [settingsDraft, setSettingsDraft] = useState({
    baseRate: 480,
    minStay: 3,
    otaMarkupPercent: 15,
  });
  const [settingsDirty, setSettingsDirty] = useState(false);

  // Explicit Save/Cancel Draft State for Channel Settings (+ iCal Import URLs for cron-job.org)
  const [channelDraft, setChannelDraft] = useState({
    provider: 'channex',
    endpointUrl: '',
    bookingHotelId: '',
    bookingRoomId: '',
    bookingRatePlanId: '',
    bookingIcalImportUrl: '',
    airbnbListingId: '',
    airbnbIcalImportUrl: '',
  });
  const [channelDirty, setChannelDirty] = useState(false);

  // Sync Status & Per-Channel Report
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [lastSyncReport, setLastSyncReport] = useState(null);

  const [toast, setToast] = useState(null);
  const [icalImportText, setIcalImportText] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Prevent search engine indexing on admin route
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Pull latest store from Supabase Cloud on mount
  useEffect(() => {
    if (typeof syncAriStoreFromCloud === 'function') {
      syncAriStoreFromCloud().then((cloudPayload) => {
        if (cloudPayload) {
          setStore(cloudPayload);
          if (cloudPayload?.security?.allowRememberMe !== undefined) {
            const allowed = Boolean(cloudPayload.security.allowRememberMe);
            setAllowRememberMePolicy(allowed);
            localStorage.setItem(REMEMBER_POLICY_KEY, String(allowed));
          }
        }
      });
    }
  }, []);

  const handleLogout = useCallback(async (timeoutMessage = '') => {
    localStorage.removeItem(SESSION_META_KEY);
    await supabase.auth.signOut();
    setSession(null);
    if (timeoutMessage && typeof timeoutMessage === 'string') {
      setLoginError(timeoutMessage);
    }
  }, []);

  // Supabase Auth Session Listener + 1-Hour Expiry Check
  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        const activeSess = data?.session || null;

        if (activeSess) {
          try {
            const rawMeta = localStorage.getItem(SESSION_META_KEY);
            const meta = rawMeta ? JSON.parse(rawMeta) : null;

            if (meta && meta.expiresAt && Date.now() < meta.expiresAt) {
              setSession(activeSess);
              setIsExtendedSession(Boolean(meta.extended));
              setRemainingSeconds(
                Math.max(1, Math.floor((meta.expiresAt - Date.now()) / 1000))
              );
            } else if (!meta) {
              // Initialize a default 1-hour session if none existed yet
              const expiresAt = Date.now() + ONE_HOUR_MS;
              localStorage.setItem(
                SESSION_META_KEY,
                JSON.stringify({
                  email: activeSess.user.email,
                  extended: false,
                  expiresAt,
                })
              );
              setSession(activeSess);
              setIsExtendedSession(false);
              setRemainingSeconds(3600);
            } else {
              // Expired session -> Sign out immediately
              handleLogout('Your session timed out after 1 hour. Please sign in again.');
            }
          } catch {
            setSession(activeSess);
          }
        } else {
          setSession(null);
        }
        setIsCheckingAuth(false);
      })
      .catch(() => {
        if (mounted) setIsCheckingAuth(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleLogout]);

  // Live 1-Second Session Countdown Timer (Enforces 1-hour or 7-day timeout)
  useEffect(() => {
    if (!session) return;

    const timer = setInterval(() => {
      try {
        const rawMeta = localStorage.getItem(SESSION_META_KEY);
        if (!rawMeta) return;
        const meta = JSON.parse(rawMeta);
        const secsLeft = Math.floor((meta.expiresAt - Date.now()) / 1000);

        if (secsLeft <= 0) {
          clearInterval(timer);
          handleLogout('Session timed out for security. Please sign in again.');
        } else {
          setRemainingSeconds(secsLeft);
        }
      } catch {
        // Ignore parse errors
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session, handleLogout]);

  const formatSessionCountdown = (totalSec) => {
    if (totalSec > 86400) {
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      return `${d}d ${h}h`;
    }
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Sync staged drafts whenever selectedProperty changes
  useEffect(() => {
    const prop = store.properties[selectedProperty];
    if (!prop) return;
    setSettingsDraft({
      baseRate: prop.baseRate,
      minStay: prop.minStay,
      otaMarkupPercent: prop.otaMarkupPercent,
    });
    setSettingsDirty(false);

    setChannelDraft({
      provider: store.gateway?.provider || 'channex',
      endpointUrl: store.gateway?.endpointUrl || '',
      bookingHotelId: prop.channels?.bookingCom?.hotelId || '',
      bookingRoomId: prop.channels?.bookingCom?.roomId || '',
      bookingRatePlanId: prop.channels?.bookingCom?.ratePlanId || '',
      bookingIcalImportUrl: prop.channels?.bookingCom?.icalImportUrl || '',
      airbnbListingId: prop.channels?.airbnb?.listingId || '',
      airbnbIcalImportUrl: prop.channels?.airbnb?.icalImportUrl || '',
    });
    setChannelDirty(false);
    setQuickPaintPrice(String(prop.baseRate));
  }, [selectedProperty, store.properties, store.gateway]);

  const showNotification = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Push current state snapshot to Undo Stack before modifying calendar
  const pushUndoSnapshot = (description) => {
    const snapshot = JSON.parse(JSON.stringify(store));
    setUndoStack((prev) => [{ snapshot, description, time: new Date() }, ...prev.slice(0, 14)]);
  };

  const handleUndoLastAction = () => {
    if (undoStack.length === 0) return;
    const [latest, ...rest] = undoStack;
    saveAriStore(latest.snapshot);
    setStore(latest.snapshot);
    setUndoStack(rest);
    showNotification(`Undid: ${latest.description}`);
  };

  // ==========================================================================
  // 3. SUPABASE LOGIN & SESSION TIMEOUT POLICY HANDLERS
  // ==========================================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    if (Date.now() < lockoutUntil) {
      const waitSec = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`Too many failed attempts. Please wait ${waitSec}s before trying again.`);
      return;
    }

    setLoginError('');
    setIsLoggingIn(true);

    try {
      const cleanEmail = emailInput.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: passwordInput,
      });

      if (error) {
        const nextFailures = failedAttempts + 1;
        setFailedAttempts(nextFailures);
        if (nextFailures >= 5) {
          setLockoutUntil(Date.now() + 30000);
          setLoginError(
            'Account temporarily locked for 30 seconds due to multiple failed attempts.'
          );
        } else {
          setLoginError('Authentication failed. Verify your email and password.');
        }
      } else {
        setFailedAttempts(0);
        setPasswordInput('');

        // Set 1-Hour Session Timeout (unless Admin allows Remember Me & box is checked)
        const useExtended = allowRememberMePolicy && rememberMeChecked;
        const durationMs = useExtended ? REMEMBER_ME_MS : ONE_HOUR_MS;
        const expiresAt = Date.now() + durationMs;

        localStorage.setItem(
          SESSION_META_KEY,
          JSON.stringify({
            email: data?.user?.email || cleanEmail,
            extended: useExtended,
            authenticatedAt: Date.now(),
            expiresAt,
          })
        );
        setIsExtendedSession(useExtended);
        setRemainingSeconds(Math.floor(durationMs / 1000));
      }
    } catch {
      setLoginError('Unable to reach authentication service. Check your connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const actorName = session?.user?.email || 'authenticated-admin';

  const handleToggleRememberMePolicy = (allowed) => {
    setAllowRememberMePolicy(allowed);
    localStorage.setItem(REMEMBER_POLICY_KEY, String(allowed));

    const next = JSON.parse(JSON.stringify(store));
    next.security = {
      ...(next.security || {}),
      allowRememberMe: allowed,
    };
    next.auditLogs = [
      {
        id: `sec-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: actorName,
        action: 'SESSION_POLICY_UPDATED',
        details: allowed
          ? 'Allowed "Remember Me" extended sessions (7 days).'
          : 'Enforced strict 1-hour session timeout for all logins.',
      },
      ...(next.auditLogs || []).slice(0, 99),
    ];

    // If Remember Me is revoked while an extended session is active, cap it to 1 hour immediately
    if (!allowed && isExtendedSession) {
      const expiresAt = Date.now() + ONE_HOUR_MS;
      localStorage.setItem(
        SESSION_META_KEY,
        JSON.stringify({
          email: actorName,
          extended: false,
          expiresAt,
        })
      );
      setIsExtendedSession(false);
      setRemainingSeconds(3600);
    }

    saveAriStore(next);
    setStore(next);
    showNotification(
      allowed
        ? 'Enabled "Remember Me" extended sessions.'
        : 'Disabled "Remember Me". All sessions now strictly time out after 1 hour.'
    );
  };

  // ==========================================================================
  // 4. CALENDAR COMPUTATION & PROTECTED DATE SAFEGUARDS
  // ==========================================================================
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const iso = formatDateISO(dateObj);
      const ari = getDayAri(store, selectedProperty, iso);
      cells.push({ dateObj, iso, dayNumber: d, ari });
    }
    return cells;
  }, [currentMonth, store, selectedProperty]);

  // Execute a verified calendar update (with Undo snapshot)
  const executeSafeDateUpdate = (propId, dates, patch, label) => {
    pushUndoSnapshot(label);
    const next = updatePropertyDates(propId, dates, patch, actorName);
    setStore({ ...next });
    showNotification(label);
  };

  // Check if any target dates have a protected status ('booked-direct', 'booked-ota', 'maintenance')
  const requestDateUpdateWithProtection = (propId, dates, patch, label) => {
    const protectedHits = dates.filter((iso) => {
      const currentAri = getDayAri(store, propId, iso);
      const isCurrentlyProtected =
        BRIGHT_STATUS_STYLES[currentAri.status]?.isProtected;
      return isCurrentlyProtected && patch.status && patch.status !== currentAri.status;
    });

    if (protectedHits.length > 0) {
      setConfirmModal({
        title: 'Protected Booking / Maintenance Date Warning',
        message: `You are about to change ${protectedHits.length} protected night(s) (${protectedHits.slice(0, 4).join(', ')}${protectedHits.length > 4 ? '...' : ''}) that are currently marked as Booked or Under Maintenance to "${patch.status.toUpperCase()}". Reopening booked dates can cause double-bookings.`,
        confirmText: `Yes, Overwrite ${protectedHits.length} Night(s)`,
        onConfirm: () => {
          executeSafeDateUpdate(propId, dates, patch, label);
          setConfirmModal(null);
        },
      });
      return;
    }

    executeSafeDateUpdate(propId, dates, patch, label);
  };

  // Handle clicking a day on the calendar based on active Click Mode
  const handleDateClick = (iso, e) => {
    const propName = store.properties[selectedProperty]?.name || selectedProperty;

    if (clickMode === 'paint-open') {
      requestDateUpdateWithProtection(
        selectedProperty,
        [iso],
        { status: 'open' },
        `Opened ${iso} (${propName})`
      );
      return;
    }

    if (clickMode === 'paint-closed') {
      requestDateUpdateWithProtection(
        selectedProperty,
        [iso],
        { status: 'closed' },
        `Closed ${iso} (${propName})`
      );
      return;
    }

    if (clickMode === 'paint-price') {
      const numericPrice = Number(quickPaintPrice);
      if (!numericPrice || numericPrice < 50) {
        showNotification('Enter a valid nightly price (minimum €50).', 'error');
        return;
      }
      executeSafeDateUpdate(
        selectedProperty,
        [iso],
        { price: numericPrice },
        `Set ${iso} to €${numericPrice} (${propName})`
      );
      return;
    }

    // Standard Select / Shift-Range Mode
    if (e?.shiftKey && selectedDates.length > 0) {
      const anchor = selectedDates[selectedDates.length - 1];
      const start = anchor < iso ? anchor : iso;
      const end = anchor < iso ? iso : anchor;
      const range = getDateRangeArray(start, end);
      setSelectedDates(range);
      setRangeStart(start);
      setRangeEnd(end);
      return;
    }

    setSelectedDates((prev) =>
      prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]
    );
    const dayAri = getDayAri(store, selectedProperty, iso);
    setEditStatus(dayAri.status);
    setEditPrice(String(dayAri.price));
    setEditMinStay(String(dayAri.minStay));
    setEditCta(Boolean(dayAri.cta));
    setEditCtd(Boolean(dayAri.ctd));
    setEditNote(dayAri.note || '');
  };

  const handleSelectDateRange = () => {
    if (!rangeStart || !rangeEnd) {
      showNotification('Choose both a From and To date first.', 'error');
      return;
    }
    if (rangeStart > rangeEnd) {
      showNotification('From date must be before To date.', 'error');
      return;
    }
    const range = getDateRangeArray(rangeStart, rangeEnd);
    setSelectedDates(range);
    showNotification(`Selected ${range.length} night(s).`);
  };

  const handleApplyAriChanges = () => {
    if (selectedDates.length === 0) {
      showNotification('Select at least 1 night on the calendar first.', 'error');
      return;
    }

    const numericPrice = editPrice !== '' ? Number(editPrice) : undefined;
    const numericMinStay = editMinStay !== '' ? Number(editMinStay) : undefined;

    if (numericPrice !== undefined && (isNaN(numericPrice) || numericPrice < 50)) {
      showNotification('Nightly price must be at least €50.', 'error');
      return;
    }
    if (
      numericMinStay !== undefined &&
      (isNaN(numericMinStay) || numericMinStay < 1 || numericMinStay > 60)
    ) {
      showNotification('Minimum stay must be between 1 and 60 nights.', 'error');
      return;
    }

    const propName = store.properties[selectedProperty]?.name;
    requestDateUpdateWithProtection(
      selectedProperty,
      selectedDates,
      {
        status: editStatus,
        price: numericPrice,
        minStay: numericMinStay,
        cta: editCta,
        ctd: editCtd,
        note: editNote.trim(),
      },
      `Updated ${selectedDates.length} night(s) on ${propName}`
    );
  };

  const handleQuickStatusForSelection = (statusValue) => {
    if (selectedDates.length === 0) {
      showNotification('Select at least 1 day on the calendar first.', 'error');
      return;
    }
    const propName = store.properties[selectedProperty]?.name;
    requestDateUpdateWithProtection(
      selectedProperty,
      selectedDates,
      { status: statusValue },
      `Marked ${selectedDates.length} night(s) as ${statusValue.toUpperCase()} on ${propName}`
    );
    setEditStatus(statusValue);
  };

  // ==========================================================================
  // 5. EXPLICIT SAVE / CANCEL FLOW FOR PROPERTY & CHANNEL SETTINGS
  // ==========================================================================
  const handleSavePropertyDefaults = (e) => {
    e.preventDefault();
    const baseRate = Number(settingsDraft.baseRate);
    const minStay = Number(settingsDraft.minStay);
    const otaMarkupPercent = Number(settingsDraft.otaMarkupPercent);

    if (isNaN(baseRate) || baseRate < 50 || baseRate > 10000) {
      showNotification('Base price must be between €50 and €10,000.', 'error');
      return;
    }
    if (isNaN(minStay) || minStay < 1 || minStay > 30) {
      showNotification('Minimum stay must be between 1 and 30 nights.', 'error');
      return;
    }
    if (isNaN(otaMarkupPercent) || otaMarkupPercent < 0 || otaMarkupPercent > 100) {
      showNotification('OTA Markup must be between 0% and 100%.', 'error');
      return;
    }

    pushUndoSnapshot(`Changed default settings for ${store.properties[selectedProperty].name}`);
    const next = JSON.parse(JSON.stringify(store));
    next.properties[selectedProperty].baseRate = baseRate;
    next.properties[selectedProperty].minStay = minStay;
    next.properties[selectedProperty].otaMarkupPercent = otaMarkupPercent;
    next.auditLogs = [
      {
        id: `cfg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: actorName,
        action: 'PROPERTY_DEFAULTS_SAVED',
        details: `${next.properties[selectedProperty].name}: Base €${baseRate}, MinStay ${minStay}n, OTA +${otaMarkupPercent}%`,
      },
      ...(next.auditLogs || []).slice(0, 99),
    ];

    saveAriStore(next);
    setStore(next);
    setSettingsDirty(false);
    showNotification(`Saved default settings for ${next.properties[selectedProperty].name}.`);
  };

  const handleResetPropertyDefaults = () => {
    const prop = store.properties[selectedProperty];
    setSettingsDraft({
      baseRate: prop.baseRate,
      minStay: prop.minStay,
      otaMarkupPercent: prop.otaMarkupPercent,
    });
    setSettingsDirty(false);
  };

  const handleSaveChannelConfig = (e) => {
    e.preventDefault();
    const next = JSON.parse(JSON.stringify(store));
    next.gateway.provider = channelDraft.provider;
    next.gateway.endpointUrl = channelDraft.endpointUrl.trim();
    // Never store raw API keys in browser localStorage
    delete next.gateway.apiKey;

    next.properties[selectedProperty].channels.bookingCom.hotelId =
      channelDraft.bookingHotelId.trim();
    next.properties[selectedProperty].channels.bookingCom.roomId =
      channelDraft.bookingRoomId.trim();
    next.properties[selectedProperty].channels.bookingCom.ratePlanId =
      channelDraft.bookingRatePlanId.trim();
    next.properties[selectedProperty].channels.bookingCom.icalImportUrl =
      channelDraft.bookingIcalImportUrl.trim();
    next.properties[selectedProperty].channels.bookingCom.enabled = true;

    next.properties[selectedProperty].channels.airbnb.listingId =
      channelDraft.airbnbListingId.trim();
    next.properties[selectedProperty].channels.airbnb.icalImportUrl =
      channelDraft.airbnbIcalImportUrl.trim();
    next.properties[selectedProperty].channels.airbnb.enabled = true;

    next.auditLogs = [
      {
        id: `ch-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: actorName,
        action: 'CHANNEL_MAPPING_SAVED',
        details: `Updated channel & iCal mappings for ${next.properties[selectedProperty].name} (${channelDraft.provider})`,
      },
      ...(next.auditLogs || []).slice(0, 99),
    ];

    saveAriStore(next);
    setStore(next);
    setChannelDirty(false);
    showNotification('Channel mappings & iCal Import URLs saved to Supabase Cloud.');
  };

  // ==========================================================================
  // 6. TRUTHFUL CHANNEL SYNC WITH CRON-JOB.ORG & SUPABASE CLOUD
  // ==========================================================================
  const handleManualSync = async (scope = 'all') => {
    setSyncing(true);
    setSyncError(null);
    try {
      // 1. Trigger serverless iCal pull (/api/sync-ical) if deployed
      await fetch('/api/sync-ical?key=s7-tinos-cron-2027').catch(() => {});

      // 2. Push ARI & update timestamps
      const { networkResult, store: nextStore } = await pushChannelManagerAri(scope);

      // 3. Pull merged cloud state
      const cloudStore =
        typeof syncAriStoreFromCloud === 'function'
          ? await syncAriStoreFromCloud()
          : null;
      setStore({ ...(cloudStore || nextStore) });

      if (!networkResult.ok) {
        const errMsg =
          networkResult.error || `Gateway returned HTTP ${networkResult.status || 500}`;
        setSyncError(errMsg);
        setLastSyncReport({
          timestamp: new Date().toISOString(),
          scope,
          ok: false,
          mode: networkResult.simulated ? 'Cloud iCal Mode' : 'Live Webhook',
          error: errMsg,
        });
        showNotification(`Channel sync failed: ${errMsg}`, 'error');
      } else {
        setLastSyncReport({
          timestamp: new Date().toISOString(),
          scope,
          ok: true,
          mode: networkResult.simulated
            ? 'Supabase Cloud & iCal Feeds Synced'
            : 'Live ARI Webhook Pushed',
          error: null,
        });
        showNotification(
          networkResult.simulated
            ? 'Synced website availability & iCal feeds with Supabase Cloud!'
            : 'Synced all rates & availability with Channel Manager!'
        );
      }
    } catch (err) {
      const msg = err?.message || 'Unexpected sync error';
      setSyncError(msg);
      showNotification(`Sync failed: ${msg}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleDownloadIcal = (pid) => {
    const icsContent = generatePropertyIcal(pid);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pid}-availability.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(`Downloaded iCal (.ics) file for ${store.properties[pid].name}.`);
  };

  // ==========================================================================
  // 7. SEPARATED MONTHLY KPI METRICS (Available Rate vs Booked vs Closed)
  // ==========================================================================
  const monthlyStats = useMemo(() => {
    const validCells = calendarDays.filter(Boolean);
    if (!validCells.length) {
      return {
        openNights: 0,
        bookedNights: 0,
        ownerClosedNights: 0,
        maintenanceNights: 0,
        avgAvailableRate: 0,
      };
    }

    const openCells = validCells.filter((c) => c.ari.status === 'open');
    const bookedCells = validCells.filter(
      (c) => c.ari.status === 'booked-direct' || c.ari.status === 'booked-ota'
    );
    const ownerClosedCells = validCells.filter((c) => c.ari.status === 'closed');
    const maintenanceCells = validCells.filter((c) => c.ari.status === 'maintenance');

    const avgAvailableRate =
      openCells.length > 0
        ? Math.round(openCells.reduce((acc, c) => acc + c.ari.price, 0) / openCells.length)
        : store.properties[selectedProperty]?.baseRate || 0;

    return {
      openNights: openCells.length,
      bookedNights: bookedCells.length,
      ownerClosedNights: ownerClosedCells.length,
      maintenanceNights: maintenanceCells.length,
      avgAvailableRate,
    };
  }, [calendarDays, selectedProperty, store.properties]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-slate-500 tracking-wider uppercase">
        Verifying Secure Session...
      </div>
    );
  }

  // ==========================================================================
  // RENDER 1: SECURE SUPABASE SIGN-IN (WITH 1-HOUR TIMEOUT & REMEMBER ME)
  // ==========================================================================
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/40 text-slate-900 flex flex-col justify-between p-6 md:p-12">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              S7
            </div>
            <span className="font-semibold text-sm tracking-wide text-slate-800">
              VacatiON Tinos · Channel &amp; Reservation Administration
            </span>
          </div>
          <button
            onClick={() => {
              window.history.pushState(null, '', '/');
              if (setView) setView('home');
            }}
            className="rounded-full px-5 py-2 bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-xs cursor-pointer"
          >
            ← Back to Public Website
          </button>
        </div>

        <div className="max-w-md w-full mx-auto my-12 bg-white rounded-2xl border border-slate-200/90 p-8 md:p-10 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6">
            <Shield size={24} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Administrator Sign In
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Authenticate with your authorized Supabase account. Sessions automatically time out after 1 hour unless Remember Me is enabled.
          </p>

          {loginError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5"
            >
              <AlertTriangle size={16} className="shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="s7-admin-email"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Authorized Email
              </label>
              <input
                id="s7-admin-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                autoComplete="username"
                placeholder="name@vacationofficial.com"
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="s7-admin-password"
                className="block text-xs font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="s7-admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 pr-11 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox (Controlled by Admin Policy) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <label
                className={`flex items-start gap-2.5 text-xs ${
                  allowRememberMePolicy
                    ? 'text-slate-700 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={!allowRememberMePolicy}
                  checked={allowRememberMePolicy && rememberMeChecked}
                  onChange={(e) => setRememberMeChecked(e.target.checked)}
                  className="mt-0.5 rounded accent-emerald-600"
                />
                <div>
                  <span className="font-semibold block">
                    Remember Me (Stay signed in for 7 days)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {allowRememberMePolicy
                      ? 'Leave unchecked for strict 1-hour automatic session timeout.'
                      : 'Disabled by Admin: Strict 1-hour session timeout is enforced.'}
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || Date.now() < lockoutUntil}
              className="w-full rounded-full bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-sm py-3.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-400">
          Protected by Supabase Authentication · 1-Hour Session Guard &amp; Rate-Limiting Active
        </div>
      </div>
    );
  }

  const activeProp = store.properties[selectedProperty];
  const liveExportIcalUrl = `${window.location.origin}/api/ical?property=${selectedProperty}`;
  const cronTargetUrl = `${window.location.origin}/api/sync-ical?key=s7-tinos-cron-2027`;

  // ==========================================================================
  // RENDER 2: AUTHENTICATED CHANNEL MANAGER & INVENTORY PORTAL
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body pb-20">
      {/* Protected Date Overwrite Confirmation Modal */}
      {confirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl">
            <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 mb-6">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="rounded-full px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="rounded-full px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-medium transition-all ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-emerald-600 text-white border-emerald-700'
          }`}
        >
          <CheckCircle2 size={18} />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shadow-xs">
              S7
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 leading-tight">
                VacatiON Channel &amp; Rate Console
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>
                  Signed in as <strong className="text-emerald-700">{session.user.email}</strong>
                </span>
                <span>·</span>
                <span
                  className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-full ${
                    isExtendedSession
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : remainingSeconds < 300
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <Clock size={11} />
                  <span>
                    {isExtendedSession
                      ? `Remembered (${formatSessionCountdown(remainingSeconds)})`
                      : `1h Timeout: ${formatSessionCountdown(remainingSeconds)}`}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full overflow-x-auto">
            {[
              { id: 'calendar', label: 'Calendar & Rates', icon: CalendarIcon },
              { id: 'matrix', label: 'All 3 Villas Matrix', icon: Layers },
              { id: 'channels', label: 'Channels & iCal', icon: Link2 },
              { id: 'history', label: 'Sync & Audit Log', icon: History },
              { id: 'security', label: 'Account Security', icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-emerald-600' : ''} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Global Actions: Undo, Sync, Live Site, Logout */}
          <div className="flex items-center gap-2">
            {undoStack.length > 0 && (
              <button
                type="button"
                onClick={handleUndoLastAction}
                title={`Undo: ${undoStack[0].description}`}
                className="rounded-full px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Undo ({undoStack.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleManualSync('all')}
              disabled={syncing}
              className="rounded-full px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Syncing...' : 'Sync Channels'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                window.history.pushState(null, '', '/');
                if (setView) setView('home');
              }}
              className="rounded-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Public Site</span>
              <ArrowUpRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => handleLogout()}
              className="rounded-full p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1560px] mx-auto px-4 sm:px-8 pt-6">
        {/* Sync Error / Status Banner */}
        {syncError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-300 flex flex-wrap items-center justify-between gap-4 text-xs text-rose-900"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={18} className="text-rose-600 shrink-0" />
              <span>
                <strong>Channel Synchronization Failed:</strong> {syncError}. Local availability changes are saved, but remote channels were not updated.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleManualSync('all')}
              className="rounded-full px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer"
            >
              Retry Sync Now
            </button>
          </div>
        )}

        {/* Property Selector Cards with Truthful Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.values(store.properties).map((prop) => {
            const isSelected = prop.id === selectedProperty;
            const connState = getPropertyConnectionState(prop, syncError);
            const lastSyncIso = prop.channels?.bookingCom?.lastSync;

            return (
              <button
                key={prop.id}
                type="button"
                onClick={() => {
                  setSelectedProperty(prop.id);
                  setSelectedDates([]);
                }}
                className={`text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white border-emerald-500 shadow-md ring-4 ring-emerald-500/10'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${connState.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${connState.dotClass}`} />
                      {connState.label}
                    </span>
                    <span className="text-xs text-slate-400">{prop.location}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{prop.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Base: <strong className="text-slate-800">{euroFormatter.format(prop.baseRate)}</strong> · Min Stay: <strong className="text-slate-800">{prop.minStay}n</strong> · OTA: <strong className="text-slate-800">+{prop.otaMarkupPercent}%</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lastSyncIso
                      ? `Last synced: ${new Date(lastSyncIso).toLocaleString('en-GB', { timeZone: 'Europe/Athens' })}`
                      : 'Not yet synced with external OTA'}
                  </p>
                </div>

                <div
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isSelected ? 'Active' : 'Manage'}
                </div>
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: CALENDAR & NIGHTLY RATES                                   */}
        {/* ================================================================= */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Monthly Calendar Grid / Mobile List */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
              {/* Click Mode & View Switcher Toolbar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MousePointerClick size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Action Mode:
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setClickMode('select')}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        clickMode === 'select'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      👆 Select Dates
                    </button>

                    <button
                      type="button"
                      onClick={() => setClickMode('paint-open')}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        clickMode === 'paint-open'
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                          : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      🟢 Paint Open
                    </button>

                    <button
                      type="button"
                      onClick={() => setClickMode('paint-closed')}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        clickMode === 'paint-closed'
                          ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
                          : 'bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      🔴 Paint Closed
                    </button>

                    <div className="flex items-center bg-amber-50 border border-amber-200 rounded-full p-1 pl-3">
                      <button
                        type="button"
                        onClick={() => setClickMode('paint-price')}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                          clickMode === 'paint-price'
                            ? 'bg-amber-500 text-white'
                            : 'text-amber-900'
                        }`}
                      >
                        💶 Paint Price: €
                      </button>
                      <input
                        type="number"
                        min="50"
                        aria-label="Quick paint price in Euros"
                        value={quickPaintPrice}
                        onChange={(e) => {
                          setQuickPaintPrice(e.target.value);
                          setClickMode('paint-price');
                        }}
                        className="w-16 bg-white rounded-full px-2.5 py-1 text-xs font-bold text-slate-900 border border-amber-300 focus:outline-none ml-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Month Navigation & Grid/List View Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {currentMonth.toLocaleString('en-GB', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeProp.name} · Protected bookings ask for confirmation before changes
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Grid vs Mobile List Toggle */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-full mr-2">
                    <button
                      type="button"
                      onClick={() => setCalendarViewMode('grid')}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                        calendarViewMode === 'grid'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      <Grid size={13} />
                      <span>Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarViewMode('list')}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                        calendarViewMode === 'list'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600'
                      }`}
                    >
                      <List size={13} />
                      <span>List</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1,
                          1
                        )
                      )
                    }
                    className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                      )
                    }
                    className="rounded-full px-4 py-2 border border-slate-200 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                  >
                    Current Month
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                          1
                        )
                      )
                    }
                    className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Separated, Accurate Monthly KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-semibold text-emerald-700 block">
                    Open Nights
                  </span>
                  <span className="text-xl font-bold text-emerald-950">
                    {monthlyStats.openNights}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[11px] font-semibold text-blue-700 block">
                    Booked (Guest/OTA)
                  </span>
                  <span className="text-xl font-bold text-blue-950">
                    {monthlyStats.bookedNights}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-[11px] font-semibold text-rose-700 block">
                    Owner Closed
                  </span>
                  <span className="text-xl font-bold text-rose-950">
                    {monthlyStats.ownerClosedNights}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-[11px] font-semibold text-purple-700 block">
                    Maintenance
                  </span>
                  <span className="text-xl font-bold text-purple-950">
                    {monthlyStats.maintenanceNights}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Avg Available Rate
                  </span>
                  <span className="text-xl font-bold text-slate-900">
                    {euroFormatter.format(monthlyStats.avgAvailableRate)}
                  </span>
                </div>
              </div>

              {/* VIEW A: DESKTOP / TABLET MONTHLY GRID */}
              {calendarViewMode === 'grid' ? (
                <>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {WEEKDAYS.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-bold text-slate-400 uppercase py-1"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((cell, idx) => {
                      if (!cell) {
                        return (
                          <div
                            key={`empty-${idx}`}
                            className="aspect-square rounded-xl bg-slate-50 border border-slate-100"
                          />
                        );
                      }

                      const { iso, dayNumber, ari } = cell;
                      const isSelected = selectedDates.includes(iso);
                      const style =
                        BRIGHT_STATUS_STYLES[ari.status] || BRIGHT_STATUS_STYLES.open;

                      return (
                        <button
                          key={iso}
                          type="button"
                          aria-pressed={isSelected}
                          aria-label={`${iso}, ${style.label}, Direct rate ${ari.price} Euros, Minimum stay ${ari.minStay} nights`}
                          onClick={(e) => handleDateClick(iso, e)}
                          className={`relative min-h-[92px] p-2.5 rounded-xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                            style.cardBg
                          } ${
                            isSelected
                              ? 'ring-4 ring-slate-900 border-slate-900 scale-[0.98] z-10'
                              : ''
                          }`}
                        >
                          <div className="flex items-center justify-between w-full gap-1">
                            <span className="text-xs sm:text-sm font-bold">
                              {dayNumber}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${style.badgeBg}`}
                            >
                              {style.shortLabel}
                            </span>
                          </div>

                          <div className="my-1">
                            <p
                              className={`text-sm sm:text-base font-extrabold leading-none ${
                                !ari.isAvailable ? 'line-through opacity-55' : ''
                              }`}
                            >
                              {euroFormatter.format(ari.price)}
                            </p>
                            {ari.note && (
                              <p className="text-[9px] font-semibold truncate mt-0.5 opacity-80">
                                {ari.note}
                              </p>
                            )}
                          </div>

                          <div className="text-[9px] font-semibold opacity-70 border-t border-black/10 pt-1 flex justify-between w-full">
                            <span>{ari.minStay}n min</span>
                            {(ari.cta || ari.ctd) ? (
                              <span className="font-bold text-rose-700">
                                {ari.cta ? 'CTA ' : ''}
                                {ari.ctd ? 'CTD' : ''}
                              </span>
                            ) : (
                              <span className="hidden sm:inline">OTA €{ari.otaPrice}</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* VIEW B: MOBILE-FRIENDLY SCROLLABLE LIST VIEW */
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl max-h-[540px] overflow-y-auto">
                  {calendarDays.filter(Boolean).map(({ iso, dateObj, ari }) => {
                    const isSelected = selectedDates.includes(iso);
                    const style =
                      BRIGHT_STATUS_STYLES[ari.status] || BRIGHT_STATUS_STYLES.open;
                    return (
                      <div
                        key={iso}
                        onClick={(e) => handleDateClick(iso, e)}
                        className={`p-3.5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${style.badgeBg}`}
                          >
                            {style.shortLabel}
                          </span>
                          <div>
                            <p className="text-sm font-bold">
                              {dateObj.toLocaleDateString('en-GB', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                              })}
                            </p>
                            <p
                              className={`text-xs ${
                                isSelected ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              Min stay {ari.minStay}n · OTA {euroFormatter.format(ari.otaPrice)}
                              {ari.note ? ` · ${ari.note}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-extrabold">
                            {euroFormatter.format(ari.price)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Legend & Selection Helpers */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-200 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  {Object.entries(BRIGHT_STATUS_STYLES).map(([key, item]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.badgeBg}`}
                      >
                        {item.shortLabel}
                      </span>
                      <span className="font-medium text-slate-600">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedDates(calendarDays.filter(Boolean).map((c) => c.iso))
                    }
                    className="font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Select All Days in Month
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDates([])}
                    className="font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Clear ({selectedDates.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Inspector + Date Range + Explicit Save Defaults */}
            <div className="lg:col-span-4 space-y-6">
              {/* Selected Nights Inspector */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Selected Nights ({selectedDates.length})
                  </h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {activeProp.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => handleQuickStatusForSelection('open')}
                    className="rounded-xl py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Unlock size={14} />
                    <span>Set Open</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickStatusForSelection('closed')}
                    className="rounded-xl py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Lock size={14} />
                    <span>Set Owner Closed</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Availability &amp; Booking Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                    >
                      <option value="open">OPEN — Available to Book</option>
                      <option value="closed">CLOSED — Owner Blocked</option>
                      <option value="booked-direct">DIRECT — Booked by Direct Guest</option>
                      <option value="booked-ota">OTA — Booked on Booking.com / Airbnb</option>
                      <option value="maintenance">MAINT — Maintenance Hold</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Direct Price (€)
                      </label>
                      <div className="relative">
                        <Euro
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="number"
                          min="50"
                          step="5"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          placeholder={String(activeProp.baseRate)}
                          className="w-full rounded-xl bg-slate-50 border border-slate-300 pl-9 pr-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Min Stay (Nights)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={editMinStay}
                        onChange={(e) => setEditMinStay(e.target.value)}
                        placeholder={String(activeProp.minStay)}
                        className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  {/* Arrival & Departure Rules (CTA / CTD) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editCta}
                        onChange={(e) => setEditCta(e.target.checked)}
                        className="rounded accent-slate-900"
                      />
                      <span>Closed to Arrival (CTA)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editCtd}
                        onChange={(e) => setEditCtd(e.target.checked)}
                        className="rounded accent-slate-900"
                      />
                      <span>Closed to Departure (CTD)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Guest Name / Booking Reference Note
                    </label>
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="e.g. #VAC-482910 · Maria K."
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyAriChanges}
                    className="w-full rounded-full py-3.5 bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Apply to {selectedDates.length} Selected Night(s) →
                  </button>
                </div>
              </div>

              {/* Date Range Selector */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Select Date Range
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      To
                    </label>
                    <input
                      type="date"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSelectDateRange}
                  className="w-full rounded-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Highlight Date Range
                </button>
              </div>

              {/* Property Default Pricing with Explicit Save & Cancel Controls */}
              <form
                onSubmit={handleSavePropertyDefaults}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Default Rate Rules — {activeProp.name}
                  </h3>
                  {settingsDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Unsaved Changes
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Review and save base defaults for uncustomized dates.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Base Price (€)
                    </label>
                    <input
                      type="number"
                      min="50"
                      required
                      value={settingsDraft.baseRate}
                      onChange={(e) => {
                        setSettingsDraft((prev) => ({ ...prev, baseRate: e.target.value }));
                        setSettingsDirty(true);
                      }}
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Min Nights
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={settingsDraft.minStay}
                      onChange={(e) => {
                        setSettingsDraft((prev) => ({ ...prev, minStay: e.target.value }));
                        setSettingsDirty(true);
                      }}
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      OTA Markup %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={settingsDraft.otaMarkupPercent}
                      onChange={(e) => {
                        setSettingsDraft((prev) => ({
                          ...prev,
                          otaMarkupPercent: e.target.value,
                        }));
                        setSettingsDirty(true);
                      }}
                      className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!settingsDirty}
                    className="flex-1 rounded-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Save Defaults</span>
                  </button>
                  {settingsDirty && (
                    <button
                      type="button"
                      onClick={handleResetPropertyDefaults}
                      className="rounded-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                    >
                      <X size={14} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: ALL 3 VILLAS MATRIX (WITH PROTECTED BOOKING SAFEGUARD)     */}
        {/* ================================================================= */}
        {activeTab === 'matrix' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs overflow-x-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  All 3 Sanctuaries Matrix —{' '}
                  {currentMonth.toLocaleString('en-GB', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h2>
                <p className="text-xs text-slate-500">
                  Open and Owner-Closed dates toggle immediately. Booked (Direct/OTA) and Maintenance dates are protected against accidental reopening.
                </p>
              </div>
            </div>

            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-4 text-left min-w-[210px] font-bold">
                    Sanctuary
                  </th>
                  {calendarDays.filter(Boolean).map((c) => (
                    <th
                      key={c.iso}
                      className="py-3 px-1.5 text-center min-w-[56px] font-bold"
                    >
                      {c.dayNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.values(store.properties).map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {prop.name}
                      <span className="block text-[11px] font-normal text-slate-400">
                        Base {euroFormatter.format(prop.baseRate)}/n
                      </span>
                    </td>
                    {calendarDays.filter(Boolean).map((c) => {
                      const ari = getDayAri(store, prop.id, c.iso);
                      const style =
                        BRIGHT_STATUS_STYLES[ari.status] || BRIGHT_STATUS_STYLES.open;

                      return (
                        <td key={`${prop.id}-${c.iso}`} className="p-1">
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus = ari.isAvailable ? 'closed' : 'open';
                              requestDateUpdateWithProtection(
                                prop.id,
                                [c.iso],
                                { status: nextStatus },
                                `${prop.name}: Set ${c.iso} to ${nextStatus.toUpperCase()}`
                              );
                            }}
                            className={`w-full py-2 px-1 rounded-lg text-center font-bold border transition-all cursor-pointer flex flex-col items-center ${style.cardBg}`}
                          >
                            <span className="text-[9px] uppercase opacity-75">
                              {style.shortLabel}
                            </span>
                            <span className={!ari.isAvailable ? 'line-through' : ''}>
                              €{ari.price}
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CHANNELS, ICAL & CONSOLE.CRON-JOB.ORG 2-MINUTE SYNC        */}
        {/* ================================================================= */}
        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Channel Status &amp; iCal Feeds — {activeProp.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect per-channel synchronization status, copy live `.ics` feeds for Booking.com &amp; Airbnb, or configure 2-minute auto-sync via <code>console.cron-job.org</code>.
                </p>
              </div>

              {/* Per-Channel Truthful Status Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-3 px-4 font-bold">Channel</th>
                      <th className="py-3 px-4 font-bold">External Listing / Room ID</th>
                      <th className="py-3 px-4 font-bold">Mode &amp; Status</th>
                      <th className="py-3 px-4 font-bold">Last Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Booking.com
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        Hotel #{activeProp.channels.bookingCom.hotelId} ·{' '}
                        {activeProp.channels.bookingCom.roomId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {activeProp.channels.bookingCom.icalImportUrl
                            ? '2-Way iCal Active'
                            : 'iCal + ARI Ready'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {activeProp.channels.bookingCom.lastSync
                          ? new Date(
                              activeProp.channels.bookingCom.lastSync
                            ).toLocaleString('en-GB')
                          : 'Never synced'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-slate-900">Airbnb</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {activeProp.channels.airbnb.listingId || 'Not mapped'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {activeProp.channels.airbnb.icalImportUrl
                            ? '2-Way iCal Active'
                            : 'iCal Export Ready'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {activeProp.channels.airbnb.lastSync
                          ? new Date(activeProp.channels.airbnb.lastSync).toLocaleString(
                              'en-GB'
                            )
                          : 'Never synced'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Export iCal Box (With Live Feed URL Copy + .ics Download) */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      1. Export Availability Calendar (.ics) — {activeProp.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Paste this live URL into Booking.com &amp; Airbnb &ldquo;Import Calendar&rdquo;, or download the `.ics` file manually.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadIcal(selectedProperty)}
                    className="rounded-full px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download .ics File</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={liveExportIcalUrl}
                    className="flex-1 rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-xs font-mono text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(liveExportIcalUrl);
                      showNotification('Copied Live Export iCal URL!');
                    }}
                    className="rounded-xl px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Copy URL</span>
                  </button>
                </div>
              </div>

              {/* console.cron-job.org 2-Minute Sync Box */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                    console.cron-job.org · 2-Minute Auto-Sync
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Last Cron Heartbeat:{' '}
                    {store?.gateway?.lastCronRun
                      ? new Date(store.gateway.lastCronRun).toLocaleString('en-GB')
                      : 'Awaiting first ping'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Paste the URL below into{' '}
                  <a
                    href="https://console.cron-job.org/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 underline font-semibold"
                  >
                    console.cron-job.org/dashboard
                  </a>{' '}
                  and set the schedule to <strong>Every 2 minutes</strong>. It will automatically pull the Booking.com &amp; Airbnb `.ics` URLs saved on the right.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={cronTargetUrl}
                    className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs font-mono text-emerald-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(cronTargetUrl);
                      showNotification('Copied cron-job.org Target URL!');
                    }}
                    className="rounded-xl px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Copy Cron URL</span>
                  </button>
                </div>
              </div>

              {/* Import External iCal Box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
                  <Upload size={15} className="text-emerald-600" />
                  <span>Manual Booking.com / Airbnb Calendar Text Import (.ics)</span>
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Paste `.ics` calendar text below to immediately mark matching dates as Booked (OTA) on {activeProp.name}.
                </p>
                <textarea
                  rows="4"
                  value={icalImportText}
                  onChange={(e) => setIcalImportText(e.target.value)}
                  placeholder="Paste BEGIN:VCALENDAR content here..."
                  className="w-full rounded-xl bg-white border border-slate-300 p-3 text-xs text-slate-800 mb-3 focus:outline-none focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!icalImportText.includes('BEGIN:VCALENDAR')) {
                      showNotification(
                        'Invalid .ics format. Must contain BEGIN:VCALENDAR.',
                        'error'
                      );
                      return;
                    }
                    pushUndoSnapshot(`iCal import on ${activeProp.name}`);
                    const count = importPropertyIcal(
                      selectedProperty,
                      icalImportText
                    );
                    setStore({ ...loadAriStore() });
                    setIcalImportText('');
                    showNotification(`Imported and blocked ${count} OTA booked night(s)!`);
                  }}
                  className="rounded-full px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Validate &amp; Import Dates
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Explicit Save/Cancel Channel Mapping & iCal Import Links */}
            <form
              onSubmit={handleSaveChannelConfig}
              className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 self-start"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Channel &amp; iCal Mapping — {activeProp.name}
                </h3>
                {channelDirty && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Unsaved
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Channel Manager Provider
                </label>
                <select
                  value={channelDraft.provider}
                  onChange={(e) => {
                    setChannelDraft((prev) => ({ ...prev, provider: e.target.value }));
                    setChannelDirty(true);
                  }}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                >
                  <option value="channex">Channex.io</option>
                  <option value="beds24">Beds24</option>
                  <option value="rentals-united">Rentals United</option>
                  <option value="hostaway">Hostaway</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Booking.com Hotel ID
                  </label>
                  <input
                    type="text"
                    value={channelDraft.bookingHotelId}
                    onChange={(e) => {
                      setChannelDraft((prev) => ({
                        ...prev,
                        bookingHotelId: e.target.value,
                      }));
                      setChannelDirty(true);
                    }}
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mapped Room ID
                  </label>
                  <input
                    type="text"
                    value={channelDraft.bookingRoomId}
                    onChange={(e) => {
                      setChannelDraft((prev) => ({
                        ...prev,
                        bookingRoomId: e.target.value,
                      }));
                      setChannelDirty(true);
                    }}
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rate Plan ID
                  </label>
                  <input
                    type="text"
                    value={channelDraft.bookingRatePlanId}
                    onChange={(e) => {
                      setChannelDraft((prev) => ({
                        ...prev,
                        bookingRatePlanId: e.target.value,
                      }));
                      setChannelDirty(true);
                    }}
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Airbnb Listing ID
                  </label>
                  <input
                    type="text"
                    value={channelDraft.airbnbListingId}
                    onChange={(e) => {
                      setChannelDraft((prev) => ({
                        ...prev,
                        airbnbListingId: e.target.value,
                      }));
                      setChannelDirty(true);
                    }}
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Booking.com & Airbnb .ics Import URLs for 2-Minute Cron Sync */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Booking.com Import .ics URL (Pulled by cron-job.org)
                  </label>
                  <input
                    type="url"
                    value={channelDraft.bookingIcalImportUrl}
                    onChange={(e) => {
                      setChannelDraft((prev) => ({
                        ...prev,
                        bookingIcalImportUrl: e.target.value,
                      }));
                      setChannelDirty(true);
                    }}
                    placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?t=..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Airbnb Import .ics URL (Pulled by cron-job.org)
                  </label>
                  <input
                    type="url"
                    value={channelDraft.airbnbIcalImportUrl}
                    onChange={(e) => {
                      setChannelDraft((prev) => ({
                        ...prev,
                        airbnbIcalImportUrl: e.target.value,
                      }));
                      setChannelDirty(true);
                    }}
                    placeholder="https://www.airbnb.com/calendar/ical/..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Security Notice for Server-Side API Keys */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <Info size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">
                    Server-Side API Credential Protection
                  </strong>
                  Channel API keys are not stored in browser storage. Configure live OTA API tokens inside your Supabase Edge Function or Vercel Environment Variables.
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!channelDirty}
                  className="flex-1 rounded-full py-3 bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Save Channel &amp; iCal Mappings
                </button>
                {channelDirty && (
                  <button
                    type="button"
                    onClick={() => {
                      const prop = store.properties[selectedProperty];
                      setChannelDraft({
                        provider: store.gateway?.provider || 'channex',
                        endpointUrl: store.gateway?.endpointUrl || '',
                        bookingHotelId: prop.channels?.bookingCom?.hotelId || '',
                        bookingRoomId: prop.channels?.bookingCom?.roomId || '',
                        bookingRatePlanId: prop.channels?.bookingCom?.ratePlanId || '',
                        bookingIcalImportUrl:
                          prop.channels?.bookingCom?.icalImportUrl || '',
                        airbnbListingId: prop.channels?.airbnb?.listingId || '',
                        airbnbIcalImportUrl:
                          prop.channels?.airbnb?.icalImportUrl || '',
                      });
                      setChannelDirty(false);
                    }}
                    className="rounded-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: OPERATIONAL AUDIT LOG & SYNC HISTORY                       */}
        {/* ================================================================= */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Operational Audit &amp; Sync History
                </h2>
                <p className="text-xs text-slate-500">
                  Complete record of who modified rates, availability, or channel settings and when.
                </p>
              </div>
            </div>

            {lastSyncReport && (
              <div
                className={`mb-6 p-4 rounded-xl border text-xs flex items-center justify-between ${
                  lastSyncReport.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <span>
                  <strong>Latest Sync ({lastSyncReport.mode}):</strong>{' '}
                  {lastSyncReport.ok ? 'Succeeded' : lastSyncReport.error}
                </span>
                <span>
                  {new Date(lastSyncReport.timestamp).toLocaleString('en-GB')}
                </span>
              </div>
            )}

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl">
              {(store.auditLogs || []).map((log) => (
                <div
                  key={log.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-800">
                      {log.actor}
                    </span>
                    <span className="font-bold text-emerald-700">{log.action}</span>
                    <span className="text-slate-600">{log.details}</span>
                  </div>
                  <span className="text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleString('en-GB', {
                      timeZone: 'Europe/Athens',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: SUPABASE ACCOUNT SECURITY & 1-HOUR SESSION POLICY          */}
        {/* ================================================================= */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {/* Card 1: 1-Hour Session Timeout & Admin "Remember Me" Permission */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    1-Hour Session Timeout Policy
                  </h2>
                  <p className="text-xs text-slate-500">
                    Control whether logins can stay signed in past 1 hour.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Allow &ldquo;Remember Me&rdquo; (7-Day Extended Sessions)
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    When enabled, users can check &ldquo;Remember Me&rdquo; at sign-in. When disabled, every session strictly logs out after 60 minutes.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowRememberMePolicy}
                  onChange={(e) => handleToggleRememberMePolicy(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer shrink-0"
                />
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                Current Session Remaining:{' '}
                <strong className="font-mono">
                  {formatSessionCountdown(remainingSeconds)}
                </strong>{' '}
                ({isExtendedSession ? '7-Day Remembered Mode' : 'Strict 1-Hour Mode'})
              </div>
            </div>

            {/* Card 2: Update Supabase Password */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Account Security
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Update the Supabase password for <strong>{session.user.email}</strong>. To invite or revoke contributors, use the Supabase Authentication dashboard.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password (minimum 8 characters)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-300 px-4 py-3 text-sm text-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!newPassword || newPassword.length < 8) {
                      showNotification('Password must be at least 8 characters.', 'error');
                      return;
                    }
                    const { error } = await supabase.auth.updateUser({
                      password: newPassword,
                    });
                    if (error) {
                      showNotification(error.message, 'error');
                    } else {
                      setNewPassword('');
                      showNotification('Supabase password updated!');
                    }
                  }}
                  className="rounded-full px-6 py-3 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}