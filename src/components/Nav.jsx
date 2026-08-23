import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const leftLinks = [
  { label: 'DISCOVER TINOS', view: 'discover-tinos' },
  { label: 'CONTACT US', view: 'contact' },
];

const rightLinks = [
  { 
    label: "ANDREA'S HOUSE", 
    isDropdown: true,
    items: [
      { 
        label: "Traditional House", 
        view: 'andreas-traditional',
        subtitle: 'Tradition Refined' 
      },
      { 
        label: "Two-Bedroom House", 
        view: 'andreas-two-bed',
        subtitle: 'Spacious Elegance' 
      }
    ]
  },
  { 
    label: 'VILLA LEONORA', 
    view: 'villa-leonora',
    subtitle: 'Coastal Luxury' 
  },
];

export default function Nav({ scrolled, setView }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (viewName) => {
    setIsOpen(false);
    if (setView) {
      setView(viewName);
      window.history.pushState(null, '', `#${viewName}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goHome = () => {
    if (setView) {
      setView('home');
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const headerStyle = `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
    scrolled || isOpen ? 'bg-[#191D30]/95 shadow-2xl py-3' : 'bg-transparent py-6'
  }`;

  const linkStyle = `group relative text-[11px] font-body font-light tracking-[0.3em] transition-all duration-500 uppercase text-white hover:text-[#A18E7E] py-2 flex items-center justify-center cursor-pointer`;

  return (
    <header className={headerStyle}>
      <div className="w-full px-4 md:px-8 h-12 flex items-center relative">
        
        {/* Desktop Nav */}
        <div className="hidden md:flex w-full items-center justify-between">
          
          <nav className="flex flex-1 justify-start gap-12">
            {leftLinks.map((link, index) => (
              <button key={`${link.view}-${index}`} onClick={() => handleNavigation(link.view)} className={linkStyle}>
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-150 ease-out group-active:w-full" />
                </span>
              </button>
            ))}
          </nav>

          {/* Logo / Brand (Desktop) */}
          <div 
            className="relative flex-shrink-0 cursor-pointer group flex items-center justify-center min-w-[320px] h-12"
            onClick={goHome}
          >
            <img 
              src="/VacationLogo.png" 
              alt="Logo" 
              className={`h-6 w-auto object-contain transition-all duration-500 absolute brightness-0 invert
                ${scrolled ? 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100' : 'opacity-100 scale-100'}`} 
            />
            <span 
              className={`font-display text-[12px] tracking-[0.4em] uppercase transition-all duration-500 text-[#A18E7E] whitespace-nowrap absolute
                ${scrolled ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105' : 'opacity-0 pointer-events-none'}`}
            >
              Turn your memories on
            </span>
          </div>

          <nav className="flex flex-1 justify-end items-center gap-6 lg:gap-12">
            {rightLinks.map((link, index) => (
              link.isDropdown ? (
                // DESKTOP DROPDOWN MENU
                <div key={index} className="relative group">
                  <div className={`${linkStyle} flex items-center gap-1`}>
                    <span className="relative pb-1">
                      {link.label}
                      <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full" />
                    </span>
                    <ChevronDown size={12} className="text-white/70 group-hover:text-[#A18E7E] transition-colors duration-300" />
                  </div>
                  
                  {/* Dropdown Box - FIXED to be completely transparent */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 z-50">
                    <div className="bg-transparent p-5 flex flex-col gap-5 min-w-[220px] items-center">
                      {link.items.map((subItem) => (
                        <button
                          key={subItem.view}
                          onClick={() => handleNavigation(subItem.view)}
                          className="text-[10px] font-body tracking-[0.2em] text-white/70 hover:text-[#A18E7E] uppercase text-center transition-colors w-full"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // STANDARD LINK
                <button key={`${link.view}-${index}`} onClick={() => handleNavigation(link.view)} className={linkStyle}>
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-150 ease-out group-active:w-full" />
                  </span>
                </button>
              )
            ))}
          </nav>
        </div>

        {/* Mobile Nav Toggle Top Bar */}
        <div className="flex md:hidden w-full items-center justify-between relative">
          
          {/* Logo / Brand (Mobile Top Bar) */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center min-w-[150px] h-7"
            onClick={goHome}
          >
            <img 
              src="/VacationLogo.png" 
              alt="Logo" 
              className={`h-6 w-auto object-contain transition-all duration-500 absolute brightness-0 invert
                ${scrolled ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} 
            />
            <span 
              className={`font-display text-[10px] tracking-[0.4em] uppercase transition-all duration-500 text-[#A18E7E] whitespace-nowrap absolute
                ${scrolled ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none'}`}
            >
              Turn your memories on
            </span>
          </div>
          
          {/* Menu Toggle */}
          <div className="ml-auto">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-0 left-0 w-full h-screen bg-[#191D30] transition-all duration-500 overflow-y-auto px-6 ${isOpen ? 'translate-y-0 shadow-2xl' : '-translate-y-full'}`}>
        
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center h-20 border-b border-white/10 mb-12">
            <img 
              src="/VacationLogo.png" 
              alt="Logo" 
              className="h-6 w-auto brightness-0 invert cursor-pointer"
              onClick={goHome}
            />
            <button onClick={() => setIsOpen(false)} className="text-white p-2">
                <X size={28} strokeWidth={1} />
            </button>
        </div>

        <div className="flex flex-col gap-16 text-center pb-24">
            
            {/* 1. General Info Links */}
            <nav className="flex flex-col items-center gap-6">
                {leftLinks.map((link) => (
                    <button 
                      key={link.view} 
                      onClick={() => handleNavigation(link.view)} 
                      className="text-white font-body text-sm font-light tracking-[0.2em] uppercase py-1"
                    >
                        {link.label}
                    </button>
                ))}
            </nav>

            {/* Centered Decorative Divider */}
            <div className="w-12 h-[1px] bg-[#A18E7E]/50 mx-auto"></div>

            {/* 2. OUR PROPERTIES SECTION */}
            <div className="flex flex-col items-center gap-12 w-full">
                <h3 className="text-[#A18E7E] font-display text-[11px] tracking-[0.3em] uppercase mb-4">
                    Our Properties
                </h3>

                <div className="flex flex-col gap-14 w-full">
                    {rightLinks.map((link, index) => (
                        link.isDropdown ? (
                            // MOBILE: Grouping Andrea's properties together
                            <div key={index} className="flex flex-col items-center gap-8 w-full">
                                <span className="text-white/40 font-display text-[12px] tracking-[0.4em] uppercase border-b border-white/10 pb-3 w-[200px]">
                                    {link.label}
                                </span>
                                <div className="flex flex-col gap-8">
                                    {link.items.map((subItem) => (
                                        <button 
                                          key={subItem.view} 
                                          onClick={() => handleNavigation(subItem.view)} 
                                          className="flex flex-col items-center gap-1.5 group"
                                        >
                                            <span className="text-white font-body text-xl font-light tracking-[0.05em] uppercase transition-colors group-hover:text-[#A18E7E]">
                                                {subItem.label}
                                            </span>
                                            <span className="text-[#A18E7E] font-body italic text-[12px] tracking-wide opacity-80">
                                                ~ {subItem.subtitle} ~
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // MOBILE: Standard standalone property
                            <button 
                              key={link.view} 
                              onClick={() => handleNavigation(link.view)} 
                              className="flex flex-col items-center gap-1.5 group mt-2"
                            >
                                <span className="text-white font-body text-2xl font-light tracking-[0.05em] uppercase transition-colors group-hover:text-[#A18E7E]">
                                    {link.label}
                                </span>
                                <span className="text-[#A18E7E] font-body italic text-[13px] tracking-wide opacity-80">
                                    ~ {link.subtitle} ~
                                </span>
                            </button>
                        )
                    ))}
                </div>
            </div>

            {/* Closing Tagline */}
            <p className="font-display italic text-[#A18E7E]/60 text-base pt-12">
              Turn your memories on
            </p>

        </div>
      </div>
    </header>
  );
}