import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Collection from './components/collection'; 
import QuoteHero from './components/QuoteHero';
import About from './components/About';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner'; 
import CookiesPolicy from './components/CookiesPolicy'; 
import ContactUs from './components/ContactUs'; 
import LegalNotice from './components/LegalNotice'; 
import DiscoverTinos from './components/DiscoverTinos'; 
import PropertyPage from './components/PropertyPage'; 
import MediaHub from './components/MediaHub'; 
import EarlyBirdPopup from './components/EarlyBirdPopup'; 
import Reservation from './components/Reservation'; 

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState('home');

  // 1. Listen for standard scrolling (Optimized for 120Hz)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 50;
          setScrolled(prev => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 2. Listen for the Browser "Back" and "Forward" buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (!hash || hash === 'home') {
        setView('home');
      } 
      // CHANGED: Replaced 'andreas-house' with 'andreas-traditional' and 'andreas-two-bed'
      else if (['cookies', 'contact', 'legal', 'discover-tinos', 'andreas-traditional', 'andreas-two-bed', 'villa-leonora', 'media', 'reserve'].includes(hash)) {
        setView(hash);
      } 
      else {
        setView('coming-soon');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goHome = () => {
    setView('home');
    window.history.pushState(null, '', '/'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#191D30] font-body font-light antialiased selection:bg-[#A18E7E] selection:text-[#191D30]">
      
      {view === 'home' && <Nav scrolled={scrolled} setView={setView} />}
      
      {/* POPUPS & BANNERS */}
      <CookieBanner />
      {view === 'home' && <EarlyBirdPopup setView={setView} />}

      <main>
        {view === 'home' && (
          <>
            <Hero />
            <Collection setView={setView} /> 
            <QuoteHero setView={setView} />
            <About setView={setView} />
            <Reviews />
          </>
        )}
        
        {view === 'coming-soon' && (
          <div className="relative min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center pt-20">
            <button onClick={goHome} className="absolute top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center">
              <ArrowLeft size={28} strokeWidth={1} className="text-[#191D30]/40 group-hover:text-[#191D30] transform-gpu transition-transform duration-500 ease-out group-hover:-translate-x-2" />
            </button>
            <div className="max-w-2xl mx-auto px-8 text-center">
              <h1 className="font-display text-3xl md:text-5xl tracking-[0.5em] text-[#191D30] uppercase mb-8">Coming Soon</h1>
              <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
              <p className="font-body text-[13px] tracking-[0.1em] leading-[2] text-[#191D30]/60 uppercase mb-16">
                This experience is currently being curated. <br /> Please check back later.
              </p>
            </div>
          </div>
        )}

        {/* STATIC PAGES */}
        {view === 'cookies' && <CookiesPolicy setView={setView} />}
        {view === 'contact' && <ContactUs setView={setView} />}
        {view === 'legal' && <LegalNotice setView={setView} />}
        {view === 'discover-tinos' && <DiscoverTinos setView={setView} />}
        {view === 'media' && <MediaHub setView={setView} />}
        {view === 'reserve' && <Reservation setView={setView} />}

        {/* PROPERTY PAGES - CHANGED: Replaced the old property key with the two new ones */}
        {['andreas-traditional', 'andreas-two-bed', 'villa-leonora'].includes(view) && (
          <PropertyPage view={view} setView={setView} />
        )}
      </main>

      <Footer setView={setView} />
      
      <Analytics />
    </div>
  );
}

export default App;