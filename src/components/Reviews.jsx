import { useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Star } from 'lucide-react';
import {
  BOOKING_REVIEWS,
  BRAND_ASSETS,
  PROPERTIES,
  useLanguage,
} from '../data/siteData';
import SmoothImage from './SmoothImage';

export default function Reviews() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllGrid, setShowAllGrid] = useState(false);

  const currentReview = BOOKING_REVIEWS[activeIndex] || BOOKING_REVIEWS[0];
  const linkedProperty =
    PROPERTIES[currentReview.propertyId] || PROPERTIES['villa-leonora'];

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + BOOKING_REVIEWS.length) % BOOKING_REVIEWS.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % BOOKING_REVIEWS.length);
  };

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Reference-Inspired Editorial Testimonial Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          {/* Left Sharp-Cornered Square/Portrait Photo */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-none bg-[#191D30]/5">
              <SmoothImage
                src={linkedProperty.coverImage}
                alt={currentReview.propertyName}
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#191D30]/90 to-transparent">
                <p className="font-body text-[10px] tracking-[0.25em] text-[#A18E7E] uppercase">
                  Verified Booking.com Score · {currentReview.score} / 10
                </p>
                <p className="font-display text-lg text-white tracking-[0.1em] uppercase mt-1">
                  {currentReview.propertyName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Editorial Quote Block with Circular Navigation Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-[#A18E7E]" />
                <span className="font-body text-[11px] tracking-[0.3em] text-[#A18E7E] uppercase">
                  {t.reviews.eyebrow}
                </span>
              </div>

              {/* Round Navigation Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full border border-[#191D30]/25 flex items-center justify-center text-[#191D30] hover:bg-[#191D30] hover:text-white transition-colors"
                  aria-label="Previous Review"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full border border-[#191D30]/25 flex items-center justify-center text-[#191D30] hover:bg-[#191D30] hover:text-white transition-colors"
                  aria-label="Next Review"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Large Quote Symbol */}
            <div className="font-display text-7xl leading-none text-[#191D30] select-none mb-4">
              “
            </div>

            {/* Vertical Line + Quote Text */}
            <div className="border-l-2 border-[#A18E7E] pl-6 md:pl-8 py-2 mb-8">
              <p className="font-body font-light text-lg md:text-2xl text-[#191D30] leading-[1.7] mb-6">
                {currentReview.text}
              </p>

              <div>
                <p className="font-display text-base tracking-[0.15em] text-[#191D30] uppercase">
                  {currentReview.guest}
                </p>
                <p className="font-body text-[11px] tracking-[0.15em] text-[#191D30]/60 uppercase mt-1">
                  {currentReview.country} · {currentReview.travelerType}
                </p>
              </div>
            </div>

            {/* Pill Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#191D30]/10">
              <button
                onClick={() => setShowAllGrid((prev) => !prev)}
                className="rounded-full px-7 py-3.5 border border-[#191D30] text-[#191D30] font-body text-[10px] tracking-[0.22em] uppercase hover:bg-[#191D30] hover:text-white transition-all duration-500"
              >
                {showAllGrid ? t.reviews.showLess : t.reviews.showMore}
              </button>

              <a
                href={BRAND_ASSETS.bookingReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-7 py-3.5 bg-[#191D30] text-white font-body text-[10px] tracking-[0.22em] uppercase inline-flex items-center gap-2 hover:bg-[#A18E7E] transition-all duration-500"
              >
                <span>{t.reviews.openWindow}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Expandable Full Reviews Grid (Sharp Rectangular Cards) */}
        {showAllGrid && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#191D30]/10 animate-in fade-in duration-500">
            {BOOKING_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="p-8 bg-[#FAF9F6] border border-[#191D30]/10 rounded-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-body text-[10px] tracking-[0.2em] text-[#A18E7E] uppercase">
                      {review.propertyName}
                    </span>
                    <span className="inline-flex items-center gap-1 font-body text-xs font-medium text-[#191D30]">
                      <Star size={12} className="fill-[#A18E7E] text-[#A18E7E]" />
                      {review.score} / 10
                    </span>
                  </div>
                  <h4 className="font-display text-sm tracking-[0.12em] text-[#191D30] uppercase mb-3">
                    “{review.title}”
                  </h4>
                  <p className="font-body font-light text-[13px] leading-[1.9] text-[#191D30]/80 mb-6">
                    {review.text}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#191D30]/10">
                  <p className="font-display text-xs tracking-[0.15em] text-[#191D30] uppercase">
                    {review.guest}
                  </p>
                  <p className="font-body text-[10px] tracking-[0.12em] text-[#191D30]/55 uppercase mt-0.5">
                    {review.country} · {review.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}