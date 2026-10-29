// src/components/Reservation.jsx
import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar as CalendarIcon,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Baby,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import { PROPERTIES, useLanguage, getLocalizedProperty } from '../data/siteData';
import {
  supabase,
  loadAriStore,
  syncAriStoreFromCloud,
  getDayAri,
  evaluateStayQuote,
  DEFAULT_PROPERTY_CONFIG,
} from '../services/channelManagerStore';
import SmoothImage from './SmoothImage';

const DEFAULT_COUNTRY_PREFIXES = [
  { label: 'Greece (+30)', value: '+30' },
  { label: 'Italy (+39)', value: '+39' },
  { label: 'United Kingdom (+44)', value: '+44' },
  { label: 'Albania (+355)', value: '+355' },
  { label: 'United States (+1)', value: '+1' },
  { label: 'Germany (+49)', value: '+49' },
  { label: 'France (+33)', value: '+33' },
  { label: 'Switzerland (+41)', value: '+41' },
  { label: 'Australia (+61)', value: '+61' },
];

const DEFAULT_WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const OCCASION_COPY = {
  en: {
    label: 'CELEBRATING A BIRTHDAY, HONEYMOON OR ANNIVERSARY? (OPTIONAL)',
    sub: 'Let us know about your special occasion.',
    placeholder:
      'e.g. Birthday for my fiancé, Honeymoon trip, anniversary celebration, or special requests...',
  },
  it: {
    label: 'FESTEGGI UN COMPLEANNO, LUNA DI MIELE O ANNIVERSARIO? (OPZIONALE)',
    sub: 'Facci sapere della tua occasione speciale.',
    placeholder:
      'es. Compleanno per il mio fidanzato/a, viaggio di nozze, anniversario o richieste speciali...',
  },
  el: {
    label: 'ΓΙΟΡΤΑΖΕΤΕ ΓΕΝΕΘΛΙΑ, ΜΗΝΑ ΤΟΥ ΜΕΛΙΤΟΣ Ή ΕΠΕΤΕΙΟ; (ΠΡΟΑΙΡΕΤΙΚΑ)',
    sub: 'Ενημερώστε μας για την ιδιαίτερη περίστασή σας.',
    placeholder:
      'π.χ. Γενέθλια για τον/την αρραβωνιαστικό/ιά μου, ταξίδι του μέλιτος, επέτειος ή ειδικά αιτήματα...',
  },
};

const toIsoDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function Reservation({ setView }) {
  const { lang, t } = useLanguage();
  const [ariStore, setAriStore] = useState(() => loadAriStore());
  const occasionText = OCCASION_COPY[lang] || OCCASION_COPY.en;

  // Check if a property was pre-selected before entering Reservation
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => {
    try {
      const saved = localStorage.getItem('vacation_selected_property');
      return saved && PROPERTIES[saved] ? saved : 'villa-leonora';
    } catch {
      return 'villa-leonora';
    }
  });

  // Step 0: User picks their property at the very beginning (if not locked in yet)
  const [propertyLockedIn, setPropertyLockedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem('vacation_property_locked'));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const syncStore = () => setAriStore(loadAriStore());

    syncAriStoreFromCloud().then((cloudData) => {
      if (cloudData) setAriStore(cloudData);
    });

    window.addEventListener('s7-ari-updated', syncStore);
    window.addEventListener('storage', syncStore);

    const channel = supabase
      .channel('realtime-reservation-calendar')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 's7_ari_store',
          filter: 'id=eq.master',
        },
        (payload) => {
          if (payload?.new?.payload) {
            setAriStore(payload.new.payload);
          }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('s7-ari-updated', syncStore);
      window.removeEventListener('storage', syncStore);
      supabase.removeChannel(channel);
    };
  }, []);

  // Automatically load dates & adults chosen on the front-page Hero date bar
  const defaultDates = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vacation_prefill_dates') || '{}');
      if (saved.checkIn && saved.checkOut) {
        return {
          checkIn: saved.checkIn,
          checkOut: saved.checkOut,
          adults: Number(saved.adults) || 2,
        };
      }
    } catch {
      // Ignore storage errors
    }
    const start = new Date();
    start.setDate(start.getDate() + 14);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return {
      checkIn: toIsoDate(start),
      checkOut: toIsoDate(end),
      adults: 2,
    };
  }, []);

  const [adultsCount, setAdultsCount] = useState(defaultDates.adults);
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);
  const [arrivalTime, setArrivalTime] = useState('14:00 - 16:00');
  const [checkIn, setCheckIn] = useState(defaultDates.checkIn);
  const [checkOut, setCheckOut] = useState(defaultDates.checkOut);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ssn, setSsn] = useState('');
  const [showSsn, setShowSsn] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState('+30');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [previewIdx, setPreviewIdx] = useState(0);

  const selectedRoomObj = useMemo(
    () =>
      (typeof getLocalizedProperty === 'function'
        ? getLocalizedProperty(selectedPropertyId, lang)
        : PROPERTIES[selectedPropertyId]) || PROPERTIES['villa-leonora'],
    [selectedPropertyId, lang]
  );

  const arrivalTimeOptions = useMemo(
    () => [
      '14:00 - 16:00',
      '16:00 - 18:00',
      '18:00 - 20:00',
      '20:00 - 22:00',
      t.reservation?.lateArrival || 'Late Arrival (22:00+)',
    ],
    [t]
  );

  const formatDotDate = (isoStr) => {
    if (!isoStr) return t.reservation?.selectDatePrompt || 'Select Date';
    const [y, m, d] = isoStr.split('-');
    return `${d}.${m}.${y}`;
  };

  const formatAdultsText = (count) =>
    `${count} ${
      count === 1
        ? t.reservation?.adultSingular || 'Adult'
        : t.reservation?.adultsPlural || 'Adults'
    }`;

  const formatChildrenText = (count) => {
    if (count === 0) return t.reservation?.noChildren || 'No Children';
    return `${count} ${
      count === 1
        ? t.reservation?.childSingular || 'Child'
        : t.reservation?.childrenPlural || 'Children'
    }`;
  };

  const formatChildAgeText = (ageVal) => {
    if (ageVal === 0) return t.reservation?.infantUnder1 || 'Infant (< 1 yr)';
    return `${ageVal} ${
      ageVal === 1
        ? t.reservation?.yearOld || 'year old'
        : t.reservation?.yearsOld || 'years old'
    }`;
  };

  const handleChooseInitialProperty = (pid) => {
    setSelectedPropertyId(pid);
    setPreviewIdx(0);
    setPropertyLockedIn(true);
    try {
      localStorage.setItem('vacation_selected_property', pid);
      localStorage.setItem('vacation_property_locked', 'true');
    } catch {
      // ignore storage errors
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChildrenCountChange = (countNumber) => {
    const count = Number(countNumber);
    setChildrenCount(count);
    setChildrenAges((prev) => {
      const next = [...prev];
      while (next.length < count) {
        next.push(5);
      }
      return next.slice(0, count);
    });
  };

  const handleSingleChildAgeChange = (idx, newAge) => {
    setChildrenAges((prev) => {
      const copy = [...prev];
      copy[idx] = Number(newAge);
      return copy;
    });
  };

  const guestSummaryText = useMemo(() => {
    const adultsStr = formatAdultsText(adultsCount);
    if (childrenCount === 0) return adultsStr;
    const agesStr = childrenAges.map((a) => formatChildAgeText(a)).join(', ');
    return `${adultsStr}, ${formatChildrenText(childrenCount)} (${agesStr})`;
  }, [adultsCount, childrenCount, childrenAges, t]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const liveQuote = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    return evaluateStayQuote(selectedPropertyId, checkIn, checkOut);
  }, [selectedPropertyId, checkIn, checkOut, ariStore]);

  const handleDayClick = (dateStr, isClosed) => {
    if (!checkIn || (checkIn && checkOut)) {
      if (isClosed) return;
      setCheckIn(dateStr);
      setCheckOut('');
    } else if (dateStr > checkIn) {
      setCheckOut(dateStr);
      setCalendarOpen(false);
    } else {
      if (isClosed) return;
      setCheckIn(dateStr);
      setCheckOut('');
    }
  };

  const localeMap = { en: 'en-US', it: 'it-IT', el: 'el-GR' };
  const weekDaysList = t.reservation?.weekDays || DEFAULT_WEEKDAYS;
  const countryPrefixesList =
    t.reservation?.countryPrefixes || DEFAULT_COUNTRY_PREFIXES;

  const renderMonth = (monthOffset) => {
    const viewDate = new Date(
      calMonth.getFullYear(),
      calMonth.getMonth() + monthOffset,
      1
    );
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString(localeMap[lang] || 'en-US', {
      month: 'long',
      year: 'numeric',
    });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const todayIso = toIsoDate(new Date());

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="h-11 w-full" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        d
      ).padStart(2, '0')}`;
      const isPast = iso < todayIso;
      const dayAri = getDayAri(ariStore, selectedPropertyId, iso);
      const isClosed = !dayAri.isAvailable;
      const isStart = iso === checkIn;
      const isEnd = iso === checkOut;
      const isInRange =
        checkIn &&
        ((checkOut && iso > checkIn && iso < checkOut) ||
          (!checkOut && hoverDate && iso > checkIn && iso <= hoverDate));

      const isDisabled =
        isPast || (isClosed && (!checkIn || checkOut || iso <= checkIn));

      cells.push(
        <button
          key={iso}
          type="button"
          disabled={isDisabled}
          onMouseEnter={() => setHoverDate(iso)}
          onMouseLeave={() => setHoverDate(null)}
          onClick={() => handleDayClick(iso, isClosed)}
          title={
            isClosed
              ? t.reservation?.unavailableDay || 'Unavailable / Closed'
              : `€${dayAri.price}${t.reservation?.perNight || '/night'} · Min ${
                  dayAri.minStay
                } ${t.reservation?.nights || 'Nights'}`
          }
          className={`h-11 w-full text-xs font-body transition-all flex flex-col items-center justify-center ${
            isPast
              ? 'text-[#191D30]/20 cursor-not-allowed'
              : isClosed && !isEnd
              ? 'bg-rose-50/70 text-rose-300 line-through cursor-not-allowed'
              : isStart || isEnd
              ? 'bg-[#191D30] text-white font-semibold shadow-xs'
              : isInRange
              ? 'bg-[#A18E7E]/25 text-[#191D30]'
              : 'text-[#191D30] hover:bg-[#191D30]/10'
          }`}
        >
          <span className="leading-none">{d}</span>
          {!isPast && !isClosed && (
            <span
              className={`text-[8.5px] leading-none mt-1 ${
                isStart || isEnd ? 'text-[#A18E7E]' : 'text-[#191D30]/50'
              }`}
            >
              €{dayAri.price}
            </span>
          )}
        </button>
      );
    }

    return (
      <div className="flex-1 min-w-[240px]">
        <div className="text-center font-display text-sm tracking-wider text-[#191D30] uppercase mb-4">
          {monthName}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-body text-[#A18E7E] uppercase mb-2">
          {weekDaysList.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">{cells}</div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (liveQuote && !liveQuote.valid) return;
    setIsSubmitting(true);

    const generatedRef = `VAC-${Math.floor(100000 + Math.random() * 900000)}`;
    const formattedChildrenAges =
      childrenCount > 0
        ? childrenAges.map((a) => formatChildAgeText(a)).join(', ')
        : 'None';

    const formData = {
      bookingReference: generatedRef,
      propertyId: selectedPropertyId,
      property: selectedRoomObj.name,
      adults: formatAdultsText(adultsCount),
      childrenCount,
      childrenAges: formattedChildrenAges,
      arrivalTime,
      checkIn,
      checkOut,
      nights,
      estimatedDirectTotal: liveQuote?.valid ? `€${liveQuote.totalDirect}` : 'N/A',
      name,
      email,
      ssnOrIdNumber: ssn,
      phone: `${phonePrefix} ${phone}`,
      specialRequests: specialRequests || 'None',
      language: lang,
    };

    try {
      await supabase.from('reservations').insert([
        {
          booking_ref: generatedRef,
          property_id: selectedPropertyId,
          property_name: selectedRoomObj.name,
          source: 'direct',
          status: 'pending',
          check_in: checkIn,
          check_out: checkOut,
          nights: Number(nights) || 1,
          adults: formatAdultsText(adultsCount),
          children_count: Number(childrenCount) || 0,
          children_ages: formattedChildrenAges,
          arrival_time: arrivalTime,
          total_price: liveQuote?.valid ? Number(liveQuote.totalDirect) : 0,
          currency: 'EUR',
          guest_name: name,
          guest_email: email,
          guest_phone: `${phonePrefix} ${phone}`,
          guest_ssn_or_passport: ssn,
          special_requests: specialRequests || 'None',
        },
      ]);
    } catch {
      // Continues gracefully
    }

    try {
      await fetch('https://formspree.io/f/xrpzvrgd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch {
      // Fallback to confirmation screen
    } finally {
      setBookingRef(generatedRef);
      setSubmitted(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const whatsappUrl = useMemo(() => {
    const priceLine = liveQuote?.valid
      ? `%0A*Direct Rate Total:* €${liveQuote.totalDirect}`
      : '';
    const kidsLine =
      childrenCount > 0
        ? `%0A*Children (${childrenCount}):* ${childrenAges
            .map((a) => formatChildAgeText(a))
            .join(', ')}`
        : '';
    const occasionLine = specialRequests
      ? `%0A*Special Occasion / Notes:* ${specialRequests}`
      : '';
    const text = `Hello VacatiON Tinos! I would like to confirm my reservation request:%0A%0A*Reference:* ${bookingRef}%0A*Sanctuary:* ${selectedRoomObj.name}%0A*Check-In:* ${formatDotDate(
      checkIn
    )}%0A*Check-Out:* ${formatDotDate(
      checkOut
    )} (${nights} nights)${priceLine}%0A*Adults:* ${formatAdultsText(
      adultsCount
    )}${kidsLine}%0A*Arrival:* ${arrivalTime}%0A*Name:* ${name}${occasionLine}`;
    return `https://wa.me/306973952375?text=${text}`;
  }, [
    bookingRef,
    selectedRoomObj,
    checkIn,
    checkOut,
    nights,
    liveQuote,
    adultsCount,
    childrenCount,
    childrenAges,
    arrivalTime,
    name,
    specialRequests,
  ]);

  // =========================================================================
  // STEP 0: CHOOSE YOUR SANCTUARY AT THE VERY BEGINNING (No mid-form dropdown)
  // =========================================================================
  if (!propertyLockedIn) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-28 pb-28 px-4 sm:px-8">
        <div className="max-w-[1280px] mx-auto">
          <button
            onClick={() => setView('home')}
            className="rounded-full px-5 py-2.5 border border-[#191D30]/15 inline-flex items-center gap-2 text-[#191D30]/70 hover:bg-[#191D30] hover:text-white font-body text-[10px] tracking-[0.25em] uppercase mb-10 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} /> {t.reservation?.back}
          </button>

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-body text-[10px] tracking-[0.3em] text-[#A18E7E] uppercase block mb-3">
              STEP 1 OF 2
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-[#191D30] mb-3">
              {t.reservation?.selectResidence || 'Choose Your Tinos Sanctuary'}
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#191D30]/65">
              {t.reservation?.configBadge}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.keys(PROPERTIES).map((pid) => {
              const prop =
                (typeof getLocalizedProperty === 'function'
                  ? getLocalizedProperty(pid, lang)
                  : PROPERTIES[pid]) || PROPERTIES[pid];
              const baseRate =
                ariStore?.properties?.[pid]?.baseRate ||
                DEFAULT_PROPERTY_CONFIG?.[pid]?.baseRate ||
                240;

              return (
                <div
                  key={pid}
                  onClick={() => handleChooseInitialProperty(pid)}
                  className="group bg-white border border-[#191D30]/10 hover:border-[#A18E7E] transition-all duration-500 flex flex-col justify-between cursor-pointer hover:shadow-xl"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#191D30]">
                      <SmoothImage
                        src={prop.coverImage}
                        alt={prop.name}
                        containerClassName="w-full h-full rounded-none"
                        className="w-full h-full object-cover rounded-none transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 text-[#191D30] px-3 py-1 font-display text-xs font-semibold">
                        ★ {prop.rating}
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="font-body text-[9.5px] tracking-[0.2em] text-[#A18E7E] uppercase inline-flex items-center gap-1 mb-1.5">
                        <MapPin size={11} />
                        <span>{prop.location.split('·')[0]}</span>
                      </p>
                      <h2 className="font-display text-2xl text-[#191D30] mb-2">
                        {prop.name}
                      </h2>
                      <p className="font-body font-light text-xs text-[#191D30]/70 line-clamp-2 mb-4">
                        {prop.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#FAF9F6] border-t border-[#191D30]/10 flex items-center justify-between">
                    <div>
                      <span className="font-display text-lg font-semibold text-[#191D30]">
                        €{baseRate}
                      </span>
                      <span className="font-body text-[10px] text-[#191D30]/60 ml-1">
                        {t.reservation?.perNight || '/night'}
                      </span>
                    </div>
                    <span className="rounded-full bg-[#191D30] group-hover:bg-[#A18E7E] text-white px-5 py-2 font-body text-[9.5px] tracking-[0.2em] uppercase inline-flex items-center gap-1.5 transition-colors">
                      <span>{t.nav?.reserve || 'Select'}</span>
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-28 px-4">
        <div className="max-w-xl mx-auto bg-white border border-[#191D30]/10 shadow-xl p-8 md:p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#191D30] text-[#A18E7E] flex items-center justify-center mx-auto mb-6">
            <Check size={24} />
          </div>

          <span className="font-body text-[10px] tracking-[0.25em] text-[#A18E7E] uppercase block mb-2">
            {t.reservation?.registeredBadge || 'Reservation Registered'} · #{bookingRef}
          </span>

          <h1 className="font-display text-2xl md:text-3xl text-[#191D30] uppercase tracking-wider mb-4">
            {t.reservation?.thankYouTitle || 'Thank You'}, {name}
          </h1>

          <p className="font-body font-light text-xs md:text-sm text-[#191D30]/70 leading-relaxed mb-8">
            {t.reservation?.thankYouSub}
          </p>

          <div className="bg-[#F5F2EB] p-5 text-left space-y-2.5 mb-8 text-xs font-body">
            <div className="flex justify-between">
              <span className="text-[#191D30]/60">
                {t.reservation?.residenceLabel || 'Residence'}
              </span>
              <span className="font-semibold text-[#191D30]">
                {selectedRoomObj.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#191D30]/60">
                {t.reservation?.checkIn} → {t.reservation?.checkOut}
              </span>
              <span className="font-semibold text-[#191D30]">
                {formatDotDate(checkIn)} → {formatDotDate(checkOut)} ({nights}{' '}
                {nights === 1 ? t.reservation?.night : t.reservation?.nights})
              </span>
            </div>
            {liveQuote?.valid && (
              <div className="flex justify-between">
                <span className="text-[#191D30]/60">{t.reservation?.directRate}</span>
                <span className="font-semibold text-[#191D30]">
                  €{liveQuote.totalDirect}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#191D30]/60">
                {t.reservation?.guestsSummaryLabel || 'Guests'}
              </span>
              <span className="font-semibold text-[#191D30] text-right">
                {guestSummaryText}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#191D30]/60">
                {t.reservation?.arrivalWindowLabel || 'Arrival Window'}
              </span>
              <span className="font-semibold text-[#191D30]">{arrivalTime}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 rounded-full bg-[#191D30] hover:bg-[#A18E7E] text-white font-body text-[10px] tracking-[0.25em] uppercase font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle size={15} />
              <span>
                {t.reservation?.whatsappConciergeBtn || 'Priority WhatsApp Concierge'}
              </span>
            </a>
            <button
              onClick={() => setView('home')}
              className="flex-1 py-4 px-6 rounded-full border border-[#191D30]/20 text-[#191D30] font-body text-[10px] tracking-[0.25em] uppercase font-medium hover:bg-[#191D30] hover:text-white transition-all cursor-pointer"
            >
              {t.reservation?.back}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-28 pb-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => setView('home')}
            className="rounded-full px-5 py-2.5 border border-[#191D30]/15 inline-flex items-center gap-2 text-[#191D30]/70 hover:bg-[#191D30] hover:text-white font-body text-[10px] tracking-[0.25em] uppercase transition-all cursor-pointer"
          >
            <ArrowLeft size={14} /> {t.reservation?.back}
          </button>

          {/* Option to return to Step 1 if the guest wants to switch sanctuaries */}
          <button
            type="button"
            onClick={() => {
              setPropertyLockedIn(false);
              try {
                localStorage.removeItem('vacation_property_locked');
              } catch {
                // ignore
              }
            }}
            className="font-body text-[10px] tracking-[0.22em] uppercase text-[#A18E7E] hover:text-[#191D30] underline cursor-pointer"
          >
            {selectedRoomObj.name} · Change Sanctuary
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CARD: STAY CONFIGURATION FORM */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white border border-[#191D30]/10 p-6 sm:p-10 shadow-sm space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#191D30]/10">
              <div>
                <h1 className="font-body text-xs font-bold tracking-[0.22em] text-[#191D30] uppercase">
                  {t.reservation?.configTitle} — {selectedRoomObj.name}
                </h1>
              </div>
              <span className="font-body text-[11px] text-[#191D30]/60">
                {t.reservation?.configBadge}
              </span>
            </div>

            {/* Row 1: Adults, Children (with Dynamic Kid Ages) & Arrival Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  {t.reservation?.adultsLabel}
                </label>
                <select
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(Number(e.target.value))}
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {formatAdultsText(num)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  {t.reservation?.childrenLabel}
                </label>
                <select
                  value={childrenCount}
                  onChange={(e) => handleChildrenCountChange(e.target.value)}
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                >
                  {[0, 1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {formatChildrenText(num)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  {t.reservation?.arrivalTime}
                </label>
                <select
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                >
                  {arrivalTimeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Age of Kids Selector (Shown when Children > 0) */}
            {childrenCount > 0 && (
              <div className="p-4 bg-[#FAF9F6] border border-[#A18E7E]/35 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-[#191D30]">
                  <Baby size={14} className="text-[#A18E7E]" />
                  <span className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase">
                    {t.reservation?.childAgeHeader}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {childrenAges.map((ageVal, idx) => (
                    <div key={`child-age-${idx}`}>
                      <label className="block font-body text-[9px] tracking-[0.15em] text-[#191D30]/60 uppercase mb-1">
                        {t.reservation?.childAgeLabel} {idx + 1}
                      </label>
                      <select
                        value={ageVal}
                        onChange={(e) =>
                          handleSingleChildAgeChange(idx, e.target.value)
                        }
                        className="w-full bg-white border border-[#191D30]/15 px-3 py-2.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                      >
                        {Array.from({ length: 18 }, (_, ageNum) => (
                          <option key={ageNum} value={ageNum}>
                            {formatChildAgeText(ageNum)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row 2: Interactive Check-In & Check-Out Date Box */}
            <div className="relative">
              <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                {t.reservation?.selectDates}
              </label>

              <div
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="w-full bg-[#F5F2EB] border border-[#191D30]/15 hover:border-[#191D30] px-5 py-4 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-6 sm:gap-10">
                  <div>
                    <span className="block font-body text-[8.5px] tracking-[0.2em] text-[#191D30]/50 uppercase">
                      {t.reservation?.checkIn}
                    </span>
                    <span className="font-body text-sm font-bold text-[#191D30]">
                      {formatDotDate(checkIn)}
                    </span>
                  </div>

                  <span className="text-[#A18E7E] font-bold">→</span>

                  <div>
                    <span className="block font-body text-[8.5px] tracking-[0.2em] text-[#191D30]/50 uppercase">
                      {t.reservation?.checkOut}
                    </span>
                    <span className="font-body text-sm font-bold text-[#191D30]">
                      {formatDotDate(checkOut)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#191D30] text-white font-body text-[10px] tracking-wider uppercase">
                  <CalendarIcon size={12} />
                  <span>
                    {nights} {nights === 1 ? t.reservation?.night : t.reservation?.nights}
                  </span>
                </div>
              </div>

              {liveQuote && !liveQuote.valid && (
                <div className="mt-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-body flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span>{liveQuote.reason}</span>
                </div>
              )}

              {calendarOpen && (
                <div className="mt-2 bg-white border border-[#191D30]/20 shadow-2xl p-6 z-40 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#191D30]/10">
                    <button
                      type="button"
                      onClick={() =>
                        setCalMonth(
                          new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1)
                        )
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5F2EB] text-[#191D30]"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-body text-[10px] tracking-[0.25em] text-[#A18E7E] uppercase">
                      {t.reservation?.selectDaysHeader || t.reservation?.selectDates}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCalMonth(
                          new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1)
                        )
                      }
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F5F2EB] text-[#191D30]"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    {renderMonth(0)}
                    {renderMonth(1)}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#191D30]/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setCheckIn('');
                        setCheckOut('');
                      }}
                      className="font-body text-xs text-[#191D30]/60 hover:text-[#191D30] underline"
                    >
                      {t.reservation?.clearDates}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarOpen(false)}
                      className="px-6 py-2 rounded-full bg-[#191D30] text-white font-body text-xs tracking-wider uppercase"
                    >
                      {t.reservation?.applyDates}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Row 3: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  {t.reservation?.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.reservation?.fullNamePlaceholder || 'Full Name'}
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/35 focus:outline-none focus:border-[#191D30]"
                />
              </div>

              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  {t.reservation?.email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.reservation?.emailPlaceholder || 'name@email.com'}
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/35 focus:outline-none focus:border-[#191D30]"
                />
              </div>
            </div>

            {/* Row 4: SSN / National ID / Passport */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase">
                  {t.reservation?.ssnLabel}
                </label>
                <span className="inline-flex items-center gap-1 font-body text-[9.5px] text-emerald-700">
                  <ShieldCheck size={12} /> {t.reservation?.ssnBadge}
                </span>
              </div>
              <div className="relative">
                <input
                  type={showSsn ? 'text' : 'password'}
                  required
                  value={ssn}
                  onChange={(e) => setSsn(e.target.value)}
                  placeholder={t.reservation?.ssnPlaceholder}
                  autoComplete="off"
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 pr-11 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/35 focus:outline-none focus:border-[#191D30]"
                />
                <button
                  type="button"
                  onClick={() => setShowSsn((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#191D30]/45 hover:text-[#191D30]"
                  aria-label="Toggle SSN visibility"
                >
                  {showSsn ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Row 5: Phone / WhatsApp Number */}
            <div>
              <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                {t.reservation?.phone}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <select
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="sm:col-span-5 bg-[#F5F2EB] border border-[#191D30]/10 px-3.5 py-3.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                >
                  {countryPrefixesList.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="697 395 2375"
                  className="sm:col-span-7 bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/35 focus:outline-none focus:border-[#191D30]"
                />
              </div>
            </div>

            {/* Row 6: Special Occasion / Honeymoon / Fiancé Birthday Box */}
            <div>
              <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-1">
                {occasionText.label}
              </label>
              <p className="font-body text-[11px] text-[#A18E7E] mb-2">
                {occasionText.sub}
              </p>
              <textarea
                rows="3"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder={occasionText.placeholder}
                className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/40 resize-none focus:outline-none focus:border-[#191D30]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (liveQuote && !liveQuote.valid)}
              className="w-full py-4 rounded-full bg-[#191D30] hover:bg-[#A18E7E] text-white font-body text-[11px] tracking-[0.25em] uppercase font-semibold transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t.reservation?.sending || 'Sending...'
                : `${t.reservation?.confirmBtn} →`}
            </button>
          </form>

          {/* RIGHT CARD: INTERACTIVE PHOTO VIEWER & SUMMARY (Frameless Arrows & No Booking.com Button) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#191D30]/10 p-6 shadow-sm space-y-5">
            <div className="relative aspect-[4/3] w-full rounded-none overflow-hidden bg-[#191D30]/5 select-none">
              <SmoothImage
                key={selectedRoomObj.gallery[previewIdx]}
                src={selectedRoomObj.gallery[previewIdx]}
                alt={selectedRoomObj.name}
                eager={true}
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none"
              />

              {/* Frameless Left Arrow (No white circle) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIdx(
                    (prev) =>
                      (prev - 1 + selectedRoomObj.gallery.length) %
                      selectedRoomObj.gallery.length
                  );
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-1.5 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:text-[#A18E7E] hover:scale-110 transition-all cursor-pointer bg-transparent border-none"
                aria-label="Previous photo"
              >
                <ChevronLeft size={32} strokeWidth={1.6} />
              </button>

              {/* Frameless Right Arrow (No white circle) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIdx(
                    (prev) => (prev + 1) % selectedRoomObj.gallery.length
                  );
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-1.5 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:text-[#A18E7E] hover:scale-110 transition-all cursor-pointer bg-transparent border-none"
                aria-label="Next photo"
              >
                <ChevronRight size={32} strokeWidth={1.6} />
              </button>

              <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 bg-black/75 text-white font-body text-[10px]">
                {previewIdx + 1} / {selectedRoomObj.gallery.length}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-5 gap-2 mb-2.5">
                {selectedRoomObj.gallery.slice(0, 5).map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setPreviewIdx(i)}
                    className={`aspect-[4/3] rounded-none overflow-hidden border-2 transition-all cursor-pointer ${
                      previewIdx === i
                        ? 'border-[#191D30] opacity-100'
                        : 'border-transparent opacity-55 hover:opacity-90'
                    }`}
                  >
                    <SmoothImage
                      src={img}
                      alt=""
                      containerClassName="w-full h-full rounded-none"
                      className="w-full h-full object-cover rounded-none"
                    />
                  </button>
                ))}
              </div>
              <div className="w-full h-1 bg-[#F5F2EB] overflow-hidden">
                <div
                  className="h-full bg-[#191D30] transition-all duration-300"
                  style={{
                    width: `${
                      ((previewIdx + 1) / selectedRoomObj.gallery.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <span className="font-body text-[9.5px] tracking-[0.22em] text-[#A18E7E] uppercase block mb-1">
                {selectedRoomObj.badge} · {selectedRoomObj.location.split('·')[0]}
              </span>
              <h2 className="font-display text-2xl text-[#191D30] mb-2">
                {selectedRoomObj.name}
              </h2>
              <p className="font-body font-light text-xs text-[#191D30]/70 leading-relaxed line-clamp-3">
                {selectedRoomObj.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#191D30]/10 space-y-2.5 text-xs font-body">
              <div className="flex justify-between text-[#191D30]">
                <span>
                  {formatDotDate(checkIn)} → {formatDotDate(checkOut)}
                </span>
                <span className="font-semibold">
                  {nights} {nights === 1 ? t.reservation?.night : t.reservation?.nights}
                </span>
              </div>

              <div className="flex justify-between text-[#191D30]/75 gap-4">
                <span>{t.reservation?.guestsSummaryLabel || 'Guests'}</span>
                <span className="font-medium text-[#191D30] text-right">
                  {guestSummaryText}
                </span>
              </div>

              <div className="flex justify-between text-[#191D30]/75">
                <span>{t.reservation?.directRate}</span>
                <span className="font-semibold text-[#191D30]">
                  {liveQuote?.valid
                    ? `€${liveQuote.totalDirect} (€${liveQuote.avgNightly}${
                        t.reservation?.perNight || '/night'
                      })`
                    : t.reservation?.directRate}
                </span>
              </div>

              {liveQuote?.valid && (
                <div className="flex justify-between text-[#191D30]/45 line-through text-[11px]">
                  <span>
                    {t.reservation?.otaRate || 'Standard OTA Channel Rate'}
                  </span>
                  <span>€{liveQuote.totalOta}</span>
                </div>
              )}

              <div className="flex justify-between text-[#191D30]/75">
                <span>{t.reservation?.welcomeIncluded}</span>
                <span className="text-[#191D30] font-bold">✓</span>
              </div>

              <div className="pt-4 border-t border-[#191D30]/10 flex items-center justify-between">
                <span className="font-display text-sm text-[#191D30] font-semibold">
                  {t.reservation?.bookingRatingLabel || 'Booking.com Rating'}
                </span>
                <span className="font-display text-lg text-[#A18E7E] font-bold">
                  ★ {selectedRoomObj.rating} / 10
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}