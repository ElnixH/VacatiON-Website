import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertyPage({ view, setView }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const goHome = () => {
    setIsLoaded(false);
    setTimeout(() => {
      setView('home');
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const properties = {
    'andreas-house': {
      name: "Andrea's House",
      subtitle: "A Traditional Cycladic Haven",
      description: "Nestled in the authentic heart of Tinos, Andrea's House is a beautifully restored sanctuary that perfectly balances ancient Cycladic architecture with refined, modern luxury. Experience the absolute serenity of island living, surrounded by history and elegance.",
      bookingLink: "https://www.booking.com/hotel/gr/andrea-39-s-tinos-house.en-gb.html?aid=898224&app_hotel_id=1487398&checkin=2026-05-09&checkout=2026-05-22&from_sn=ios&group_adults=2&group_children=0&label=hotel_details-0M51VjQ%401777533327&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA%2C",
      gallery: [
        "/andreas-house/image00006 (1).webp", 
        "/andreas-house/image00001 (1).webp", "/andreas-house/image00002 (1).webp", 
        "/andreas-house/image00003 (1).webp", "/andreas-house/image00004 (1).webp", 
        "/andreas-house/image00005 (1).webp", "/andreas-house/image00007 (1).webp", 
        "/andreas-house/image00008 (1).webp", "/andreas-house/image00009 (1).webp", 
        "/andreas-house/image00010 (1).webp", "/andreas-house/image00011 (1).webp", 
        "/andreas-house/image00012 (1).webp", "/andreas-house/image00013 (1).webp", 
        "/andreas-house/image00014 (1).webp", "/andreas-house/image00015 (2).webp", 
        "/andreas-house/image00016 (1).webp", "/andreas-house/image00017 (1).webp", 
        "/andreas-house/image00018.webp", "/andreas-house/image00019.webp", 
        "/andreas-house/image00020.webp", "/andreas-house/image00021.webp", 
        "/andreas-house/image00022.webp", "/andreas-house/image00023.webp", 
        "/andreas-house/image00024.webp", "/andreas-house/image00025.webp", 
        "/andreas-house/image00026.webp", "/andreas-house/image00027.webp", 
        "/andreas-house/image00028.webp", "/andreas-house/image00029.webp", 
        "/andreas-house/image00030.webp"
      ]
    },
    'villa-leonora': {
      name: "Villa Leonora",
      subtitle: "The Ultimate Coastal Retreat",
      description: "Villa Leonora offers an unparalleled experience of the Aegean. Designed for those who seek absolute privacy and breathtaking views, this spectacular villa provides a seamless indoor-outdoor living experience, bathed in the famous Grecian light.",
      bookingLink: "https://www.booking.com/hotel/gr/villa-leonora-tinos.en-gb.html?aid=898224&app_hotel_id=7701258&checkin=2026-05-14&checkout=2026-05-15&from_sn=ios&group_adults=2&group_children=0&label=hotel_details-KNEigd4%401777400372&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA%2C",
      gallery: [
        "/image00016.webp", 
        "/image00001.webp", "/image00002.webp", "/image00003.webp",
        "/image00004.webp", "/image00005.webp", "/image00006.webp",
        "/image00007.webp", "/image00008.webp", "/image00009.webp",
        "/image00010.webp", "/image00011.webp", "/image00012.webp",
        "/image00013.webp", "/image00014.webp", "/image00015.webp",
        "/image00017.webp"
      ]
    }
  };

  const property = properties[view];

  useEffect(() => {
    setCurrentImageIndex(0);
    const timer = setTimeout(() => setIsLoaded(true), 100); 
    return () => clearTimeout(timer);
  }, [view]);

  if (!property) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.gallery.length) % property.gallery.length);
  };

  return (
    <div className={`relative min-h-screen bg-[#FAF9F6] pt-32 pb-32 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      <style>{`
        @keyframes subtleZoom {
          0% { opacity: 0.6; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-gallery-image {
          animation: subtleZoom 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Back navigation */}
      <button 
        onClick={goHome}
        className={`fixed top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center z-50 transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
        aria-label="Return to Home"
      >
        <ArrowLeft 
          size={28} 
          strokeWidth={1} 
          className="text-[#191D30]/40 group-hover:text-[#191D30] group-hover:-translate-x-2 transition-all duration-500" 
        />
      </button>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Image gallery */}
          <div className={`relative aspect-[4/5] w-full overflow-hidden group bg-[#191D30]/5 transition-all duration-1000 delay-100 ${isLoaded ? 'translate-y-0 opacity-100 shadow-2xl' : 'translate-y-12 opacity-0'}`}>
            
            <img 
              key={currentImageIndex}
              src={property.gallery[currentImageIndex]} 
              alt={`${property.name} - View ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover animate-gallery-image"
            />
            
            {property.gallery.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button 
                    onClick={prevImage}
                    className="p-3 bg-white/70 backdrop-blur-md rounded-full text-[#191D30] hover:bg-white transition-all hover:scale-110 active:scale-95 shadow-lg"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="p-3 bg-white/70 backdrop-blur-md rounded-full text-[#191D30] hover:bg-white transition-all hover:scale-110 active:scale-95 shadow-lg"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </button>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-[#191D30]/80 backdrop-blur-md rounded-full transform transition-transform duration-500 hover:scale-105 cursor-default">
                  <p className="font-display text-[9px] tracking-[0.4em] text-white">
                    {currentImageIndex + 1} / {property.gallery.length}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Text content */}
          <div className="flex flex-col items-start">
            
            <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="font-display text-4xl md:text-5xl tracking-[0.2em] text-[#191D30] uppercase mb-4">
                {property.name}
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="font-body text-[11px] tracking-[0.3em] text-[#A18E7E] uppercase mb-8">
                {property.subtitle}
              </p>
            </div>
            
            <div className={`h-[1px] bg-[#A18E7E] mb-10 transition-all duration-1000 delay-[400ms] ${isLoaded ? 'w-12 opacity-100' : 'w-0 opacity-0'}`} />
            
            <div className={`transition-all duration-1000 delay-[500ms] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="font-body font-light text-[14px] md:text-[15px] leading-[2.2] text-[#191D30]/80 mb-16 max-w-md">
                {property.description}
              </p>
            </div>

            <div className={`transition-all duration-1000 delay-[600ms] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <a 
                href={property.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-10 py-5 border border-[#191D30] overflow-hidden transition-all duration-500 hover:border-[#A18E7E]"
              >
                <div className="absolute inset-0 w-0 bg-[#A18E7E] transition-all duration-[800ms] ease-out group-hover:w-full" />
                <span className="relative z-10 text-[#191D30] group-hover:text-white font-body text-[10px] tracking-[0.3em] uppercase transition-colors duration-500">
                  Check Availability
                </span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}