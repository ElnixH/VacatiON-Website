// src/components/Nav.jsx
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { BRAND_ASSETS, useLanguage } from '../data/siteData';

const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'it', label: 'IT', full: 'Italiano' },
  { code: 'el', label: 'EL', full: 'Ελληνικά' },
];

export default function Nav({ scrolled, view = 'home', setView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langContainerRef = useRef(null);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langContainerRef.current && !langContainerRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const leftLinks = [
    { label: t.nav.discoverTinos, view: 'discover-tinos' },
    { label: t.nav.contactUs, view: 'contact' },
  ];

  const rightLinks = [
    {
      label: t.nav.andreasHouse,
      isDropdown: true,
      items: [
        {
          label: t.nav.traditionalHouse,
          view: 'andreas-traditional',
          subtitle: t.nav.traditionalSub,
        },
        {
          label: t.nav.twoBedHouse,
          view: 'andreas-two-bed',
          subtitle: t.nav.twoBedSub,
        },
      ],
    },
    {
      label: t.nav.villaLeonora,
      view: 'villa-leonora',
      subtitle: t.nav.leonoraSub,
    },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigation = (viewName) => {
    setIsOpen(false);
    if (setView) setView(viewName);
  };

  const goHome = () => {
    setIsOpen(false);
    if (setView) setView('home');
  };

  const hasDarkHero = ['home', 'discover-tinos'].includes(view);
  const isSolid = scrolled || isOpen || !hasDarkHero;

  const headerStyle = `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
    isSolid ? 'bg-[#191D30] shadow-2xl py-2.5' : 'bg-transparent py-4'
  }`;

  // Slightly smaller nav link typography
  const linkStyle =
    'group relative text-[9.5px] lg:text-[10px] font-body font-light tracking-[0.26em] transition-all duration-500 uppercase text-white hover:text-[#A18E7E] py-1.5 flex items-center justify-center cursor-pointer';

  const otherLanguages = LANGUAGES.filter((l) => l.code !== lang);

  return (
    <header className={headerStyle}>
      <div className="w-full px-4 md:px-8 h-11 flex items-center relative">
        {/* Desktop Nav */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Left Navigation */}
          <div className="flex flex-1 justify-start items-center gap-6 lg:gap-8">
            <nav className="flex items-center gap-6 lg:gap-8">
              {leftLinks.map((link, index) => (
                <button
                  key={`${link.view}-${index}`}
                  onClick={() => handleNavigation(link.view)}
                  className={linkStyle}
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1.5 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Center Logo + Slogan (Slogan invisible at top, pops up below logo when scrolled) */}
          <div
            className="relative flex-shrink-0 cursor-pointer group flex flex-col items-center justify-center min-w-[220px] lg:min-w-[260px]"
            onClick={goHome}
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="Logo"
              className={`w-auto object-contain transition-all duration-500 brightness-0 invert ${
                scrolled ? 'h-4 lg:h-[18px]' : 'h-[18px] lg:h-5'
              }`}
            />
            <span
              className={`font-display text-[7.5px] lg:text-[8px] tracking-[0.34em] uppercase text-[#A18E7E] whitespace-nowrap overflow-hidden transition-all duration-500 ease-out ${
                scrolled
                  ? 'opacity-100 max-h-4 translate-y-0 mt-1'
                  : 'opacity-0 max-h-0 -translate-y-1 mt-0 pointer-events-none'
              }`}
            >
              {t.nav.tagline}
            </span>
          </div>

          {/* Right Links + Slower, Silkier Inline Language Drawer */}
          <nav className="flex flex-1 justify-end items-center gap-5 lg:gap-7">
            {rightLinks.map((link, index) =>
              link.isDropdown ? (
                <div key={index} className="relative group">
                  <div className={`${linkStyle} flex items-center gap-1`}>
                    <span className="relative pb-0.5">
                      {link.label}
                      <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full" />
                    </span>
                    <ChevronDown
                      size={11}
                      className="text-white/70 group-hover:text-[#A18E7E] transition-transform duration-300 group-hover:rotate-180"
                    />
                  </div>

                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 z-50">
                    <div className="bg-[#191D30] border border-white/10 p-4 flex flex-col gap-3.5 min-w-[200px] items-center shadow-2xl">
                      {link.items.map((subItem) => (
                        <button
                          key={subItem.view}
                          onClick={() => handleNavigation(subItem.view)}
                          className="text-[9.5px] font-body tracking-[0.2em] text-white/80 hover:text-[#A18E7E] uppercase text-center transition-colors w-full cursor-pointer"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  key={`${link.view}-${index}`}
                  onClick={() => handleNavigation(link.view)}
                  className={linkStyle}
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1.5 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </button>
              )
            )}

            {/* SILKY SLOW INLINE LANGUAGE DRAWER — ZERO BACKGROUND */}
            <div
              ref={langContainerRef}
              className="relative flex items-center border-l border-white/20 pl-3.5 select-none"
            >
              <button
                type="button"
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="text-[9.5px] lg:text-[10px] font-body font-medium tracking-[0.24em] text-[#A18E7E] hover:text-white uppercase transition-colors duration-500 cursor-pointer bg-transparent border-none p-0"
                aria-label="Toggle Language Selector"
              >
                {lang.toUpperCase()}
              </button>

              <div
                className={`grid transition-all duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  langMenuOpen
                    ? 'grid-cols-[1fr] opacity-100 ml-2.5'
                    : 'grid-cols-[0fr] opacity-0 ml-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden flex items-center gap-2.5">
                  {otherLanguages.map((l, idx) => (
                    <div
                      key={l.code}
                      style={{
                        transitionDelay: langMenuOpen ? `${(idx + 1) * 95}ms` : '0ms',
                      }}
                      className={`flex items-center gap-2.5 transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        langMenuOpen
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-3'
                      }`}
                    >
                      <span className="w-[1px] h-2 bg-white/25" />
                      <button
                        type="button"
                        onClick={() => {
                          setLang(l.code);
                          setLangMenuOpen(false);
                        }}
                        className="text-[9.5px] font-body font-light tracking-[0.2em] uppercase text-white/75 hover:text-[#A18E7E] transition-colors duration-500 cursor-pointer bg-transparent border-none p-0 whitespace-nowrap"
                      >
                        {l.label}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Nav Toggle Top Bar */}
        <div className="flex md:hidden w-full items-center justify-between relative">
          {/* Mobile Smooth Language Selector */}
          <div className="flex items-center z-20 select-none">
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              className="text-[9.5px] font-body font-medium tracking-[0.22em] text-[#A18E7E] uppercase bg-transparent border-none p-0"
            >
              {lang.toUpperCase()}
            </button>
            <div
              className={`grid transition-all duration-[950ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                langMenuOpen
                  ? 'grid-cols-[1fr] opacity-100 ml-2'
                  : 'grid-cols-[0fr] opacity-0 ml-0 pointer-events-none'
              }`}
            >
              <div className="overflow-hidden flex items-center gap-2">
                {otherLanguages.map((l, idx) => (
                  <div
                    key={l.code}
                    style={{
                      transitionDelay: langMenuOpen ? `${(idx + 1) * 95}ms` : '0ms',
                    }}
                    className={`flex items-center gap-2 transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      langMenuOpen
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-2'
                    }`}
                  >
                    <span className="w-[1px] h-2 bg-white/25" />
                    <button
                      type="button"
                      onClick={() => {
                        setLang(l.code);
                        setLangMenuOpen(false);
                      }}
                      className="text-[9.5px] font-body tracking-[0.18em] uppercase text-white/75 bg-transparent border-none p-0"
                    >
                      {l.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Center Logo + Slogan (Slogan pops up below logo only on scroll) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center justify-center min-w-[130px]"
            onClick={goHome}
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="Logo"
              className={`w-auto object-contain transition-all duration-500 brightness-0 invert ${
                scrolled ? 'h-3.5' : 'h-4'
              }`}
            />
            <span
              className={`font-display text-[6.5px] tracking-[0.26em] uppercase text-[#A18E7E] whitespace-nowrap overflow-hidden transition-all duration-500 ease-out ${
                scrolled
                  ? 'opacity-100 max-h-3 translate-y-0 mt-0.5'
                  : 'opacity-0 max-h-0 -translate-y-1 mt-0 pointer-events-none'
              }`}
            >
              {t.nav.tagline}
            </span>
          </div>

          {/* Menu Toggle */}
          <div className="ml-auto z-20">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-1.5"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={21} strokeWidth={1} /> : <Menu size={21} strokeWidth={1} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-[100dvh] bg-[#191D30] transition-all duration-500 overflow-y-auto px-6 ${
          isOpen ? 'translate-y-0 shadow-2xl' : '-translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex justify-between items-center h-20 border-b border-white/10 mb-8">
          <div className="flex flex-col items-start cursor-pointer" onClick={goHome}>
            <img
              src={BRAND_ASSETS.logo}
              alt="Logo"
              className="h-4 w-auto brightness-0 invert"
            />
            <span className="font-display text-[7.5px] tracking-[0.26em] uppercase text-[#A18E7E] mt-1">
              {t.nav.tagline}
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white p-2">
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <div className="flex flex-col gap-10 text-center pb-24">
          <div className="flex justify-center items-center gap-6">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-xs font-body tracking-[0.25em] uppercase pb-1 border-b transition-all duration-500 ${
                  lang === l.code
                    ? 'text-[#A18E7E] border-[#A18E7E]'
                    : 'text-white/50 border-transparent'
                }`}
              >
                {l.full}
              </button>
            ))}
          </div>

          <nav className="flex flex-col items-center gap-5">
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

          <div className="w-12 h-[1px] bg-[#A18E7E]/50 mx-auto" />

          <div className="flex flex-col items-center gap-8 w-full">
            <h3 className="text-[#A18E7E] font-display text-[11px] tracking-[0.3em] uppercase">
              {t.nav.ourProperties}
            </h3>

            <div className="flex flex-col gap-8 w-full">
              {rightLinks.map((link, index) =>
                link.isDropdown ? (
                  <div key={index} className="flex flex-col items-center gap-5 w-full">
                    <span className="text-white/40 font-display text-[11px] tracking-[0.35em] uppercase border-b border-white/10 pb-2.5 w-[200px]">
                      {link.label}
                    </span>
                    <div className="flex flex-col gap-5">
                      {link.items.map((subItem) => (
                        <button
                          key={subItem.view}
                          onClick={() => handleNavigation(subItem.view)}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <span className="text-white font-body text-lg font-light tracking-[0.05em] uppercase transition-colors group-hover:text-[#A18E7E]">
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
                  <button
                    key={link.view}
                    onClick={() => handleNavigation(link.view)}
                    className="flex flex-col items-center gap-1 group mt-1"
                  >
                    <span className="text-white font-body text-xl font-light tracking-[0.05em] uppercase transition-colors group-hover:text-[#A18E7E]">
                      {link.label}
                    </span>
                    <span className="text-[#A18E7E] font-body italic text-[12px] tracking-wide opacity-80">
                      ~ {link.subtitle} ~
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <button
            onClick={() => handleNavigation('reserve')}
            className="mx-auto rounded-full px-10 py-3.5 bg-white text-[#191D30] font-body text-[10px] tracking-[0.28em] uppercase font-medium"
          >
            {t.nav.reserve} →
          </button>

          <p className="font-display italic text-[#A18E7E]/60 text-sm pt-2">
            {t.nav.tagline}
          </p>
        </div>
      </div>
    </header>
  );
}