import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const leftLinks = [
  { label: 'DISCOVER TINOS', view: 'discover-tinos' },
  { label: 'CONTACT US', view: 'contact' },
];

const rightLinks = [
  { label: "ANDREA'S HOUSE", view: 'andreas-house' },
  { label: 'VILLA LEONORA', view: 'villa-leonora' },
];

export default function Nav({ scrolled, setView }) {
  const [isOpen, setIsOpen] = useState(false);

  // handle routing
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
    scrolled || isOpen ? 'bg-[#191D30]/95 shadow-2xl py-3' : 'bg-transparent py-8'
  }`;

  const linkStyle = `group relative text-[11px] font-body font-light tracking-[0.3em] transition-all duration-500 uppercase text-white hover:text-[#A18E7E] py-2 flex items-center justify-center`;

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

          {/* Logo / Brand */}
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
              Turn your memories on.
            </span>
          </div>

          <nav className="flex flex-1 justify-end items-center gap-12">
            {rightLinks.map((link, index) => (
              <button key={`${link.view}-${index}`} onClick={() => handleNavigation(link.view)} className={linkStyle}>
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-150 ease-out group-active:w-full" />
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex md:hidden w-full items-center justify-between">
           <img src="/VacationLogo.png" alt="Logo" className="h-7 w-auto brightness-0 invert" onClick={goHome} />
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-0 left-0 w-full h-screen bg-[#191D30] transition-all duration-500 flex flex-col items-center justify-center gap-10 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-white">
          <X size={32} />
        </button>
        {[...leftLinks, ...rightLinks].map((link, index) => (
          <button key={`mobile-${link.view}-${index}`} onClick={() => handleNavigation(link.view)} className="text-white font-body font-light text-lg tracking-[0.3em] uppercase">
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}