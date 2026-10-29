// src/components/Reviews.jsx
import { useState, useMemo } from 'react';
import { Star, ExternalLink, ArrowUpRight, Plus, Check } from 'lucide-react';
import {
  BRAND_ASSETS,
  PROPERTIES,
  useLanguage,
  getLocalizedReviews,
  getLocalizedProperty,
} from '../data/siteData';

const BOOKING_MENTION_TOPICS = {
  en: [
    { id: 'all', label: 'All Reviews', count: 104, keywords: [] },
    { id: 'views', label: 'Aegean & Island Views', count: 38, keywords: ['view', 'island', 'infinity', 'panorama'] },
    { id: 'host', label: 'Host & Hospitality', count: 44, keywords: ['host', 'hospitality', 'welcomed', 'fantastic', 'care'] },
    { id: 'clean', label: 'Spotless Cleanliness', count: 36, keywords: ['clean', 'spotless', 'lovely'] },
    { id: 'pool', label: 'Infinity Pool & Terrace', count: 29, keywords: ['pool', 'terrace', 'bubbly'] },
    { id: 'comfort', label: 'Comfort & Beds', count: 31, keywords: ['comfortable', 'amenities', 'ensuite', 'layout'] },
    { id: 'location', label: 'Peaceful Location', count: 27, keywords: ['beach', 'town', 'peace', 'quiet', 'arnados'] },
  ],
  it: [
    { id: 'all', label: 'Tutte le Recensioni', count: 104, keywords: [] },
    { id: 'views', label: 'Vista Mare e Isole', count: 38, keywords: ['vista', 'isole', 'sfioro'] },
    { id: 'host', label: 'Host e Ospitalità', count: 44, keywords: ['host', 'ospitalità', 'accolto', 'fantastico'] },
    { id: 'clean', label: 'Pulizia Impeccabile', count: 36, keywords: ['pulit', 'incantevole', 'impeccabil'] },
    { id: 'pool', label: 'Piscina Infinity', count: 29, keywords: ['piscina', 'terrazza', 'bollicine'] },
    { id: 'comfort', label: 'Comfort e Camere', count: 31, keywords: ['confortevole', 'servizi', 'bagno', 'layout'] },
    { id: 'location', label: 'Posizione Tranquilla', count: 27, keywords: ['spiaggia', 'chora', 'pace', 'arnados'] },
  ],
  el: [
    { id: 'all', label: 'Όλες οι Κριτικές', count: 104, keywords: [] },
    { id: 'views', label: 'Θέα στο Αιγαίο', count: 38, keywords: ['θέα', 'νησιά', 'infinity'] },
    { id: 'host', label: 'Οικοδεσπότες & Φιλοξενία', count: 44, keywords: ['οικοδεσπότ', 'φιλοξενία', 'υποδέχθηκαν'] },
    { id: 'clean', label: 'Άψογη Καθαριότητα', count: 36, keywords: ['καθαρ', 'υπέροχη'] },
    { id: 'pool', label: 'Πισίνα Infinity & Βεράντα', count: 29, keywords: ['πισίνα', 'βεράντα'] },
    { id: 'comfort', label: 'Άνεση & Παροχές', count: 31, keywords: ['άνετ', 'παροχές', 'υπνοδωμάτια'] },
    { id: 'location', label: 'Ήσυχη Τοποθεσία', count: 27, keywords: ['παραλία', 'χώρα', 'Αρνάδο'] },
  ],
};

export default function Reviews() {
  const { lang, t } = useLanguage();
  const [activeMention, setActiveMention] = useState('all');

  const localizedReviews = getLocalizedReviews(lang);
  const mentionTopics = BOOKING_MENTION_TOPICS[lang] || BOOKING_MENTION_TOPICS.en;

  const filteredReviews = useMemo(() => {
    if (activeMention === 'all') return localizedReviews;
    const topicObj = mentionTopics.find((m) => m.id === activeMention);
    if (!topicObj || !topicObj.keywords.length) return localizedReviews;

    const matches = localizedReviews.filter((r) => {
      const combined = `${r.text} ${r.title} ${r.highlight}`.toLowerCase();
      return topicObj.keywords.some((kw) => combined.includes(kw.toLowerCase()));
    });

    return matches.length > 0 ? matches : localizedReviews;
  }, [activeMention, localizedReviews, mentionTopics]);

  // Ensure enough cards for continuous marquee movement
  const marqueeRow1 = [...filteredReviews, ...filteredReviews, ...filteredReviews];
  const marqueeRow2 = [
    ...filteredReviews.slice().reverse(),
    ...filteredReviews.slice().reverse(),
    ...filteredReviews.slice().reverse(),
  ];

  const headlineTop =
    lang === 'el'
      ? 'Λόγια εκτίμησης από επισκέπτες'
      : lang === 'it'
      ? 'Parole di apprezzamento da chi'
      : 'Words of praise from guests';

  const headlineAccent =
    lang === 'el'
      ? 'που έζησαν την εμπειρία μας'
      : lang === 'it'
      ? 'ha vissuto le nostre dimore'
      : 'who experienced our sanctuaries';

  const mentionsTitle =
    lang === 'el'
      ? 'Επιλέξτε θέμα για να διαβάσετε κριτικές:'
      : lang === 'it'
      ? 'Seleziona gli argomenti per leggere le recensioni:'
      : 'Select topics to read verified Booking.com reviews:';

  return (
    <section
      id="reviews"
      className="py-24 md:py-32 bg-[#FAF9F6] text-[#191D30] overflow-hidden relative"
    >
      {/* Continuous Marquee Keyframes — Never stops moving */}
      <style>{`
        @keyframes vacationMarqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes vacationMarqueeRight {
          0% { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          display: flex;
          width: max-content;
          animation: vacationMarqueeLeft 44s linear infinite;
          will-change: transform;
        }
        .animate-marquee-right {
          display: flex;
          width: max-content;
          animation: vacationMarqueeRight 48s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="max-w-[1380px] mx-auto px-6 md:px-12 mb-14">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#191D30] text-white px-4 py-2 shadow-sm mb-6">
            <Star size={12} className="fill-[#A18E7E] text-[#A18E7E]" />
            <span className="font-body text-[10px] tracking-[0.2em] uppercase">
              {t.reviews.eyebrow}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.15] tracking-[0.01em] mb-6">
            <span className="text-[#191D30] block">{headlineTop}</span>
            <span className="text-[#A18E7E] block">{headlineAccent}</span>
          </h2>
        </div>

        {/* Booking.com-Style "Guest Mentions" Filter Pills */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-[11px] tracking-[0.18em] text-[#191D30]/55 uppercase mb-4">
            {mentionsTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {mentionTopics.map((topic) => {
              const isSelected = activeMention === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setActiveMention(topic.id)}
                  className={`rounded-full px-4 py-2 font-body text-xs inline-flex items-center gap-1.5 border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#191D30] text-white border-[#191D30] shadow-sm'
                      : 'bg-white text-[#191D30]/80 border-[#191D30]/15 hover:border-[#A18E7E]'
                  }`}
                >
                  {isSelected ? (
                    <Check size={12} className="text-[#A18E7E]" />
                  ) : (
                    <Plus size={12} className="text-[#A18E7E]" />
                  )}
                  <span>{topic.label}</span>
                  <span
                    className={`text-[10px] ml-0.5 ${
                      isSelected ? 'text-[#A18E7E]' : 'text-[#191D30]/45'
                    }`}
                  >
                    ({topic.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dual-Row Non-Stopping Marquee — Clicking ANY Square Redirects to Booking.com Reviews */}
      <div className="relative space-y-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-28 bg-gradient-to-r from-[#FAF9F6] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-28 bg-gradient-to-l from-[#FAF9F6] to-transparent z-20" />

        {/* Row 1: Moving Left */}
        <div className="overflow-hidden">
          <div className="animate-marquee-left gap-6 px-3">
            {marqueeRow1.map((rev, idx) => {
              const prop =
                (typeof getLocalizedProperty === 'function'
                  ? getLocalizedProperty(rev.propertyId, lang)
                  : PROPERTIES[rev.propertyId]) || PROPERTIES['villa-leonora'];
              const targetBookingUrl =
                prop.reviewsLink || prop.bookingLink || BRAND_ASSETS.bookingReviewsUrl;

              return (
                <a
                  key={`r1-${rev.id}-${idx}`}
                  href={targetBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-[340px] sm:w-[400px] shrink-0 bg-white border border-[#191D30]/10 p-7 shadow-2xs hover:shadow-lg hover:border-[#A18E7E] transition-all duration-300 flex flex-col justify-between cursor-pointer text-left select-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-4xl leading-none text-[#A18E7E]">
                        “
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF9F6] border border-[#191D30]/10 px-2.5 py-1 font-body text-[10px] font-semibold text-[#191D30]">
                        <Star size={10} className="fill-[#A18E7E] text-[#A18E7E]" />
                        {rev.score} / 10
                      </span>
                    </div>

                    <p className="font-body font-light text-[13px] leading-[1.8] text-[#191D30]/80 mb-6 line-clamp-4 group-hover:text-[#191D30] transition-colors">
                      {rev.text}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#191D30]/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#191D30] text-[#A18E7E] font-display text-xs font-semibold flex items-center justify-center shrink-0">
                        {rev.avatar || rev.guest.charAt(0)}
                      </div>
                      <div>
                        <p className="font-display text-xs tracking-[0.12em] text-[#191D30] uppercase">
                          {rev.guest}
                        </p>
                        <p className="font-body text-[10px] text-[#191D30]/50 truncate max-w-[180px]">
                          {rev.country} · {prop.name}
                        </p>
                      </div>
                    </div>

                    <span
                      title="Open on Booking.com"
                      className="w-8 h-8 rounded-full bg-[#FAF9F6] group-hover:bg-[#191D30] text-[#191D30] group-hover:text-white flex items-center justify-center transition-colors shrink-0"
                    >
                      <ExternalLink size={12} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Row 2: Moving Right */}
        <div className="overflow-hidden">
          <div className="animate-marquee-right gap-6 px-3">
            {marqueeRow2.map((rev, idx) => {
              const prop =
                (typeof getLocalizedProperty === 'function'
                  ? getLocalizedProperty(rev.propertyId, lang)
                  : PROPERTIES[rev.propertyId]) || PROPERTIES['villa-leonora'];
              const targetBookingUrl =
                prop.reviewsLink || prop.bookingLink || BRAND_ASSETS.bookingReviewsUrl;

              return (
                <a
                  key={`r2-${rev.id}-${idx}`}
                  href={targetBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-[340px] sm:w-[400px] shrink-0 bg-white border border-[#191D30]/10 p-7 shadow-2xs hover:shadow-lg hover:border-[#A18E7E] transition-all duration-300 flex flex-col justify-between cursor-pointer text-left select-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-4xl leading-none text-[#A18E7E]">
                        “
                      </span>
                      <span className="font-body text-[9.5px] tracking-[0.18em] text-[#A18E7E] uppercase">
                        {rev.highlight}
                      </span>
                    </div>

                    <p className="font-body font-light text-[13px] leading-[1.8] text-[#191D30]/80 mb-6 line-clamp-4 group-hover:text-[#191D30] transition-colors">
                      {rev.text}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#191D30]/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#A18E7E]/20 border border-[#A18E7E]/40 text-[#191D30] font-display text-xs font-semibold flex items-center justify-center shrink-0">
                        {rev.avatar || rev.guest.charAt(0)}
                      </div>
                      <div>
                        <p className="font-display text-xs tracking-[0.12em] text-[#191D30] uppercase">
                          {rev.guest}
                        </p>
                        <p className="font-body text-[10px] text-[#191D30]/50 truncate max-w-[180px]">
                          {rev.country} · {prop.name}
                        </p>
                      </div>
                    </div>

                    <span
                      title="Open on Booking.com"
                      className="w-8 h-8 rounded-full bg-[#FAF9F6] group-hover:bg-[#191D30] text-[#191D30] group-hover:text-white flex items-center justify-center transition-colors shrink-0"
                    >
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}