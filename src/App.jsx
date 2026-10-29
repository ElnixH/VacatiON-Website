// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './data/siteData';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Collection from './components/Collection';
import QuoteHero from './components/QuoteHero';
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
import S7AdminPortal from './components/S7AdminPortal';

const VALID_VIEWS = [
  'cookies',
  'contact',
  'legal',
  'discover-tinos',
  'andreas-house',
  'andreas-traditional',
  'andreas-two-bed',
  'villa-leonora',
  'media',
  'reserve',
  's7-admin',
];

const PROPERTY_VIEWS = [
  'andreas-house',
  'andreas-traditional',
  'andreas-two-bed',
  'villa-leonora',
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Frame-busting clickjacking protection
  useEffect(() => {
    if (window.self !== window.top) {
      try {
        window.top.location = window.self.location;
      } catch {
        // Ignore cross-origin frame restriction
      }
    }
  }, []);

  const navigateTo = useCallback(
    (targetView, updateHistory = true) => {
      if (targetView === view) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setIsTransitioning(true);

      setTimeout(() => {
        setView(targetView);
        if (updateHistory) {
          const url =
            targetView === 'home'
              ? '/'
              : targetView === 's7-admin'
              ? '/s7login'
              : `#${targetView}`;
          window.history.pushState(null, '', url);
        }
        window.scrollTo({ top: 0, behavior: 'instant' });

        requestAnimationFrame(() => {
          setTimeout(() => setIsTransitioning(false), 50);
        });
      }, 260);
    },
    [view]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const resolveRoute = (isPopState = false) => {
      const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
      const hash = window.location.hash.replace('#', '');

      if (path === '/s7login' || hash === 's7login' || hash === 's7-admin') {
        setView('s7-admin');
        return;
      }

      let nextView = 'home';
      if (hash && hash !== 'home') {
        nextView = VALID_VIEWS.includes(hash) ? hash : 'coming-soon';
      }
      if (isPopState) {
        navigateTo(nextView, false);
      } else if (nextView !== 'home') {
        setView(nextView);
      }
    };

    resolveRoute(false);
    const handlePopState = () => resolveRoute(true);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigateTo]);

  if (view === 's7-admin') {
    return (
      <LanguageProvider>
        <S7AdminPortal setView={navigateTo} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#191D30] font-body font-light antialiased selection:bg-[#A18E7E] selection:text-[#191D30]">
        <Nav scrolled={scrolled} view={view} setView={navigateTo} />

        <CookieBanner />
        {view === 'home' && <EarlyBirdPopup setView={navigateTo} />}

        <main
          className={`transition-all duration-500 ease-out ${
            isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
          }`}
        >
          {view === 'home' && (
            <>
              <Hero setView={navigateTo} />
              <Collection setView={navigateTo} />
              <QuoteHero setView={navigateTo} />
              {/* <About setView={navigateTo} /> temporarily removed */}
              <Reviews setView={navigateTo} />
            </>
          )}

          {view === 'coming-soon' && (
            <div className="relative min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center pt-20">
              <button
                onClick={() => navigateTo('home')}
                className="absolute top-24 left-6 md:left-12 p-2 group flex items-center justify-center transition-all duration-500 cursor-pointer"
                aria-label="Return to Home"
              >
                <ArrowLeft
                  size={28}
                  strokeWidth={1}
                  className="text-[#191D30]/40 group-hover:text-[#191D30] group-hover:-translate-x-2 transition-all duration-500"
                />
              </button>
              <div className="max-w-2xl mx-auto px-8 text-center">
                <h1 className="font-display text-3xl md:text-5xl tracking-[0.5em] text-[#191D30] uppercase mb-8">
                  Coming Soon
                </h1>
                <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
                <p className="font-body text-[13px] tracking-[0.1em] leading-[2] text-[#191D30]/60 uppercase mb-16">
                  This experience is currently being curated. <br /> Please check back later.
                </p>
              </div>
            </div>
          )}

          {view === 'cookies' && <CookiesPolicy setView={navigateTo} />}
          {view === 'contact' && <ContactUs setView={navigateTo} />}
          {view === 'legal' && <LegalNotice setView={navigateTo} />}
          {view === 'discover-tinos' && <DiscoverTinos setView={navigateTo} />}
          {view === 'media' && <MediaHub setView={navigateTo} />}
          {view === 'reserve' && <Reservation setView={navigateTo} />}

          {PROPERTY_VIEWS.includes(view) && (
            <PropertyPage view={view} setView={navigateTo} />
          )}
        </main>

        <Footer setView={navigateTo} />
        <Analytics />
      </div>
    </LanguageProvider>
  );
}