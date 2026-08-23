import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';

export default function MediaHub({ setView }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const goHome = () => {
    setView('home');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Grouped media assets with categories
  const allPhotos = [
    // TINOS
    { src: "/tinos.webp", category: "Discover Tinos" },
    { src: "/tinos2.webp", category: "Discover Tinos" },
    { src: "/pyrgos.webp", category: "Discover Tinos" },
    { src: "/volax.webp", category: "Discover Tinos" },
    { src: "/kardiani.webp", category: "Discover Tinos" },
    { src: "/kolymbithra.webp", category: "Discover Tinos" },
    { src: "/agiossostis.webp", category: "Discover Tinos" },
    { src: "/pachia_ammos.webp", category: "Discover Tinos" },
    
    // VILLA LEONORA
    { src: "/image00016.webp", category: "Villa Leonora" },
    { src: "/image00001.webp", category: "Villa Leonora" },
    { src: "/image00002.webp", category: "Villa Leonora" },
    { src: "/image00003.webp", category: "Villa Leonora" },
    { src: "/image00004.webp", category: "Villa Leonora" },
    { src: "/image00005.webp", category: "Villa Leonora" },
    { src: "/image00006.webp", category: "Villa Leonora" },
    { src: "/image00007.webp", category: "Villa Leonora" },
    { src: "/image00008.webp", category: "Villa Leonora" },
    { src: "/image00009.webp", category: "Villa Leonora" },
    { src: "/image00010.webp", category: "Villa Leonora" },
    { src: "/image00011.webp", category: "Villa Leonora" },
    { src: "/image00012.webp", category: "Villa Leonora" },
    { src: "/image00013.webp", category: "Villa Leonora" },
    { src: "/image00014.webp", category: "Villa Leonora" },
    { src: "/image00015.webp", category: "Villa Leonora" },
    { src: "/image00017.webp", category: "Villa Leonora" },

    // ANDREA'S TRADITIONAL HOUSE
    { src: "/andreas-house/image00006 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00001 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00002 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00003 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00004 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00005 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00007 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00008 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00009 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00010 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00011 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00012 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00013 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00014 (1).webp", category: "Traditional House" },
    { src: "/andreas-house/image00015 (2).webp", category: "Traditional House" },

    // ANDREA'S TWO-BEDROOM HOUSE
    { src: "/andreas-house-two-bedroom/image00010 (2).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00011 (2).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00012 (2).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00013 (2).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00014 (2).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00015 (3).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00016 (2).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00017 (2).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00018 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00019 (3).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00020 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00021 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00022 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00023 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00024 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00025 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00026 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00027 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00028 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00029 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00030 (1).webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00031.webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00032.webp", category: "Two-Bedroom House" },
    { src: "/andreas-house-two-bedroom/image00033.webp", category: "Two-Bedroom House" }
  ];

  // List of categories for the filter menu
  const categories = ['All', 'Villa Leonora', 'Traditional House', 'Two-Bedroom House', 'Discover Tinos'];

  // Filter the photos based on the selected category
  const filteredPhotos = activeCategory === 'All' 
    ? allPhotos 
    : allPhotos.filter(photo => photo.category === activeCategory);

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
        <div className="text-center mb-16">
          <h1 className="font-display text-3xl md:text-5xl tracking-[0.3em] text-[#191D30] uppercase mb-8">
            Media Hub
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/50 uppercase">
            The Vacation Visual Archives
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`font-body text-[10px] tracking-[0.2em] uppercase transition-all duration-300 pb-2 border-b ${
                activeCategory === category 
                  ? 'text-[#191D30] border-[#A18E7E]' 
                  : 'text-[#191D30]/40 border-transparent hover:text-[#191D30] hover:border-[#191D30]/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredPhotos.map((photo, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden cursor-pointer break-inside-avoid bg-[#191D30]/5 animate-in fade-in zoom-in-95 duration-500"
              onClick={() => setSelectedImage(photo.src)}
            >
              <img 
                src={photo.src} 
                alt={`${photo.category} photo ${index + 1}`}
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