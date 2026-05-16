export default function QuoteHero({ setView }) {
  
  const handleTinosClick = (e) => {
    e.preventDefault();
    setView('discover-tinos'); // FIXED: Now opens the correct page!
    window.history.pushState(null, '', '#discover-tinos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 bg-[#191D30]">
        <img
          src="/tinos.webp"
          alt="Tinos Island"
          className="w-full h-full object-cover" 
          style={{ imageRendering: 'high-quality' }}
        />
        <div className="absolute inset-0 bg-[#191D30]/30" />
      </div>

      {/* CONTENT BOX */}
      <div className="relative z-10 text-center px-6 max-w-2xl flex flex-col items-center">
        
        <h2 className="font-display text-3xl md:text-5xl tracking-[0.4em] text-white uppercase mb-6 opacity-95 drop-shadow-lg">
          Why Tinos?
        </h2>
        <p className="font-body text-[11px] tracking-[0.4em] text-white/80 uppercase mb-12">
          AUTHENTIC CYCLADIC EXPERIENCE
        </p>

        {/* THE BUTTON */}
        <button
          onClick={handleTinosClick}
          className="group relative inline-flex items-center justify-center px-8 py-3.5 bg-white rounded-sm transition-all duration-500 active:scale-[0.96] overflow-hidden"
        >
          <span className="relative z-10 font-body text-[9px] tracking-[0.4em] font-bold uppercase leading-none text-black mix-blend-multiply">
            Discover
          </span>
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full bg-[#A18E7E] rounded-full scale-0 opacity-0 transition-all duration-1000 ease-out group-hover:scale-[3] group-hover:opacity-20" />
          </div>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
    </section>
  );
}