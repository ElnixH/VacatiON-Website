// src/components/MediaHub.jsx
import { useState, useMemo } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { PROPERTIES, TINOS_ATTRACTIONS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

export default function MediaHub({ setView }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxImg, setLightboxImg] = useState(null);

  const tabs = [
    { id: 'all', label: t.mediaHub.allArchives },
    { id: 'tinos', label: t.mediaHub.tinosIsland },
    { id: 'villa-leonora', label: t.mediaHub.villaLeonora },
    { id: 'andreas-traditional', label: t.mediaHub.andreasTraditional },
    { id: 'andreas-two-bed', label: t.mediaHub.andreasTwoBed },
  ];

  const allPhotos = useMemo(() => {
    const tinosPhotos = [
      TINOS_ATTRACTIONS.hero,
      TINOS_ATTRACTIONS.intro,
      ...TINOS_ATTRACTIONS.villages.map((v) => v.image),
      ...TINOS_ATTRACTIONS.beaches.map((b) => b.image),
    ].map((src) => ({ src, category: 'tinos', title: t.mediaHub.tinosIsland }));

    const vlPhotos = (PROPERTIES['villa-leonora']?.gallery || []).map((src) => ({
      src,
      category: 'villa-leonora',
      title: t.mediaHub.villaLeonora,
    }));

    const tradPhotos = (PROPERTIES['andreas-traditional']?.gallery || []).map((src) => ({
      src,
      category: 'andreas-traditional',
      title: t.mediaHub.andreasTraditional,
    }));

    const twoBedPhotos = (PROPERTIES['andreas-two-bed']?.gallery || []).map((src) => ({
      src,
      category: 'andreas-two-bed',
      title: t.mediaHub.andreasTwoBed,
    }));

    return [...vlPhotos, ...tradPhotos, ...twoBedPhotos, ...tinosPhotos];
  }, [t]);

  const filteredPhotos = useMemo(() => {
    if (activeTab === 'all') return allPhotos;
    return allPhotos.filter((p) => p.category === activeTab);
  }, [activeTab, allPhotos]);

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-32 pb-32">
      <button
        onClick={() => setView && setView('home')}
        className="fixed top-24 left-6 md:left-12 p-2 group z-40 cursor-pointer"
        aria-label={t.mediaHub.backHome}
      >
        <ArrowLeft
          size={26}
          strokeWidth={1}
          className="text-[#191D30]/50 group-hover:text-[#191D30] transition-transform duration-500 group-hover:-translate-x-2"
        />
      </button>

      <div className="max-w-[1380px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-3xl md:text-5xl tracking-[0.35em] text-[#191D30] uppercase mb-6">
            {t.mediaHub.title}
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-6" />
          <p className="font-body text-[11px] tracking-[0.28em] text-[#191D30]/55 uppercase">
            {t.mediaHub.subtitle}
          </p>
        </div>

        {/* Translated Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 pb-10 mb-14 border-b border-[#191D30]/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-body text-[11px] tracking-[0.25em] uppercase pb-2 border-b transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'text-[#191D30] border-[#A18E7E] font-medium'
                  : 'text-[#191D30]/45 border-transparent hover:text-[#191D30]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Square-Edge Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((item, idx) => (
            <div
              key={`${item.src}-${idx}`}
              onClick={() => setLightboxImg(item.src)}
              className="group relative aspect-[4/3] w-full overflow-hidden bg-[#191D30]/5 cursor-pointer"
            >
              <SmoothImage
                src={item.src}
                alt={item.title}
                containerClassName="w-full h-full rounded-none"
                className="w-full h-full object-cover rounded-none transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-[#191D30]/95 flex items-center justify-center p-6"
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-8 right-8 text-white/70 hover:text-white cursor-pointer"
          >
            <X size={32} strokeWidth={1} />
          </button>
          <img
            src={lightboxImg}
            alt="Full Archive View"
            className="max-h-[88vh] max-w-[92vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}