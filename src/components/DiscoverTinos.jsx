import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';

export default function DiscoverTinos({ setView }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pb-32">
      
      {/* Return nav */}
      <button 
        onClick={goHome}
        className="fixed top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center transition-all duration-500 z-50 mix-blend-difference"
        aria-label="Return to Home"
      >
        <ArrowLeft 
          size={28} 
          strokeWidth={1} 
          className="text-white group-hover:-translate-x-2 transition-all duration-500" 
        />
      </button>

      {/* Location details modal */}
      {selectedLocation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-[#191D30]/80 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setSelectedLocation(null)}
          />
          
          <div className="relative bg-[#FAF9F6] w-full max-w-2xl shadow-2xl p-3 md:p-5 animate-in fade-in zoom-in duration-700">
            <div className="relative border border-[#A18E7E]/30 bg-[#FDFBF7] p-10 md:p-16 shadow-inner">
              
              <button 
                onClick={() => setSelectedLocation(null)}
                className="absolute top-6 right-6 z-10 p-2 text-[#A18E7E] hover:text-[#191D30] transition-colors"
              >
                <X size={24} strokeWidth={1} />
              </button>

              <div className="text-center mb-10">
                <span className="font-display text-[9px] tracking-[0.4em] text-[#A18E7E] uppercase border-b border-[#A18E7E]/30 pb-2">
                  From the Archives of Tinos
                </span>
              </div>
              
              <div className="text-center mb-10">
                <h3 className="font-display text-3xl md:text-4xl tracking-[0.2em] text-[#191D30] uppercase mb-4">
                  {selectedLocation.name}
                </h3>
                <p className="font-display italic text-[16px] text-[#A18E7E]">
                  ~ {selectedLocation.subtitle} ~
                </p>
              </div>
              
              <div className="font-body font-light text-[14px] md:text-[15px] leading-[2.4] text-[#191D30]/85 text-center space-y-6 max-w-lg mx-auto">
                <p>{selectedLocation.info}</p>
                <p>{selectedLocation.moreInfo}</p>
              </div>

              <div className="mt-16 text-center">
                <div className="w-12 h-[1px] bg-[#A18E7E]/40 mx-auto mb-4" />
                <span className="font-display italic text-[18px] text-[#191D30]/60">
                  VacatiON
                </span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#191D30]">
          <img 
            src="/tinos.webp" 
            alt="Tinos Island Landscape" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#191D30]/40 via-transparent to-[#FAF9F6]" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl mt-20">
          <h1 className="font-display text-4xl md:text-6xl tracking-[0.4em] text-white uppercase mb-8 drop-shadow-lg">
            Tinos
          </h1>
          <p className="font-body text-[13px] md:text-[15px] leading-[2] tracking-[0.2em] text-white/90 uppercase">
            The hidden muse of the Cyclades. <br/> A sanctuary of marble, wind, and wild beauty.
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl tracking-[0.2em] text-[#191D30] uppercase mb-8">
          Raw & Authentic
        </h2>
        <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
        <p className="font-body font-light text-[14px] md:text-[16px] leading-[2.2] text-[#191D30]/80">
          Exquisite slow living, rich culinary traditions, and an unforgettable spiritual heritage are just the start of what this legendary, untouched Greek island offers to those who seek true luxury.
        </p>
      </section>

      {/* Intro */}
      <section className="py-20 px-6 md:px-12 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-display text-[14px] tracking-[0.3em] text-[#A18E7E] uppercase mb-6">
            Welcome to the Island
          </h2>
          <div className="font-body font-light text-[13px] md:text-[14px] leading-[2.2] text-[#191D30]/80 space-y-6">
            <p>
              Tinos, an island-phenomenon whose reputation is kept as a secret among artists and connoisseurs. Located in the heart of the Cyclades, it embodies a laid-back, grounded glamour not found anywhere else in the world.
            </p>
            <p>
              On this island, all your senses seem magnified, a product of its many contrasts: the lush terraced hills against the stark, wind-sculpted granite boulders of Volax, and the intricate marble artistry woven into the sleek, minimal Cycladic lines of its villages. 
            </p>
            <p>
              If it has always been your dream to experience the authentic Greek soul, away from the crowds, here is just the start of what awaits you.
            </p>
          </div>
        </div>
        <div className="aspect-[3/4] bg-[#191D30]/5">
           <img src="/tinos2.webp" alt="Tinos details" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700"/>
        </div>
      </section>

      {/* Villages grid */}
      <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
        <h2 className="font-display text-[18px] tracking-[0.3em] text-[#191D30] uppercase mb-12 text-center">
          Famous Villages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div 
            className="group cursor-pointer"
            onClick={() => setSelectedLocation({
              name: 'Pyrgos',
              subtitle: 'The Marble Heart',
              info: 'The cultural center of marble art in Greece. Wander through streets where every facade, fountain, and doorway is intricately sculpted by generations of master craftsmen.',
              moreInfo: 'It is the birthplace of legend Giannoulis Halepas. Spend your afternoon beneath the ancient plane tree in the main square, savoring traditional galaktoboureko as the marble glows in the fading light.'
            })}
          >
            <div className="aspect-[4/3] bg-[#191D30]/10 mb-6 overflow-hidden">
              <img src="/pyrgos.webp" alt="Pyrgos" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <h3 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-2">Pyrgos</h3>
            <p className="font-body text-[11px] tracking-[0.1em] text-[#191D30]/60 uppercase">The Marble Heart</p>
          </div>

          <div 
            className="group cursor-pointer"
            onClick={() => setSelectedLocation({
              name: 'Volax',
              subtitle: 'The Lunar Landscape',
              info: 'A surreal, medieval village nestled among giant, rounded granite boulders that look as if they were dropped from the heavens by the hands of Titans.',
              moreInfo: 'Beyond its otherworldly geography, Volax is historically famous for its deeply rooted basket-weaving tradition. As you walk the narrow paths, you will find verses of Greek poetry written upon the old wooden doors.'
            })}
          >
            <div className="aspect-[4/3] bg-[#191D30]/10 mb-6 overflow-hidden">
              <img src="/volax.webp" alt="Volax" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <h3 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-2">Volax</h3>
            <p className="font-body text-[11px] tracking-[0.1em] text-[#191D30]/60 uppercase">The Lunar Landscape</p>
          </div>

          <div 
            className="group cursor-pointer"
            onClick={() => setSelectedLocation({
              name: 'Kardiani',
              subtitle: 'The Green Oasis',
              info: 'Built on the steep, lush slopes of Mount Pateles, this village is a literal oasis fueled by natural flowing springs that run directly through the streets.',
              moreInfo: 'It is an architectural marvel where Catholic and Orthodox churches sit side by side in harmony. The tiered alleys offer breathtaking, amphitheatrical, uninterrupted views of the Aegean Sea.'
            })}
          >
            <div className="aspect-[4/3] bg-[#191D30]/10 mb-6 overflow-hidden">
              <img src="/kardiani.webp" alt="Kardiani" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <h3 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-2">Kardiani</h3>
            <p className="font-body text-[11px] tracking-[0.1em] text-[#191D30]/60 uppercase">The Green Oasis</p>
          </div>

        </div>
      </section>

      {/* Beaches grid */}
      <section className="py-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <h2 className="font-display text-[18px] tracking-[0.3em] text-[#191D30] uppercase mb-12 text-center">
          Pristine Shores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div 
            className="group cursor-pointer"
            onClick={() => setSelectedLocation({
              name: 'Kolymbithra',
              subtitle: 'The Dual Bay',
              info: 'Two distinct beaches sharing one beautiful bay, perfectly showcasing the duality of the island\'s untamed nature.',
              moreInfo: 'One side is exposed to the wild northern winds, making it a legendary haven for Aegean surf culture. The other sits deeply protected, offering tranquil waters and a slow-paced taverna nestled in the sand.'
            })}
          >
            <div className="aspect-[4/3] bg-[#191D30]/10 mb-6 overflow-hidden">
              <img src="/kolymbithra.webp" alt="Kolymbithra" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <h3 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-2">Kolymbithra</h3>
          </div>

          <div 
            className="group cursor-pointer"
            onClick={() => setSelectedLocation({
              name: 'Agios Sostis',
              subtitle: 'The Golden Shore',
              info: 'A stunning, serene stretch of golden sand with incredibly shallow, crystal waters looking straight out toward the island of Mykonos.',
              moreInfo: 'It is crowned by a picturesque 19th-century church overlooking the entire bay. It is the perfect sanctuary for early, quiet mornings where the water mirrors the sky.'
            })}
          >
            <div className="aspect-[4/3] bg-[#191D30]/10 mb-6 overflow-hidden">
              <img src="/agiossostis.webp" alt="Agios Sostis" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <h3 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-2">Agios Sostis</h3>
          </div>

          <div 
            className="group cursor-pointer"
            onClick={() => setSelectedLocation({
              name: 'Pachia Ammos',
              subtitle: 'The Hidden Dune',
              info: 'A secluded, untouched paradise that feels almost otherworldly. It is defined by its striking green-tinged sand dunes leading directly into the sea.',
              moreInfo: 'Swept by the wind and completely untouched by modern infrastructure, Pachia Ammos offers a true escape into nature\'s rawest form. The deep emerald waters here are unforgettable.'
            })}
          >
            <div className="aspect-[4/3] bg-[#191D30]/10 mb-6 overflow-hidden">
              <img src="/pachia_ammos.webp" alt="Pachia Ammos" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <h3 className="font-display text-[14px] tracking-[0.2em] text-[#191D30] uppercase mb-2">Pachia Ammos</h3>
          </div>

        </div>
      </section>

    </div>
  );
}