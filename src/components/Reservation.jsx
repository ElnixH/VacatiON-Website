// src/components/Reservation.jsx
import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar as CalendarIcon,
  MessageCircle,
  ExternalLink,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Baby,
} from 'lucide-react';
import { PROPERTIES, useLanguage } from '../data/siteData';
import {
  loadAriStore,
  getDayAri,
  evaluateStayQuote,
} from '../services/channelManagerStore';
import SmoothImage from './SmoothImage';

const COUNTRY_PREFIXES = [
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

const ARRIVAL_TIMES = [
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00',
  'Late Arrival (22:00+)',
];

const CHILD_AGE_OPTIONS = [
  'Infant (Under 1 yr)',
  '1 year old',
  '2 years old',
  '3 years old',
  '4 years old',
  '5 years old',
  '6 years old',
  '7 years old',
  '8 years old',
  '9 years old',
  '10 years old',
  '11 years old',
  '12 years old',
  '13 years old',
  '14 years old',
  '15 years old',
  '16 years old',
  '17 years old',
];

const formatDotDate = (isoStr) => {
  if (!isoStr) return 'Select Date';
  const [y, m, d] = isoStr.split('-');
  return `${d}.${m}.${y}`;
};

const toIsoDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function Reservation({ setView }) {
  const { t } = useLanguage();
  const [ariStore, setAriStore] = useState(() => loadAriStore());

  useEffect(() => {
    const syncStore = () => setAriStore(loadAriStore());
    window.addEventListener('s7-ari-updated', syncStore);
    window.addEventListener('storage', syncStore);
    return () => {
      window.removeEventListener('s7-ari-updated', syncStore);
      window.removeEventListener('storage', syncStore);
    };
  }, []);

  const defaultDates = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + 14);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return {
      checkIn: toIsoDate(start),
      checkOut: toIsoDate(end),
    };
  }, []);

  const [selectedPropertyId, setSelectedPropertyId] = useState('villa-leonora');
  const [adults, setAdults] = useState('2 Adults');
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

  const selectedRoomObj =
    PROPERTIES[selectedPropertyId] || PROPERTIES['villa-leonora'];

  const handlePropertyChange = (newId) => {
    setSelectedPropertyId(newId);
    setPreviewIdx(0);
  };

  // Update children count & dynamically size the ages array
  const handleChildrenCountChange = (countNumber) => {
    const count = Number(countNumber);
    setChildrenCount(count);
    setChildrenAges((prev) => {
      const next = [...prev];
      while (next.length < count) {
        next.push('5 years old');
      }
      return next.slice(0, count);
    });
  };

  const handleSingleChildAgeChange = (idx, newAge) => {
    setChildrenAges((prev) => {
      const copy = [...prev];
      copy[idx] = newAge;
      return copy;
    });
  };

  const guestSummaryText = useMemo(() => {
    if (childrenCount === 0) return adults;
    return `${adults}, ${childrenCount} ${
      childrenCount === 1 ? 'Child' : 'Children'
    } (${childrenAges.join(', ')})`;
  }, [adults, childrenCount, childrenAges]);

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

  const renderMonth = (monthOffset) => {
    const viewDate = new Date(
      calMonth.getFullYear(),
      calMonth.getMonth() + monthOffset,
      1
    );
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('en-US', {
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
              ? 'Unavailable / Closed'
              : `€${dayAri.price}/night · Min ${dayAri.minStay} nights`
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
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
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

    const formData = {
      bookingReference: generatedRef,
      property: selectedRoomObj.name,
      adults,
      childrenCount,
      childrenAges: childrenCount > 0 ? childrenAges.join(', ') : 'None',
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
    };

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
        ? `%0A*Children (${childrenCount}):* ${childrenAges.join(', ')}`
        : '';
    const text = `Hello VacatiON Tinos! I would like to confirm my reservation request:%0A%0A*Reference:* ${bookingRef}%0A*Sanctuary:* ${selectedRoomObj.name}%0A*Check-In:* ${formatDotDate(
      checkIn
    )}%0A*Check-Out:* ${formatDotDate(
      checkOut
    )} (${nights} nights)${priceLine}%0A*Adults:* ${adults}${kidsLine}%0A*Arrival:* ${arrivalTime}%0A*Name:* ${name}`;
    return `https://wa.me/306973952375?text=${text}`;
  }, [
    bookingRef,
    selectedRoomObj,
    checkIn,
    checkOut,
    nights,
    liveQuote,
    adults,
    childrenCount,
    childrenAges,
    arrivalTime,
    name,
  ]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-28 px-4">
        <div className="max-w-xl mx-auto bg-white border border-[#191D30]/10 shadow-xl p-8 md:p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#191D30] text-[#A18E7E] flex items-center justify-center mx-auto mb-6">
            <Check size={24} />
          </div>

          <span className="font-body text-[10px] tracking-[0.25em] text-[#A18E7E] uppercase block mb-2">
            Reservation Registered · #{bookingRef}
          </span>

          <h1 className="font-display text-2xl md:text-3xl text-[#191D30] uppercase tracking-wider mb-4">
            Thank You, {name}
          </h1>

          <p className="font-body font-light text-xs md:text-sm text-[#191D30]/70 leading-relaxed mb-8">
            Our Tinos concierge team has received your request for {selectedRoomObj.name} and will confirm your stay shortly.
          </p>

          <div className="bg-[#F5F2EB] p-5 text-left space-y-2.5 mb-8 text-xs font-body">
            <div className="flex justify-between">
              <span className="text-[#191D30]/60">Residence</span>
              <span className="font-semibold text-[#191D30]">
                {selectedRoomObj.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#191D30]/60">Check-In → Check-Out</span>
              <span className="font-semibold text-[#191D30]">
                {formatDotDate(checkIn)} → {formatDotDate(checkOut)} ({nights}{' '}
                {t.reservation.nights})
              </span>
            </div>
            {liveQuote?.valid && (
              <div className="flex justify-between">
                <span className="text-[#191D30]/60">Direct Sanctuary Rate</span>
                <span className="font-semibold text-[#191D30]">
                  €{liveQuote.totalDirect}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#191D30]/60">Guests</span>
              <span className="font-semibold text-[#191D30] text-right">
                {guestSummaryText}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#191D30]/60">Arrival Window</span>
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
              <span>Priority WhatsApp Concierge</span>
            </a>
            <button
              onClick={() => setView('home')}
              className="flex-1 py-4 px-6 rounded-full border border-[#191D30]/20 text-[#191D30] font-body text-[10px] tracking-[0.25em] uppercase font-medium hover:bg-[#191D30] hover:text-white transition-all"
            >
              {t.reservation.back}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-28 pb-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <button
          onClick={() => setView('home')}
          className="rounded-full px-5 py-2.5 border border-[#191D30]/15 inline-flex items-center gap-2 text-[#191D30]/70 hover:bg-[#191D30] hover:text-white font-body text-[10px] tracking-[0.25em] uppercase mb-8 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} /> {t.reservation.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CARD: STAY CONFIGURATION FORM */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white border border-[#191D30]/10 p-6 sm:p-10 shadow-sm space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#191D30]/10">
              <h1 className="font-body text-xs font-bold tracking-[0.22em] text-[#191D30] uppercase">
                {t.reservation.configTitle}
              </h1>
              <span className="font-body text-[11px] text-[#191D30]/60">
                {t.reservation.configBadge}
              </span>
            </div>

            {/* Row 1: Adults, Children (with Dynamic Kid Ages) & Arrival Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  Adults
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                >
                  <option value="1 Adult">1 Adult</option>
                  <option value="2 Adults">2 Adults</option>
                  <option value="3 Adults">3 Adults</option>
                  <option value="4 Adults">4 Adults</option>
                  <option value="5 Adults">5 Adults</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  Children (Under 18)
                </label>
                <select
                  value={childrenCount}
                  onChange={(e) => handleChildrenCountChange(e.target.value)}
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                >
                  <option value={0}>No Children</option>
                  <option value={1}>1 Child</option>
                  <option value={2}>2 Children</option>
                  <option value={3}>3 Children</option>
                  <option value={4}>4 Children</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  {t.reservation.arrivalTime}
                </label>
                <select
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                >
                  {ARRIVAL_TIMES.map((time) => (
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
                    Age of {childrenCount === 1 ? 'Child' : 'Children'} at Check-In
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {childrenAges.map((ageVal, idx) => (
                    <div key={`child-age-${idx}`}>
                      <label className="block font-body text-[9px] tracking-[0.15em] text-[#191D30]/60 uppercase mb-1">
                        Child {idx + 1} Age
                      </label>
                      <select
                        value={ageVal}
                        onChange={(e) =>
                          handleSingleChildAgeChange(idx, e.target.value)
                        }
                        className="w-full bg-white border border-[#191D30]/15 px-3 py-2.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                      >
                        {CHILD_AGE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row 2: Curated Collection Dropdown */}
            <div>
              <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                {t.reservation.curatedCollection}
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => handlePropertyChange(e.target.value)}
                className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] font-medium focus:outline-none focus:border-[#191D30]"
              >
                <option value="villa-leonora">
                  Villa Leonora — Private Infinity Pool Sanctuary (★ 9.9 • Up to 4 Guests)
                </option>
                <option value="andreas-traditional">
                  Andrea&apos;s Traditional House — Cycladic Haven (★ 9.8 • Up to 3 Guests)
                </option>
                <option value="andreas-two-bed">
                  Andrea&apos;s Two-Bedroom House — Spacious Family Retreat (★ 9.7 • Up to 5 Guests)
                </option>
              </select>
            </div>

            {/* Row 3: Interactive Check-In & Check-Out Date Box */}
            <div className="relative">
              <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                {t.reservation.selectDates}
              </label>

              <div
                onClick={() => setCalendarOpen(!calendarOpen)}
                className="w-full bg-[#F5F2EB] border border-[#191D30]/15 hover:border-[#191D30] px-5 py-4 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-6 sm:gap-10">
                  <div>
                    <span className="block font-body text-[8.5px] tracking-[0.2em] text-[#191D30]/50 uppercase">
                      {t.reservation.checkIn}
                    </span>
                    <span className="font-body text-sm font-bold text-[#191D30]">
                      {formatDotDate(checkIn)}
                    </span>
                  </div>

                  <span className="text-[#A18E7E] font-bold">→</span>

                  <div>
                    <span className="block font-body text-[8.5px] tracking-[0.2em] text-[#191D30]/50 uppercase">
                      {t.reservation.checkOut}
                    </span>
                    <span className="font-body text-sm font-bold text-[#191D30]">
                      {formatDotDate(checkOut)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#191D30] text-white font-body text-[10px] tracking-wider uppercase">
                  <CalendarIcon size={12} />
                  <span>
                    {nights} {nights === 1 ? t.reservation.night : t.reservation.nights}
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
                      Select Check-In &amp; Check-Out Days
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
                      {t.reservation.clearDates}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarOpen(false)}
                      className="px-6 py-2 rounded-full bg-[#191D30] text-white font-body text-xs tracking-wider uppercase"
                    >
                      {t.reservation.applyDates}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Row 4: Full Name, Email & SSN / National Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  {t.reservation.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/35 focus:outline-none focus:border-[#191D30]"
                />
              </div>

              <div>
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                  {t.reservation.email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/35 focus:outline-none focus:border-[#191D30]"
                />
              </div>
            </div>

            {/* Row 5: SSN / National ID / Passport (Protected Input with Mask Toggle) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase">
                  SSN / National ID / Passport Number
                </label>
                <span className="inline-flex items-center gap-1 font-body text-[9.5px] text-emerald-700">
                  <ShieldCheck size={12} /> Encrypted Guest Registration
                </span>
              </div>
              <div className="relative">
                <input
                  type={showSsn ? 'text' : 'password'}
                  required
                  value={ssn}
                  onChange={(e) => setSsn(e.target.value)}
                  placeholder="Enter SSN, Tax ID, or Passport No. for hospitality registration"
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

            {/* Row 6: Phone / WhatsApp Number */}
            <div>
              <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                {t.reservation.phone}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <select
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="sm:col-span-5 bg-[#F5F2EB] border border-[#191D30]/10 px-3.5 py-3.5 text-xs font-body text-[#191D30] focus:outline-none focus:border-[#191D30]"
                >
                  {COUNTRY_PREFIXES.map((c) => (
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

            {/* Row 7: Special Requests */}
            <div>
              <label className="block font-body text-[9.5px] tracking-[0.2em] text-[#191D30]/65 uppercase mb-2">
                {t.reservation.specialRequests}
              </label>
              <textarea
                rows="3"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Ferry arrival details, baby crib request, Early Bird 2027 inquiry, or special requests..."
                className="w-full bg-[#F5F2EB] border border-[#191D30]/10 px-4 py-3.5 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/35 resize-none focus:outline-none focus:border-[#191D30]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (liveQuote && !liveQuote.valid)}
              className="w-full py-4 rounded-full bg-[#191D30] hover:bg-[#A18E7E] text-white font-body text-[11px] tracking-[0.25em] uppercase font-semibold transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : `${t.reservation.confirmBtn} →`}
            </button>
          </form>

          {/* RIGHT CARD: INTERACTIVE PHOTO VIEWER & SUMMARY */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#191D30]/10 p-6 shadow-sm space-y-5">
            <div className="relative aspect-[4/3] w-full rounded-none overflow-hidden bg-[#191D30]/5">
              <SmoothImage
                key={selectedRoomObj.gallery[previewIdx]}
                src={selectedRoomObj.gallery[previewIdx]}
                alt={selectedRoomObj.name}
                eager={true}
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none"
              />

              <button
                type="button"
                onClick={() =>
                  setPreviewIdx(
                    (prev) =>
                      (prev - 1 + selectedRoomObj.gallery.length) %
                      selectedRoomObj.gallery.length
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#191D30] flex items-center justify-center shadow-md transition-transform hover:scale-105"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPreviewIdx((prev) => (prev + 1) % selectedRoomObj.gallery.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#191D30] flex items-center justify-center shadow-md transition-transform hover:scale-105"
              >
                <ChevronRight size={16} />
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
                    className={`aspect-[4/3] rounded-none overflow-hidden border-2 transition-all ${
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
                  {nights} {nights === 1 ? t.reservation.night : t.reservation.nights}
                </span>
              </div>

              <div className="flex justify-between text-[#191D30]/75 gap-4">
                <span>Guests</span>
                <span className="font-medium text-[#191D30] text-right">
                  {guestSummaryText}
                </span>
              </div>

              <div className="flex justify-between text-[#191D30]/75">
                <span>Direct Sanctuary Rate</span>
                <span className="font-semibold text-[#191D30]">
                  {liveQuote?.valid
                    ? `€${liveQuote.totalDirect} (€${liveQuote.avgNightly}/night)`
                    : t.reservation.directRate}
                </span>
              </div>

              {liveQuote?.valid && (
                <div className="flex justify-between text-[#191D30]/45 line-through text-[11px]">
                  <span>Standard OTA Channel Rate</span>
                  <span>€{liveQuote.totalOta}</span>
                </div>
              )}

              <div className="flex justify-between text-[#191D30]/75">
                <span>{t.reservation.welcomeIncluded}</span>
                <span className="text-[#191D30] font-bold">✓</span>
              </div>

              <div className="pt-4 border-t border-[#191D30]/10 flex items-center justify-between">
                <span className="font-display text-sm text-[#191D30] font-semibold">
                  Booking.com Rating
                </span>
                <span className="font-display text-lg text-[#A18E7E] font-bold">
                  ★ {selectedRoomObj.rating} / 10
                </span>
              </div>
            </div>

            <a
              href={selectedRoomObj.bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-full border border-[#191D30]/20 hover:bg-[#191D30] hover:text-white text-[#191D30] font-body text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all"
            >
              <span>Or Check Live Calendar on Booking.com</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}