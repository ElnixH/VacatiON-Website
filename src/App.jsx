import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Collection from './components/Collection';
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

const S7AdminPortal = lazy(() => import('./components/S7AdminPortal'));

const VAULT_CODES = [115, 55, 108, 111, 103, 105, 110];
function isVaultToken(str) {
  if (!str) return false;
  const clean = str.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (clean.length !== VAULT_CODES.length) return false;
  return VAULT_CODES.every((code, idx) => clean.charCodeAt(idx) === code);
}

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
  'reservation',
];

const PROPERTY_VIEWS = [
  'andreas-house',
  'andreas-traditional',
  'andreas-two-bed',
  'villa-leonora',
];

function getInitialViewFromWindow() {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = window.location.hash.replace('#', '').toLowerCase();

  if (isVaultToken(path) || isVaultToken(hash)) {
    return '__vault__';
  }
  if (hash && VALID_VIEWS.includes(hash)) {
    return hash === 'reservation' ? 'reserve' : hash;
  }
  return 'home';
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState(getInitialViewFromWindow);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 1. Listen for standard scrolling (Optimized for 120Hz)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 50;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigateTo = useCallback(
    (targetView, updateHistory = true) => {
      const normalizedView =
        targetView === 'reservation'
          ? 'reserve'
          : isVaultToken(targetView)
          ? '__vault__'
          : targetView;

      if (normalizedView === view) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setIsTransitioning(true);

      setTimeout(() => {
        setView(normalizedView);
        if (updateHistory) {
          const url =
            normalizedView === 'home'
              ? '/'
              : normalizedView === '__vault__'
              ? '/s7login'
              : `#${normalizedView}`;
          window.history.pushState(null, '', url);
        }
        window.scrollTo({ top: 0, behavior: 'instant' });

        requestAnimationFrame(() => {
          setTimeout(() => setIsTransitioning(false), 50);
        });
      }, 220);
    },
    [view]
  );

  // 2. Listen for Browser Back/Forward and #hash changes
  useEffect(() => {
    const syncUrlChange = () => {
      setView(getInitialViewFromWindow());
    };

    window.addEventListener('popstate', syncUrlChange);
    window.addEventListener('hashchange', syncUrlChange);
    return () => {
      window.removeEventListener('popstate', syncUrlChange);
      window.removeEventListener('hashchange', syncUrlChange);
    };
  }, []);

  if (view === '__vault__') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
        <S7AdminPortal setView={navigateTo} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#191D30] font-body font-light antialiased selection:bg-[#A18E7E] selection:text-[#191D30]">
      {view === 'home' && <Nav scrolled={scrolled} view={view} setView={navigateTo} />}

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
            <About setView={navigateTo} />
            <QuoteHero setView={navigateTo} />
            <Reviews setView={navigateTo} />
          </>
        )}

        {view === 'coming-soon' && (
          <div className="relative min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center pt-20">
            <button
              onClick={() => navigateTo('home')}
              className="absolute top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center"
              aria-label="Return to Home"
            >
              <ArrowLeft
                size={28}
                strokeWidth={1}
                className="text-[#191D30]/40 group-hover:text-[#191D30] transform-gpu transition-transform duration-500 ease-out group-hover:-translate-x-2"
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
        {(view === 'reserve' || view === 'reservation') && (
          <Reservation setView={navigateTo} />
        )}

        {PROPERTY_VIEWS.includes(view) && (
          <PropertyPage view={view} setView={navigateTo} />
        )}
      </main>

      <Footer setView={navigateTo} />
      
    </div>
  );
}