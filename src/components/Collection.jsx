// src/components/Collection.jsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpRight,
  Waves,
  UtensilsCrossed,
  BedDouble,
  Wifi,
  Car,
  Check,
  Wind,
  Eye,
  X,
  Plus,
} from 'lucide-react';
import {
   useLanguage,
  getLocalizedProperty,
} from '../data/siteData';
import { DEFAULT_PROPERTY_CONFIG } from '../services/channelManagerStore';
import SmoothImage from './SmoothImage';

const PROPERTY_ORDER = ['villa-leonora', 'andreas-traditional', 'andreas-two-bed'];

const FULL_BOOKING_FACILITIES = {
  en: {
    topHighlightsTitle: 'Essential Sanctuary Services',
    viewMoreBtn: 'View All Facilities & Services',
    modalTitle: 'Complete Sanctuary Facilities & Services',
    modalSub: 'Verified Booking.com property specifications across our Tinos residences',
    experienceWord: 'EXPERIENCE',
    tag1: 'AEGEAN RITUAL',
    tag2: 'ISLAND DINING',
    tag3: 'LA LUXURY STAY',
    expCaption: 'VacatiON pairs generous Cycladic space\nwith thoughtful family hospitality.',
    essentials: [
      { icon: Waves, label: 'Private Infinity Pool', sub: 'Open all year · View & loungers' },
      { icon: Car, label: 'Free Private Parking', sub: 'On-site · No reservation needed' },
      { icon: Wifi, label: 'Free High-Speed Wi-Fi', sub: 'Available in all rooms' },
      { icon: Eye, label: '180° Sea & 11-Island View', sub: 'Aegean, pool & mountain' },
      { icon: UtensilsCrossed, label: 'Full Chef Kitchen', sub: 'Espresso, oven & dishwasher' },
      { icon: Wind, label: 'A/C & Soundproofing', sub: 'Detached stone architecture' },
    ],
    columns: [
      [
        {
          title: 'Parking',
          note: 'Free private parking is available on site (reservation is not needed).',
          items: [],
        },
        {
          title: 'Internet',
          note: 'WiFi is available in the rooms and is free of charge.',
          items: [],
        },
        {
          title: 'Kitchen',
          items: [
            'Dining table',
            'Coffee machine',
            'Toaster',
            'Stovetop',
            'Oven',
            'Kitchenware',
            'Electric kettle',
            'Kitchen',
            'Washing machine',
            'Dishwasher',
            'Refrigerator',
          ],
        },
        {
          title: 'Bedroom',
          items: ['Linens', 'King & Queen beds'],
        },
        {
          title: 'Bathroom',
          items: [
            'Toilet paper',
            'Towels',
            'Bidet',
            'Private bathroom',
            'Toilet',
            'Free toiletries',
            'Hairdryer',
            'Shower',
          ],
        },
        {
          title: 'Living Area',
          items: ['Dining area', 'Sofa', 'Desk'],
        },
      ],
      [
        {
          title: 'Media & Technology',
          items: ['Flat-screen TV'],
        },
        {
          title: 'Room Amenities',
          items: ['Clothes rack', 'Tile/marble floor', 'Private entrance', 'Iron'],
        },
        {
          title: 'Outdoors',
          items: [
            'Outdoor furniture',
            'Outdoor dining area',
            'Sun deck',
            'Private pool',
            'BBQ facilities',
            'Patio',
            'Balcony',
            'Terrace',
          ],
        },
        {
          title: 'Outdoor Swimming Pool',
          badge: 'Free!',
          items: [
            'Open all year',
            'All ages welcome',
            'Infinity pool',
            'Pool with view',
            'Shallow end',
            'Beach chairs/Loungers',
          ],
        },
        {
          title: 'Spa & Wellness',
          items: ['Beach chairs/Loungers'],
        },
        {
          title: 'Food & Drink',
          items: ['Tea/Coffee maker', 'Welcome fruit & bubbly'],
        },
      ],
      [
        {
          title: 'Outdoor & View',
          items: [
            'Inner courtyard view',
            'City / Chora view',
            'Landmark view',
            'Mountain view',
            'Pool view',
            'Garden view',
            'Sea view',
            '11-Island Panorama',
          ],
        },
        {
          title: 'Building Characteristics',
          items: ['Detached Cycladic residence'],
        },
        {
          title: 'Front Desk Services',
          items: ['Invoice provided', 'Private check-in/out', 'Express check-in/out'],
        },
        {
          title: 'Cleaning Services',
          items: ['Daily housekeeping (Available)'],
        },
        {
          title: 'Miscellaneous',
          items: [
            'Designated smoking area',
            'Air conditioning',
            'Smoke-free property',
            'Heating',
            'Soundproof rooms',
            'Family rooms',
            'Non-smoking rooms',
          ],
        },
        {
          title: 'Safety & Security',
          items: ['Fire extinguishers', 'CCTV outside property', 'Key access'],
        },
        {
          title: 'Languages Spoken',
          items: ['Greek', 'English', 'Italian'],
        },
      ],
    ],
  },
  it: {
    topHighlightsTitle: 'Servizi Essenziali delle Dimore',
    viewMoreBtn: 'Vedi Tutti i Servizi e Dotazioni',
    modalTitle: 'Dotazioni e Servizi Completi delle Dimore',
    modalSub: 'Specifiche complete verificate su Booking.com per le nostre dimore a Tinos',
    experienceWord: 'EXPERIENCE',
    tag1: 'RITUALE EGEO',
    tag2: 'CUCINA DELL’ISOLA',
    tag3: 'LA LUXURY STAY',
    expCaption: 'VacatiON unisce ampi spazi cicladici\na un’ospitalità familiare attenta.',
    essentials: [
      { icon: Waves, label: 'Piscina Infinity Privata', sub: 'Aperta tutto l’anno · Lettini' },
      { icon: Car, label: 'Parcheggio Privato Gratuito', sub: 'In loco · Senza prenotazione' },
      { icon: Wifi, label: 'Wi-Fi Veloce Gratuito', sub: 'In tutte le camere' },
      { icon: Eye, label: 'Vista Mare 180° e 11 Isole', sub: 'Egeo, piscina e montagna' },
      { icon: UtensilsCrossed, label: 'Cucina Completa da Chef', sub: 'Espresso, forno e lavastoviglie' },
      { icon: Wind, label: 'Clima e Insonorizzazione', sub: 'Dimore indipendenti in pietra' },
    ],
  },
  el: {
    topHighlightsTitle: 'Βασικές Παροχές Κατοικιών',
    viewMoreBtn: 'Δείτε Όλες τις Παροχές & Υπηρεσίες',
    modalTitle: 'Πλήρεις Παροχές & Εγκαταστάσεις Κατοικιών',
    modalSub: 'Επιβεβαιωμένες προδιαγραφές Booking.com για τις κατοικίες μας στην Τήνο',
    experienceWord: 'EXPERIENCE',
    tag1: 'ΑΙΓΑΙΟΠΕΛΑΓΙΤΙΚΗ ΑΥΡΑ',
    tag2: 'ΝΗΣΙΩΤΙΚΗ ΓΑΣΤΡΟΝΟΜΙΑ',
    tag3: 'LA LUXURY STAY',
    expCaption: 'Το VacatiON συνδυάζει την άνεση του χώρου\nμε την αυθεντική οικογενειακή φιλοξενία.',
    essentials: [
      { icon: Waves, label: 'Ιδιωτική Πισίνα Infinity', sub: 'Ανοιχτή όλο το χρόνο · Ξαπλώστρες' },
      { icon: Car, label: 'Δωρεάν Ιδιωτικό Parking', sub: 'Στις εγκαταστάσεις · Χωρίς κράτηση' },
      { icon: Wifi, label: 'Δωρεάν Γρήγορο Wi-Fi', sub: 'Σε όλους τους χώρους' },
      { icon: Eye, label: 'Θέα 180° σε 11 Νησιά', sub: 'Αιγαίο, πισίνα & βουνό' },
      { icon: UtensilsCrossed, label: 'Πλήρως Εξοπλισμένη Κουζίνα', sub: 'Εσπρεσιέρα, φούρνος & πλυντήριο' },
      { icon: Wind, label: 'Κλιματισμός & Ηχομόνωση', sub: 'Ανεξάρτητη τηνιακή αρχιτεκτονική' },
    ],
  },
};

export default function Collection({ setView }) {
  const { lang, t } = useLanguage();
  const [showFacilitiesModal, setShowFacilitiesModal] = useState(false);

  const locCopy = FULL_BOOKING_FACILITIES[lang] || FULL_BOOKING_FACILITIES.en;
  const modalColumns = FULL_BOOKING_FACILITIES.en.columns;

  // Lock background page scroll when the centered modal is open
  useEffect(() => {
    if (showFacilitiesModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showFacilitiesModal]);

  return (
    <section id="collection" className="pt-24 md:pt-32 bg-[#FAF9F6] text-[#191D30] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14">
        {/* Section Header (Kept Exactly as Requested) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-[#A18E7E]" />
              <span className="font-body text-[10px] tracking-[0.3em] text-[#A18E7E] uppercase">
                {t.collection.eyebrow}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.15] text-[#191D30]">
              {t.collection.heading1} <br />
              {t.collection.heading2}
            </h2>
          </div>

          <div className="max-w-md">
            <p className="font-body font-light text-xs sm:text-sm text-[#191D30]/70 leading-relaxed mb-6">
              {t.collection.subtext}
            </p>
            <button
              onClick={() => setView && setView('reserve')}
              className="rounded-full px-7 py-3.5 bg-[#191D30] text-white font-body text-[10px] tracking-[0.25em] uppercase hover:bg-[#A18E7E] transition-colors cursor-pointer"
            >
              {t.collection.reserveBtn} →
            </button>
          </div>
        </div>

        {/* 3-Property Cards Grid (Kept 100% as Requested) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          {PROPERTY_ORDER.map((pid) => {
            const prop = getLocalizedProperty(pid, lang);
            const config = DEFAULT_PROPERTY_CONFIG[pid];
            return (
              <div
                key={pid}
                className="group bg-white border border-[#191D30]/10 flex flex-col justify-between transition-all duration-500 hover:shadow-xl"
              >
                <div>
                  {/* Square-Edge Photo */}
                  <div
                    onClick={() => setView && setView(pid)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#191D30] cursor-pointer"
                  >
                    <SmoothImage
                      src={prop.coverImage}
                      alt={prop.name}
                      containerClassName="w-full h-full rounded-none"
                      className="w-full h-full object-cover rounded-none transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-[#191D30]/85 text-white px-3.5 py-1.5 font-body text-[9px] tracking-[0.22em] uppercase">
                      {prop.badge}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/95 text-[#191D30] px-3 py-1 font-display text-xs font-semibold">
                      ★ {prop.rating}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-7">
                    <p className="font-body text-[9.5px] tracking-[0.22em] text-[#A18E7E] uppercase mb-2">
                      {prop.location}
                    </p>
                    <h3
                      onClick={() => setView && setView(pid)}
                      className="font-display text-2xl text-[#191D30] mb-3 cursor-pointer group-hover:text-[#A18E7E] transition-colors"
                    >
                      {prop.name}
                    </h3>
                    <p className="font-body font-light text-xs leading-relaxed text-[#191D30]/70 line-clamp-3 mb-6">
                      {prop.description}
                    </p>

                    {/* Specs Mini-Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#191D30]/10">
                      {prop.specs.map((sp, i) => (
                        <div key={i}>
                          <span className="block font-body text-[8.5px] tracking-[0.2em] text-[#191D30]/45 uppercase">
                            {sp.label}
                          </span>
                          <span className="font-body text-xs font-medium text-[#191D30]">
                            {sp.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Rate + Explore Button */}
                <div className="px-7 py-5 bg-[#FAF9F6] border-t border-[#191D30]/10 flex items-center justify-between">
                  <div>
                    <span className="font-body text-[9px] tracking-[0.2em] text-[#191D30]/50 uppercase block">
                      {t.collection.from}
                    </span>
                    <span className="font-display text-xl text-[#191D30] font-semibold">
                      €{config?.baseRate || 240}
                    </span>
                    <span className="font-body text-[10px] text-[#191D30]/60 ml-1">
                      {t.collection.perNight}
                    </span>
                  </div>

                  <button
                    onClick={() => setView && setView(pid)}
                    className="rounded-full px-5 py-2.5 bg-[#191D30] text-white font-body text-[9.5px] tracking-[0.22em] uppercase hover:bg-[#A18E7E] transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{t.collection.explore}</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* =============================================================== */}
        {/* THINNER, SLEEKER ESSENTIAL SANCTUARY SERVICES RIBBON            */}
        {/* =============================================================== */}
        <div className="border-t border-b border-[#191D30]/10 py-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-[#A18E7E]" />
              <h3 className="font-display text-xs sm:text-sm tracking-[0.22em] text-[#191D30] uppercase">
                {locCopy.topHighlightsTitle}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowFacilitiesModal(true)}
              className="self-start sm:self-auto rounded-full px-5 py-2 border border-[#191D30]/20 hover:bg-[#191D30] text-[#191D30] hover:text-white font-body text-[9.5px] tracking-[0.22em] uppercase inline-flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
            >
              <Plus size={12} className="text-[#A18E7E]" />
              <span>{locCopy.viewMoreBtn}</span>
            </button>
          </div>

          {/* Slim Horizontal Architectural Ribbon */}
          <div className="bg-white border border-[#191D30]/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#191D30]/10">
            {locCopy.essentials.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setShowFacilitiesModal(true)}
                  className="px-4 py-3.5 flex items-center gap-3 text-left hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FAF9F6] group-hover:bg-[#191D30] text-[#A18E7E] flex items-center justify-center shrink-0 transition-colors">
                    <Icon size={14} strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-[11.5px] text-[#191D30] font-semibold truncate">
                      {item.label}
                    </p>
                    <p className="font-body text-[10px] text-[#191D30]/55 truncate">
                      {item.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =============================================================== */}
        {/* SYMMETRICAL "EXPERIENCE" SHOWCASE (First 'E' 100% Unobstructed) */}
        {/* =============================================================== */}
        <div className="py-24 md:py-32">
          <div className="relative py-16 md:py-24 flex flex-col items-center justify-center">
            {/* Top-Left Tilted Floating Photo — Shifted to X/P so first 'E' is 100% clear */}
            <div className="hidden md:flex flex-col items-center absolute left-[21%] lg:left-[24%] -top-12 lg:-top-14 z-20 -rotate-12 hover:rotate-0 transition-transform duration-700">
              <span className="font-display text-[10px] tracking-[0.22em] text-[#191D30] uppercase mb-2">
                {locCopy.tag1}
              </span>
              <div className="w-32 lg:w-40 aspect-[4/5] shadow-2xl border-4 border-white overflow-hidden bg-[#191D30]">
                <SmoothImage
                  src="/images/properties/villa-leonora/image00016.webp"
                  alt={locCopy.tag1}
                  containerClassName="w-full h-full rounded-none"
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
            </div>

            {/* Top-Right Tilted Floating Photo ("ISLAND DINING") */}
            <div className="hidden md:flex flex-col items-center absolute right-[10%] lg:right-[13%] -top-10 lg:-top-12 z-20 rotate-12 hover:rotate-0 transition-transform duration-700">
              <span className="font-display text-[10px] tracking-[0.22em] text-[#191D30] uppercase mb-2">
                {locCopy.tag2}
              </span>
              <div className="w-36 lg:w-44 aspect-[4/5] shadow-2xl border-4 border-white overflow-hidden bg-[#191D30]">
                <SmoothImage
                  src="/images/properties/andreas-house/image00006 (1).webp"
                  alt={locCopy.tag2}
                  containerClassName="w-full h-full rounded-none"
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
            </div>

            {/* Giant Center Display Word: "EXPERIENCE" (First 'E' completely visible) */}
            <h2 className="font-display text-[12.5vw] sm:text-[11vw] lg:text-[142px] leading-none tracking-[0.04em] text-[#191D30] uppercase select-none text-center z-10">
              {locCopy.experienceWord}
            </h2>

            {/* Lower Row: Left Poetic Caption + Center-Bottom Tilted Photo ("LA LUXURY STAY") */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 items-start mt-6 md:mt-4 relative z-20 gap-8">
              <div className="md:col-span-4 md:col-start-2 text-center md:text-left pt-3">
                <p className="font-body text-xs sm:text-[13px] text-[#191D30]/75 leading-relaxed whitespace-pre-line">
                  {locCopy.expCaption}
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col items-center md:-mt-8 rotate-6 md:rotate-12 hover:rotate-0 transition-transform duration-700">
                <div className="w-36 lg:w-44 aspect-[4/5] shadow-2xl border-4 border-white overflow-hidden bg-[#191D30] mb-2.5">
                  <SmoothImage
                    src="/images/properties/villa-leonora/image00008.webp"
                    alt={locCopy.tag3}
                    containerClassName="w-full h-full rounded-none"
                    className="w-full h-full object-cover rounded-none"
                  />
                </div>
                <span className="font-display text-[10px] tracking-[0.22em] text-[#191D30] uppercase">
                  {locCopy.tag3}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* PORTAL POPUP MODAL — ALWAYS OPENS IN THE EXACT MIDDLE OF SCREEN   */}
      {/* ================================================================= */}
      {showFacilitiesModal &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            onClick={() => setShowFacilitiesModal(false)}
            className="fixed inset-0 z-[9999] bg-[#191D30]/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-[#191D30] max-w-4xl w-full max-h-[82vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-[#191D30]/15 relative my-auto animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="sticky top-0 bg-white pb-4 mb-6 border-b border-[#191D30]/10 flex items-center justify-between z-10">
                <div>
                  <h3 className="font-display text-lg sm:text-2xl text-[#191D30]">
                    {locCopy.modalTitle}
                  </h3>
                  <p className="font-body text-xs text-[#191D30]/60 mt-0.5">
                    {locCopy.modalSub}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFacilitiesModal(false)}
                  className="w-9 h-9 rounded-full bg-[#FAF9F6] hover:bg-[#191D30] text-[#191D30] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X size={17} />
                </button>
              </div>

              {/* 3-Column Booking.com Style Facilities Sheet */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {modalColumns.map((col, colIndex) => (
                  <div key={colIndex} className="space-y-6">
                    {col.map((group, gIdx) => (
                      <div key={gIdx}>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-display text-sm font-bold text-[#191D30]">
                            {group.title}
                          </h4>
                          {group.badge && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-body text-[10px] font-semibold rounded">
                              {group.badge}
                            </span>
                          )}
                        </div>

                        {group.note && (
                          <p className="font-body text-xs text-[#191D30]/65 leading-relaxed mb-2">
                            {group.note}
                          </p>
                        )}

                        {group.items.length > 0 && (
                          <ul className="space-y-1.5">
                            {group.items.map((it, itemIdx) => (
                              <li
                                key={itemIdx}
                                className="flex items-start gap-2 font-body text-xs text-[#191D30]/80"
                              >
                                <Check
                                  size={13}
                                  className="text-[#A18E7E] shrink-0 mt-0.5"
                                />
                                <span>{it}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}