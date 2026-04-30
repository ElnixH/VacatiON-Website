import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Collection from './components/collection'; // FIXED: lowercase 'c' to match your file
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

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState('home');

  // 1. Listen for standard scrolling (for your Nav bar)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 2. Listen for the Browser "Back" and "Forward" buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      
      // If there is no hash, or the hash is home, show the home view
      if (!hash || hash === 'home') {
        setView('home');
      } 
      // ADDED 'media' here so the browser knows it is a real page!
      else if (['cookies', 'contact', 'legal', 'discover-tinos', 'andreas-house', 'villa-leonora', 'media'].includes(hash)) {
        setView(hash);
      } 
      // Otherwise, assume it's one of the "coming soon" pages
      else {
        setView('coming-soon');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Updated goHome function
  const goHome = () => {
    setView('home');
    window.history.pushState(null, '', '/'); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#191D30] font-body font-light antialiased selection:bg-[#A18E7E] selection:text-[#191D30]">
      
      {view === 'home' && <Nav scrolled={scrolled} setView={setView} />}
      
      <CookieBanner />

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
            <button onClick={goHome} className="absolute top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center transition-all duration-500">
              <ArrowLeft size={28} strokeWidth={1} className="text-[#191D30]/40 group-hover:text-[#191D30] group-hover:-translate-x-2 transition-all duration-500" />
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

        {view === 'cookies' && <CookiesPolicy setView={setView} />}
        {view === 'contact' && <ContactUs setView={setView} />}
        {view === 'legal' && <LegalNotice setView={setView} />}
        {view === 'discover-tinos' && <DiscoverTinos setView={setView} />}
        
        {/* ADDED THE MEDIA HUB RENDER HERE */}
        {view === 'media' && <MediaHub setView={setView} />}

        {/* PROPERTY PAGES */}
        {['andreas-house', 'villa-leonora'].includes(view) && (
          <PropertyPage view={view} setView={setView} />
        )}
      </main>

      {/* FIXED FOOTER: It will now render on every single page! */}
      <Footer setView={setView} />
      
    </div>
  );
}

export default App;