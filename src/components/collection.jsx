// src/components/Collection.jsx
import { ArrowRight, Check, Star } from 'lucide-react';
import { PROPERTIES, BRAND_ASSETS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

const SANCTUARY_DETAILS_ROWS = [
  {
    label: 'LOCATIONS ON TINOS',
    value: 'Arnados Hills & Agios Sostis Coast',
  },
  {
    label: 'ARCHITECTURAL STYLE',
    value: 'Hand-Quarried Tinos Stone & Cycladic Arches',
  },
  {
    label: 'ACCOMMODATIONS',
    value: '3 Private Sanctuaries (Up to 5 Guests Each)',
  },
  {
    label: 'BATHROOMS & SUITES',
    value: 'Ensuite Marble & Modern Walk-In Showers',
  },
  {
    label: 'PRIVATE POOL & BEACH',
    value: "Infinity Pool (Villa Leonora) · 12 Min Walk to Beach (Andrea's)",
  },
  {
    label: 'OUTDOOR SPACES',
    value: 'Panoramic Sun Terraces, Gardens & Alfresco BBQ',
  },
];

export default function Collection({ setView }) {
  const { t } = useLanguage();
  const propertiesList = Object.values(PROPERTIES);

  return (
    <section id="collection" className="py-28 md:py-36 bg-[#191D30] text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Top Header Row — Exact Match to Screenshot */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#A18E7E]" />
              <span className="font-body text-[10px] tracking-[0.3em] text-[#A18E7E] uppercase">
                ROOM / SUITE
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.04em] text-white leading-[1.18]">
              Elegantly <br />
              Curated Sanctuaries
            </h2>
          </div>

          <div className="max-w-md flex flex-col items-start">
            <p className="font-body font-light text-[13px] leading-[1.9] text-white/70 mb-6">
              Every residence is designed with comfort, Cycladic style, and sophistication to give you a truly unforgettable island stay.
            </p>
            <button
              onClick={() => setView('reserve')}
              className="group rounded-full bg-white text-[#191D30] px-7 py-3.5 font-body text-[10px] font-medium tracking-[0.24em] uppercase inline-flex items-center gap-3 hover:bg-[#A18E7E] hover:text-white transition-all duration-500 cursor-pointer"
            >
              <span>RESERVE A SANCTUARY</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* 3 Property Cards — Straight Square Photos (rounded-none) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
          {propertiesList.map((item) => (
            <div
              key={item.id}
              onClick={() => setView(item.id)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-[#111422]">
                <SmoothImage
                  src={item.coverImage}
                  alt={item.name}
                  containerClassName="w-full h-full rounded-none"
                  className="w-full h-full object-cover rounded-none transition-transform duration-[1800ms] group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#191D30]/95 via-[#191D30]/20 to-transparent" />

                {/* Top Right Rating Pill */}
                <div className="absolute top-4 right-4 rounded-full bg-[#191D30]/85 px-3.5 py-1.5 flex items-center gap-1.5 border border-white/15">
                  <Star size={10} className="text-[#A18E7E] fill-[#A18E7E]" />
                  <span className="font-body text-[10px] tracking-[0.15em] text-white">
                    {item.rating}
                  </span>
                </div>

                {/* Bottom Overlaid Property Text */}
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <span className="font-body text-[9.5px] tracking-[0.25em] text-[#A18E7E] uppercase block mb-1.5">
                    {item.location.split('·')[0]}
                  </span>
                  <h3 className="font-display text-2xl tracking-[0.03em] text-white mb-4">
                    {item.name}
                  </h3>

                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10.5px] font-body text-white/70">
                    <span>
                      {item.specs?.[0]?.value} · {item.specs?.[2]?.value}
                    </span>
                    <span className="text-white uppercase tracking-[0.2em] text-[9.5px] group-hover:text-[#A18E7E] transition-colors">
                      {t.collection.explore} →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section: "Sanctuary Details at a Glance" — Exact Layout from Screenshot 3 */}
        <div className="pt-20 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left 5 Cols: Straight Square Photo + 3 Checkmark Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-none">
              <SmoothImage
                src={BRAND_ASSETS.heroImage}
                alt="Sanctuary Pool View"
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-body text-white/75">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#A18E7E]">
                  <Check size={11} />
                </span>
                <span>Private Infinity Pool &amp; Sun Loungers at Villa Leonora</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-body text-white/75">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#A18E7E]">
                  <Check size={11} />
                </span>
                <span>12-Minute Stroll to Golden Sands at Andrea&apos;s Houses</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-body text-white/75">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#A18E7E]">
                  <Check size={11} />
                </span>
                <span>Complimentary Welcome Provisions &amp; On-Site Parking</span>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Sanctuary Details at a Glance Table */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-8 h-[1px] bg-[#A18E7E]" />
              <span className="font-body text-[10px] tracking-[0.3em] text-[#A18E7E] uppercase">
                DESIGNED FOR COMFORT &amp; STYLE
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-white tracking-[0.04em] mb-8">
              Sanctuary Details at a Glance
            </h3>

            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {SANCTUARY_DETAILS_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <span className="font-body text-[10px] tracking-[0.22em] text-white/50 uppercase">
                    {row.label}
                  </span>
                  <span className="font-body text-xs text-white/90 sm:text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}