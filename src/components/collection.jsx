export default function Collection({ setView }) {
  
  // Property catalog data
  const properties = [
    {
      id: 'andreas-house',
      name: "Andrea's Tinos House",
      image: '/andreas-house/image00006 (1).webp', 
    },
    {
      id: 'villa-leonora',
      name: 'Villa Leonora',
      image: '/image00016.webp', 
    }
  ];

  // Route to property detail view
  const handlePropertyClick = (propertyId) => {
    setView(propertyId);
    window.history.pushState(null, '', `#${propertyId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="collection" className="py-32 bg-white">
      {/* Container max-width adjusted for 2-column balance */}
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-24">
          <h2 className="font-display text-xl md:text-2xl tracking-[0.5em] text-[#191D30] uppercase mb-8 max-w-3xl leading-[1.6]">
            Warm hospitality, <br className="hidden md:block" /> shared with an open heart
          </h2>
          <div className="w-14 h-[1px] bg-[#A18E7E]" />
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {properties.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePropertyClick(item.id)}
              className="group relative flex flex-col text-left active:scale-[0.99] transition-all duration-500 outline-none"
            >
              {/* Image Box */}
              <div className="relative aspect-[3/4] overflow-hidden mb-6 border border-[#191D30]/5 transition-all duration-700">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-[1.8s] group-hover:scale-105"
                />
                
                {/* Stone Tint Overlay */}
                <div className="absolute inset-0 bg-[#A18E7E] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                {/* Hover Frame */}
                <div className="absolute inset-6 border border-white/20 opacity-0 scale-100 transition-all duration-700 group-hover:opacity-100" />
              </div>

              {/* Text Box */}
              <div className="flex justify-between items-center px-1">
                <div className="space-y-1">
                  <h3 className="font-display text-[13px] tracking-[0.3em] text-[#191D30] uppercase group-hover:text-[#A18E7E] transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="w-0 h-[1px] bg-[#A18E7E] transition-all duration-500 group-hover:w-full" />
                </div>
                <p className="font-body text-[9px] text-[#A18E7E] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">
                  Explore
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}