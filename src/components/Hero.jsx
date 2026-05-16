export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      
      {/* background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/image00015.webp" 
          alt="Atmosphere"
          className="w-full h-full object-cover scale-105" 
        />
        <div className="absolute inset-0 bg-[#191D30]/40" />
      </div>

      {/* left accent */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center gap-6">
        <div className="w-[1px] h-20 bg-white/40" />
        
        <div className="flex flex-col gap-2">
          <span className="font-body text-white text-[10px] tracking-[0.4em] uppercase whitespace-nowrap">
            Luxury Living
          </span>
          <span className="font-body text-white/60 text-[10px] tracking-[0.4em] uppercase whitespace-nowrap">
            Redefined
          </span>
        </div>
      </div>

      {/* center quote */}
      <div className="relative z-10 flex flex-col items-center text-center mt-12 px-6 max-w-4xl">
        <h1 className="font-display text-2xl md:text-4xl tracking-[0.2em] md:tracking-[0.3em] text-white uppercase leading-[1.6] md:leading-[1.8] opacity-95">
          Above the sea, <br className="hidden md:block" /> 
          where every sunset feels <br className="hidden md:block" /> 
          like it’s yours alone.
        </h1>
      </div>

      {/* fade to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent opacity-10 pointer-events-none" />
    </section>
  );
}