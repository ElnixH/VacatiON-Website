import { useState, useEffect } from 'react';
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
  const [tinosTime, setTinosTime] = useState('');
  const [temperature, setTemperature] = useState('23°C');
  const { lang, setLang, t } = useLanguage();

  // Live Local Time (Europe/Athens)
  useEffect(() => {
    const updateClock = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/Athens',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        setTinosTime(formatter.format(new Date()));
      } catch {
        setTinosTime('15:00');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 20000);
    return () => clearInterval(timer);
  }, []);

  // Live Temperature Fetch
  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=37.5376&longitude=25.1634&current_weather=true'
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.current_weather?.temperature !== undefined) {
          setTemperature(`${Math.round(data.current_weather.temperature)}°C`);
        }
      })
      .catch(() => {});
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

  // Solid header when scrolled — removed blurry backdrop
  const headerStyle = `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
    isSolid ? 'bg-[#191D30] shadow-2xl py-3' : 'bg-transparent py-5 md:py-6'
  }`;

  const linkStyle =
    'group relative text-[11px] font-body font-light tracking-[0.3em] transition-all duration-500 uppercase text-white hover:text-[#A18E7E] py-2 flex items-center justify-center cursor-pointer';

  return (
    <header className={headerStyle}>
      <div className="w-full px-4 md:px-8 h-12 flex items-center relative">
        {/* Desktop Nav */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Left Navigation + Clean Temperature | Time (No Tinos, No Pill Background) */}
          <div className="flex flex-1 justify-start items-center gap-8 lg:gap-10">
            <div
              onClick={goHome}
              className="hidden xl:flex items-center gap-2 font-body text-[10.5px] font-light tracking-[0.28em] text-white/90 uppercase whitespace-nowrap cursor-pointer select-none"
            >
              <span>{temperature}</span>
              <span className="text-white/35">|</span>
              <span>{tinosTime}</span>
            </div>

            <nav className="flex items-center gap-8 lg:gap-10">
              {leftLinks.map((link, index) => (
                <button
                  key={`${link.view}-${index}`}
                  onClick={() => handleNavigation(link.view)}
                  className={linkStyle}
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Center Logo / Brand (Original Scroll & Hover Animation) */}
          <div
            className="relative flex-shrink-0 cursor-pointer group flex items-center justify-center min-w-[260px] lg:min-w-[300px] h-12"
            onClick={goHome}
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="Logo"
              className={`h-6 w-auto object-contain transition-all duration-500 absolute brightness-0 invert ${
                scrolled
                  ? 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                  : 'opacity-100 scale-100'
              }`}
            />
            <span
              className={`font-display text-[12px] tracking-[0.4em] uppercase transition-all duration-500 text-[#A18E7E] whitespace-nowrap absolute ${
                scrolled
                  ? 'opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              {t.nav.tagline}
            </span>
          </div>

          {/* Right Links + Smooth Horizontal Language Selector (No Background) */}
          <nav className="flex flex-1 justify-end items-center gap-6 lg:gap-9">
            {rightLinks.map((link, index) =>
              link.isDropdown ? (
                <div key={index} className="relative group">
                  <div className={`${linkStyle} flex items-center gap-1`}>
                    <span className="relative pb-1">
                      {link.label}
                      <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full" />
                    </span>
                    <ChevronDown
                      size={12}
                      className="text-white/70 group-hover:text-[#A18E7E] transition-transform duration-300 group-hover:rotate-180"
                    />
                  </div>

                  {/* Solid Dropdown Box (No Blur) */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 z-50">
                    <div className="bg-[#191D30] border border-white/10 p-5 flex flex-col gap-4 min-w-[220px] items-center shadow-2xl">
                      {link.items.map((subItem) => (
                        <button
                          key={subItem.view}
                          onClick={() => handleNavigation(subItem.view)}
                          className="text-[10px] font-body tracking-[0.2em] text-white/80 hover:text-[#A18E7E] uppercase text-center transition-colors w-full cursor-pointer"
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
                    <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-[#A18E7E] -translate-x-1/2 transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </button>
              )
            )}

            {/* SMOOTH HORIZONTAL EXPANDING LANGUAGE SELECTOR — ZERO BACKGROUND */}
            <div className="relative flex items-center border-l border-white/20 pl-4">
              <div
                className={`flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  langMenuOpen ? 'max-w-[160px]' : 'max-w-[36px]'
                }`}
              >
                {!langMenuOpen ? (
                  <button
                    onClick={() => setLangMenuOpen(true)}
                    className="text-[11px] font-body font-light tracking-[0.25em] text-white hover:text-[#A18E7E] uppercase transition-colors cursor-pointer bg-transparent border-none p-0"
                    aria-label="Choose Language"
                  >
                    {lang.toUpperCase()}
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5">
                    {LANGUAGES.map((l, idx) => (
                      <div key={l.code} className="flex items-center gap-2.5">
                        <button
                          onClick={() => {
                            setLang(l.code);
                            setLangMenuOpen(false);
                          }}
                          className={`text-[10.5px] font-body tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer bg-transparent border-none p-0 ${
                            lang === l.code
                              ? 'text-[#A18E7E] font-medium'
                              : 'text-white/70 hover:text-white'
                          }`}
                        >
                          {l.label}
                        </button>
                        {idx < LANGUAGES.length - 1 && (
                          <span className="w-[1px] h-2.5 bg-white/20" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Nav Toggle Top Bar */}
        <div className="flex md:hidden w-full items-center justify-between relative">
          {/* Mobile Language Selector (No Background) */}
          <div className="flex items-center gap-2 z-20">
            <div
              className={`flex items-center overflow-hidden transition-all duration-500 ease-out ${
                langMenuOpen ? 'max-w-[130px]' : 'max-w-[34px]'
              }`}
            >
              {!langMenuOpen ? (
                <button
                  onClick={() => setLangMenuOpen(true)}
                  className="text-[10px] font-body tracking-[0.25em] text-white uppercase bg-transparent border-none p-0"
                >
                  {lang.toUpperCase()}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`text-[10px] font-body tracking-[0.18em] uppercase bg-transparent border-none p-0 ${
                        lang === l.code ? 'text-[#A18E7E] font-medium' : 'text-white/70'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logo / Brand (Mobile Top Bar) */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center min-w-[140px] h-7"
            onClick={goHome}
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="Logo"
              className={`h-5 w-auto object-contain transition-all duration-500 absolute brightness-0 invert ${
                scrolled ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
              }`}
            />
            <span
              className={`font-display text-[9px] tracking-[0.3em] uppercase transition-all duration-500 text-[#A18E7E] whitespace-nowrap absolute ${
                scrolled ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {t.nav.tagline}
            </span>
          </div>

          {/* Menu Toggle */}
          <div className="ml-auto z-20">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
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
          <div className="flex items-center gap-3" onClick={goHome}>
            <img
              src={BRAND_ASSETS.logo}
              alt="Logo"
              className="h-5 w-auto brightness-0 invert cursor-pointer"
            />
            <span className="text-[10px] font-body tracking-[0.22em] text-white/80 uppercase border-l border-white/15 pl-3">
              {temperature} <span className="text-white/35">|</span> {tinosTime}
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white p-2">
            <X size={28} strokeWidth={1} />
          </button>
        </div>

        <div className="flex flex-col gap-10 text-center pb-24">
          <div className="flex justify-center items-center gap-6">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-xs font-body tracking-[0.25em] uppercase pb-1 border-b transition-all ${
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