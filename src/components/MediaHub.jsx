import { useState, useMemo } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { PROPERTIES, TINOS_ATTRACTIONS } from '../data/siteData';
import SmoothImage from './SmoothImage';

const CATEGORIES = [
  { id: 'all', label: 'All Archives' },
  { id: 'tinos', label: 'Tinos Island' },
  { id: 'villa-leonora', label: 'Villa Leonora' },
  { id: 'andreas-traditional', label: "Andrea's Traditional" },
  { id: 'andreas-two-bed', label: "Andrea's Two-Bedroom" },
];

export default function MediaHub({ setView }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categorizedPhotos = useMemo(() => {
    const tinosPhotos = [
      TINOS_ATTRACTIONS.hero,
      TINOS_ATTRACTIONS.intro,
      ...TINOS_ATTRACTIONS.villages.map((v) => v.image),
      ...TINOS_ATTRACTIONS.beaches.map((b) => b.image),
    ].map((src) => ({ src, category: 'tinos' }));

    const leonoraPhotos = PROPERTIES['villa-leonora'].gallery.map((src) => ({
      src,
      category: 'villa-leonora',
    }));

    const andreasTradPhotos = PROPERTIES['andreas-traditional'].gallery
      .slice(0, 12)
      .map((src) => ({
        src,
        category: 'andreas-traditional',
      }));

    const andreasTwoBedPhotos = PROPERTIES['andreas-two-bed'].gallery
      .slice(0, 12)
      .map((src) => ({
        src,
        category: 'andreas-two-bed',
      }));

    if (activeCategory === 'tinos') return tinosPhotos;
    if (activeCategory === 'villa-leonora') return leonoraPhotos;
    if (activeCategory === 'andreas-traditional') return andreasTradPhotos;
    if (activeCategory === 'andreas-two-bed') return andreasTwoBedPhotos;

    return [
      ...tinosPhotos,
      ...leonoraPhotos,
      ...andreasTradPhotos,
      ...andreasTwoBedPhotos,
    ];
  }, [activeCategory]);

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-32 pb-32">
      <button
        onClick={() => setView('home')}
        className="fixed top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center transition-all duration-500 z-40"
        aria-label="Return to Home"
      >
        <ArrowLeft
          size={28}
          strokeWidth={1}
          className="text-[#191D30]/40 group-hover:text-[#191D30] group-hover:-translate-x-2 transition-all duration-500"
        />
      </button>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#191D30]/95 backdrop-blur-md p-4 animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50"
            aria-label="Close preview"
          >
            <X size={36} strokeWidth={1} />
          </button>
          <img
            src={selectedImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h1 className="font-display text-3xl md:text-5xl tracking-[0.3em] text-[#191D30] uppercase mb-8">
            Media Hub
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/50 uppercase mb-12">
            The Vacation Visual Archives
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 border-b border-[#191D30]/10 pb-6 max-w-3xl mx-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`font-body text-[10px] tracking-[0.25em] uppercase pb-2 transition-all duration-300 border-b ${
                  activeCategory === cat.id
                    ? 'text-[#191D30] border-[#A18E7E]'
                    : 'text-[#191D30]/40 border-transparent hover:text-[#191D30]/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {categorizedPhotos.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="relative group overflow-hidden cursor-pointer break-inside-avoid bg-[#191D30]/5"
              onClick={() => setSelectedImage(item.src)}
            >
              <SmoothImage
                src={item.src}
                alt={`Gallery photo ${index + 1}`}
                className="w-full h-auto object-cover transform transition-transform duration-[2000ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#191D30]/0 group-hover:bg-[#191D30]/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}