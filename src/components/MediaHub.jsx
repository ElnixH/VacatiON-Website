import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';

export default function MediaHub({ setView }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const goHome = () => {
    setView('home');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // media assets
  const allPhotos = [
    // tinos
    "/tinos.webp", "/tinos2.webp", "/pyrgos.webp", "/volax.webp", 
    "/kardiani.webp", "/kolymbithra.webp", "/agiossostis.webp", "/pachia_ammos.webp",
    // architecture
    "/image00002.webp", "/image00003.webp", "/image00008.webp", "/image00009.webp",
    // villa leonora
    "/image00001.webp", "/image00002.webp", "/image00003.webp", "/image00004.webp", 
    "/image00005.webp", "/image00006.webp", "/image00007.webp", "/image00008.webp", 
    "/image00009.webp", "/image00010.webp", "/image00011.webp", "/image00012.webp", 
    "/image00013.webp", "/image00014.webp", "/image00015.webp", "/image00016.webp", 
    "/image00017.webp",
    // andrea's house (subset for performance)
    "/andreas-house/image00006 (1).webp", "/andreas-house/image00001 (1).webp", 
    "/andreas-house/image00002 (1).webp", "/andreas-house/image00005 (1).webp", 
    "/andreas-house/image00009 (1).webp", "/andreas-house/image00013 (1).webp",
    "/andreas-house/image00015 (2).webp", "/andreas-house/image00018.webp",
    "/andreas-house/image00022.webp", "/andreas-house/image00027.webp"
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-32 pb-32">
      
      {/* back navigation */}
      <button 
        onClick={goHome}
        className="fixed top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center transition-all duration-500 z-40"
      >
        <ArrowLeft 
          size={28} 
          strokeWidth={1} 
          className="text-[#191D30]/40 group-hover:text-[#191D30] group-hover:-translate-x-2 transition-all duration-500" 
        />
      </button>

      {/* fullscreen modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#191D30]/95 backdrop-blur-md p-4 animate-in fade-in duration-500">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50"
          >
            <X size={36} strokeWidth={1} />
          </button>
          <img 
            src={selectedImage} 
            alt="Expanded view" 
            className="max-w-full max-h-[90vh] object-contain shadow-2xl animate-in zoom-in-95 duration-500"
          />
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* page header */}
        <div className="text-center mb-24">
          <h1 className="font-display text-3xl md:text-5xl tracking-[0.3em] text-[#191D30] uppercase mb-8">
            Media Hub
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/50 uppercase">
            The VacatiON Visual Archives
          </p>
        </div>

        {/* masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {allPhotos.map((photo, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden cursor-pointer break-inside-avoid bg-[#191D30]/5"
              onClick={() => setSelectedImage(photo)}
            >
              <img 
                src={photo} 
                alt={`Gallery photo ${index + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transform transition-transform duration-[2000ms] group-hover:scale-105"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 bg-[#191D30]/0 group-hover:bg-[#191D30]/20 transition-colors duration-500" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}