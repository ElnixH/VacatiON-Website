// src/components/About.jsx
import { ArrowRight } from 'lucide-react';
import { BRAND_ASSETS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

export default function About({ setView }) {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 md:py-32 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          {/* Left Column: Editorial Text + Pill Button + 3 Stat Counters */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-[1px] bg-[#A18E7E]" />
              <span className="font-body text-[10px] tracking-[0.3em] text-[#A18E7E] uppercase">
                ABOUT
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-[0.04em] text-[#191D30] leading-[1.18] mb-8">
              Experience <br />
              Unmatched Luxury
            </h2>

            <div className="font-body font-light text-[13.5px] leading-[2] text-[#191D30]/75 mb-10 space-y-5 max-w-lg">
              <p>
                Vacation offers guests an unparalleled Cycladic sanctuary experience on Tinos Island, blending modern comfort with timeless Aegean sophistication.
              </p>
              <p>
                We believe true luxury is found in the silent intervals—the play of sunlight on Tinos stone, crisp organic linens, and the privacy of a space designed around the horizon.
              </p>
            </div>

            {/* Pill Button */}
            <button
              onClick={() => setView('contact')}
              className="group rounded-full px-8 py-3.5 border border-[#191D30]/30 text-[#191D30] font-body text-[10px] tracking-[0.25em] uppercase inline-flex items-center gap-3 hover:bg-[#191D30] hover:text-white transition-all duration-500 mb-16 cursor-pointer"
            >
              <span>DISCOVER MORE</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            {/* 3 Stat Figures from Screenshot 4 */}
            <div className="w-full grid grid-cols-3 gap-6 pt-10 border-t border-[#191D30]/10">
              <div>
                <p className="font-display text-3xl md:text-4xl text-[#191D30] mb-1.5">
                  100%
                </p>
                <p className="font-body text-[9px] tracking-[0.2em] text-[#191D30]/50 uppercase">
                  NATURAL SURROUNDINGS
                </p>
              </div>

              <div>
                <p className="font-display text-3xl md:text-4xl text-[#191D30] mb-1.5">
                  10 MIN
                </p>
                <p className="font-body text-[9px] tracking-[0.2em] text-[#191D30]/50 uppercase">
                  TO TINOS CHORA &amp; PORT
                </p>
              </div>

              <div>
                <p className="font-display text-3xl md:text-4xl text-[#191D30] mb-1.5">
                  11
                </p>
                <p className="font-body text-[9px] tracking-[0.2em] text-[#191D30]/50 uppercase">
                  ISLAND AEGEAN VIEWS
                </p>
              </div>
            </div>xa
          </div>

          {/* Right Column: Straight Square Photo (rounded-none) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-none group">
              <SmoothImage
                src={BRAND_ASSETS.aboutImage}
                alt="Villa Leonora Architecture"
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none transform transition-transform duration-[2000ms] group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}