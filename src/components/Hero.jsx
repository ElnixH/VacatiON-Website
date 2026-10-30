// src/components/Hero.jsx
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Check,
} from 'lucide-react';
import { PROPERTIES, useLanguage, getLocalizedProperty } from '../data/siteData';
import {
  loadAriStore,
  DEFAULT_PROPERTY_CONFIG,
} from '../services/channelManagerStore';
import SmoothImage from './SmoothImage';

const GUEST_INITIALS = ['C', 'M', 'S', 'J'];
const PROPERTY_KEYS = ['villa-leonora', 'andreas-traditional', 'andreas-two-bed'];

// Distinct background photos for each house option
const HERO_HOUSE_BACKGROUNDS = {
  'villa-leonora': '/images/properties/villa-leonora/image00015.webp', // Sunset infinity pool
  'andreas-traditional': '/images/properties/andreas-house/image00006 (1).webp', // Stone & arch courtyard
  'andreas-two-bed': '/images/properties/andreas-house-two-bedroom/image00001 (2).webp', // Coastal retreat veranda
};

const SELECT_DATES_COPY = {
  en: {
    heading: 'SELECT YOUR DATES NOW',
    sub: 'Select dates directly from the front page for your sanctuary reservation',
    btn: 'Reserve Sanctuary',
  },
  it: {
    heading: 'SELEZIONA ORA LE TUE DATE',
    sub: 'Seleziona le date direttamente dalla pagina iniziale per la tua prenotazione',
    btn: 'Prenota Dimora',
  },
  el: {
    heading: 'ΕΠΙΛΕΞΤΕ ΤΙΣ ΗΜΕΡΟΜΗΝΙΕΣ ΣΑΣ ΤΩΡΑ',
    sub: 'Επιλέξτε ημερομηνίες απευθείας από την αρχική σελίδα για την κράτησή σας',
    btn: 'Κράτηση Κατοικίας',
  },
};

const toIsoDate = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDotDate = (isoStr, fallback = 'Select Date') => {
  if (!isoStr) return fallback;
  const [y, m, d] = isoStr.split('-');
  return `${d}.${m}.${y}`;
};

export default function Hero({ setView }) {
  const { lang, t } = useLanguage();
  const calendarRef = useRef(null);
  const copy = SELECT_DATES_COPY[lang] || SELECT_DATES_COPY.en;

  const [ariStore, setAriStore] = useState(() => loadAriStore());
  const [tinosTime, setTinosTime] = useState('');
  const [weatherTemp, setWeatherTemp] = useState('24°C');
  const [selectedHouse, setSelectedHouse] = useState('villa-leonora');

  useEffect(() => {
    const sync = () => setAriStore(loadAriStore());
    window.addEventListener('s7-ari-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('s7-ari-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Athens',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
        setTinosTime(formatted);
      } catch {
        setTinosTime('15:00');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=37.5376&longitude=25.1634&current_weather=true'
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.current_weather?.temperature !== undefined) {
          setWeatherTemp(`${Math.round(data.current_weather.temperature)}°C`);
        }
      })
      .catch(() => {});
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

  const [checkIn, setCheckIn] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vacation_prefill_dates') || '{}');
      return saved.checkIn || defaultDates.checkIn;
    } catch {
      return defaultDates.checkIn;
    }
  });

  const [checkOut, setCheckOut] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vacation_prefill_dates') || '{}');
      return saved.checkOut || defaultDates.checkOut;
    } catch {
      return defaultDates.checkOut;
    }
  });

  const [adults, setAdults] = useState(2);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'vacation_prefill_dates',
        JSON.stringify({ checkIn, checkOut, adults, propertyId: selectedHouse })
      );
    } catch {
      // Ignore storage errors
    }
  }, [checkIn, checkOut, adults, selectedHouse]);

  const handleDayClick = (dateStr) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut('');
    } else if (dateStr > checkIn) {
      setCheckOut(dateStr);
      setCalendarOpen(false);
    } else {
      setCheckIn(dateStr);
      setCheckOut('');
    }
  };

  const localeMap = { en: 'en-US', it: 'it-IT', el: 'el-GR' };
  const weekDays = t.reservation?.weekDays || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
      cells.push(<div key={`empty-${i}`} className="h-8 w-full" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(
        2,
        '0'
      )}`;
      const isPast = iso < todayIso;
      const isStart = iso === checkIn;
      const isEnd = iso === checkOut;
      const isInRange =
        checkIn &&
        ((checkOut && iso > checkIn && iso < checkOut) ||
          (!checkOut && hoverDate && iso > checkIn && iso <= hoverDate));

      cells.push(
        <button
          key={iso}
          type="button"
          disabled={isPast}
          onMouseEnter={() => setHoverDate(iso)}
          onMouseLeave={() => setHoverDate(null)}
          onClick={() => handleDayClick(iso)}
          className={`h-8 w-full text-[11px] font-body transition-all flex items-center justify-center cursor-pointer ${
            isPast
              ? 'text-[#191D30]/20 cursor-not-allowed'
              : isStart || isEnd
              ? 'bg-[#191D30] text-white font-semibold'
              : isInRange
              ? 'bg-[#A18E7E]/25 text-[#191D30]'
              : 'text-[#191D30] hover:bg-[#191D30]/10'
          }`}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="flex-1 min-w-[210px]">
        <div className="text-center font-display text-xs tracking-wider text-[#191D30] uppercase mb-2">
          {monthName}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-body text-[#A18E7E] uppercase mb-1">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">{cells}</div>
      </div>
    );
  };

  const handleProceedToBooking = () => {
    try {
      localStorage.setItem('vacation_selected_property', selectedHouse);
      localStorage.setItem('vacation_property_locked', 'true');
      localStorage.setItem(
        'vacation_prefill_dates',
        JSON.stringify({ checkIn, checkOut, adults, propertyId: selectedHouse })
      );
    } catch {
      // Ignore storage errors
    }
    if (setView) setView('reserve');
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[100dvh] bg-[#191D30] pt-20 sm:pt-24 pb-[8px] text-white flex flex-col justify-between overflow-hidden"
    >
      {/* Fullscreen Dynamic Background Image Layers with Smooth Crossfade */}
      <div className="absolute inset-0 z-0">
        {PROPERTY_KEYS.map((pid) => (
          <div
            key={pid}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              selectedHouse === pid ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <SmoothImage
              src={HERO_HOUSE_BACKGROUNDS[pid]}
              alt={pid}
              eager={pid === 'villa-leonora'}
              containerClassName="w-full h-full rounded-none"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        ))}
        {/* Soft Contrast Gradient Overlay: Darker on Top for Nav & Bottom for Date Bar */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#191D30]/95 via-[#191D30]/45 to-[#191D30]/40" />
      </div>

      {/* Top Header Row within Hero Viewport */}
      <div className="relative z-30 max-w-[1400px] mx-auto w-full px-6 sm:px-10 md:px-14 pt-4 sm:pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-body text-[9.5px] tracking-[0.25em] uppercase text-white/90 select-none drop-shadow-sm">
            <span>{weatherTemp}</span>
            <span className="text-white/40">|</span>
            <span>{tinosTime}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center -space-x-2">
              {GUEST_INITIALS.map((initial) => (
                <div
                  key={initial}
                  className="w-6 h-6 rounded-full bg-[#191D30] border border-[#A18E7E] text-white font-display text-[9px] flex items-center justify-center shadow-xs"
                >
                  {initial}
                </div>
              ))}
              <div className="w-6 h-6 rounded-full bg-[#A18E7E] border border-white text-[#191D30] font-body text-[9px] font-bold flex items-center justify-center shadow-xs">
                9.9
              </div>
            </div>
            <p className="font-body text-[10px] text-white/85 leading-snug hidden sm:block drop-shadow-sm">
              {t.hero.trustLine1} {t.hero.trustLine2}
            </p>
          </div>
        </div>
      </div>

      {/* Center & Lower Content Anchored to Full Viewport Height */}
      <div className="relative z-30 max-w-[1400px] mx-auto w-full px-6 sm:px-10 md:px-14 my-auto pt-6 pb-2">
        {/* Headline */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl text-white tracking-[0.02em] leading-[1.18] font-normal mb-3 drop-shadow-md">
            {t.hero.titleLine1} {t.hero.titleLine2} {t.hero.titleLine3}
          </h1>
          <p className="font-body font-light text-xs sm:text-sm text-white/85 leading-relaxed max-w-lg drop-shadow-sm">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Interactive Sanctuary Selector (Switches Background Photo & Rates) */}
        <div className="mb-3.5 flex flex-wrap items-center gap-2">
          {PROPERTY_KEYS.map((pid) => {
            const prop =
              (typeof getLocalizedProperty === 'function'
                ? getLocalizedProperty(pid, lang)
                : PROPERTIES[pid]) || PROPERTIES[pid];
            const isSelected = selectedHouse === pid;
            const liveRate =
              ariStore?.properties?.[pid]?.baseRate ||
              DEFAULT_PROPERTY_CONFIG?.[pid]?.baseRate ||
              240;

            return (
              <button
                key={pid}
                type="button"
                onClick={() => setSelectedHouse(pid)}
                className={`rounded-full px-4 py-2 font-body text-[9.5px] tracking-[0.16em] uppercase transition-all duration-300 inline-flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-white text-[#191D30] border-white font-semibold shadow-xl'
                    : 'bg-[#191D30]/85 backdrop-blur-md border-white/25 text-white/80 hover:border-white/50 hover:text-white'
                }`}
              >
                {isSelected ? (
                  <Check size={11} className="text-[#A18E7E]" />
                ) : (
                  <MapPin size={10} className="text-[#A18E7E]" />
                )}
                <span>{prop.name}</span>
                <span className={`text-[8.5px] ${isSelected ? 'text-[#191D30]/70' : 'text-[#A18E7E]'}`}>
                  (€{liveRate}/n)
                </span>
              </button>
            );
          })}
        </div>

        {/* Front-Page Date Selection Bar (With 8px Bottom Margin to Next Section) */}
        <div className="relative text-[#191D30]" ref={calendarRef}>
          <div className="bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl p-2.5 sm:p-3.5 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
            {/* Check-In */}
            <div
              onClick={() => setCalendarOpen(true)}
              className="md:col-span-4 px-3.5 py-2.5 bg-[#FAF9F6] border border-[#191D30]/10 hover:border-[#A18E7E] transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="block font-body text-[8px] tracking-[0.2em] text-[#A18E7E] uppercase">
                  {t.reservation?.checkIn || 'CHECK-IN'}
                </span>
                <span className="font-body text-xs sm:text-sm font-semibold text-[#191D30]">
                  {formatDotDate(checkIn, t.reservation?.selectDatePrompt)}
                </span>
              </div>
              <CalendarIcon size={15} className="text-[#A18E7E]" />
            </div>

            {/* Check-Out */}
            <div
              onClick={() => setCalendarOpen(true)}
              className="md:col-span-4 px-3.5 py-2.5 bg-[#FAF9F6] border border-[#191D30]/10 hover:border-[#A18E7E] transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="block font-body text-[8px] tracking-[0.2em] text-[#A18E7E] uppercase">
                  {t.reservation?.checkOut || 'CHECK-OUT'}
                </span>
                <span className="font-body text-xs sm:text-sm font-semibold text-[#191D30]">
                  {formatDotDate(checkOut, t.reservation?.selectDatePrompt)}
                </span>
              </div>
              <CalendarIcon size={15} className="text-[#A18E7E]" />
            </div>

            {/* Guests */}
            <div className="md:col-span-2 px-3.5 py-2.5 bg-[#FAF9F6] border border-[#191D30]/10 flex items-center justify-between">
              <div className="w-full">
                <span className="block font-body text-[8px] tracking-[0.2em] text-[#A18E7E] uppercase">
                  {t.reservation?.guestsSummaryLabel || 'GUESTS'}
                </span>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full bg-transparent font-body text-xs sm:text-sm font-semibold text-[#191D30] focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}{' '}
                      {num === 1
                        ? t.reservation?.adultSingular || 'Adult'
                        : t.reservation?.adultsPlural || 'Adults'}
                    </option>
                  ))}
                </select>
              </div>
              <Users size={14} className="text-[#A18E7E] shrink-0 ml-1" />
            </div>

            {/* Action Button */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleProceedToBooking}
                className="w-full rounded-full py-3.5 px-4 bg-[#191D30] hover:bg-[#A18E7E] text-white font-body text-[9.5px] tracking-[0.2em] uppercase font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>{copy.btn}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Popup Dual-Month Calendar Dropdown */}
          {calendarOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#191D30]/20 shadow-2xl p-5 z-50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#191D30]/10">
                <button
                  type="button"
                  onClick={() =>
                    setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))
                  }
                  className="p-1 text-[#191D30] hover:text-[#A18E7E] cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-body text-[9.5px] tracking-[0.22em] text-[#A18E7E] uppercase">
                  {copy.heading}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))
                  }
                  className="p-1 text-[#191D30] hover:text-[#A18E7E] cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {renderMonth(0)}
                {renderMonth(1)}
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#191D30]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn('');
                    setCheckOut('');
                  }}
                  className="font-body text-xs text-[#191D30]/60 hover:text-[#191D30] underline cursor-pointer"
                >
                  {t.reservation?.clearDates || 'Clear Dates'}
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  className="px-5 py-2 rounded-full bg-[#191D30] text-white font-body text-[9.5px] tracking-[0.2em] uppercase cursor-pointer"
                >
                  {t.reservation?.applyDates || 'Apply Dates'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}