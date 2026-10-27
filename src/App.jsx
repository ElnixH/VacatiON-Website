// src/App.jsx
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

// Obfuscated char-code check for "s7login" so it works 100% synchronously on any browser/URL
const VAULT_CODES = [115, 55, 108, 111, 103, 105, 110];
function isVaultToken(str) {
  if (!str) return false;
  const clean = str.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (clean.length !== VAULT_CODES.length) return false;
  return VAULT_CODES.every((code, idx) => clean.charCodeAt(idx) === code);
}

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

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState(getInitialViewFromWindow);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Runtime Security Shield: Blocks F12, DevTools Shortcuts, View-Source & Image Dragging
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.self !== window.top) {
      try {
        window.top.location = window.self.location;
      } catch {
        // Frame-busting fallback
      }
    }

    const handleContextMenu = (e) => {
      if (view === '__vault__') return; // Allow normal clicks in admin panel
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      const key = e.key?.toUpperCase();
      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      if (
        e.key === 'F12' ||
        (ctrlOrCmd && e.shiftKey && ['I', 'J', 'C', 'K'].includes(key)) ||
        (ctrlOrCmd && ['U', 'S'].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleDragStart = (e) => {
      if (e.target?.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, [view]);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen to URL path or #hash changes (including typing #s7login or /s7login)
  useEffect(() => {
    const syncUrlChange = () => {
      const target = getInitialViewFromWindow();
      setView(target);
    };

    window.addEventListener('popstate', syncUrlChange);
    window.addEventListener('hashchange', syncUrlChange);
    return () => {
      window.removeEventListener('popstate', syncUrlChange);
      window.removeEventListener('hashchange', syncUrlChange);
    };
  }, []);

  // Render S7 Control Panel when on /s7login or #s7login
  if (view === '__vault__') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
        <S7AdminPortal setView={navigateTo} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#191D30] font-body font-light antialiased selection:bg-[#A18E7E] selection:text-[#191D30] select-none">
      {view === 'home' && <Nav scrolled={scrolled} view={view} setView={navigateTo} />}

      <CookieBanner />
      <EarlyBirdPopup setView={navigateTo} />

      <main
        className={`transition-all duration-500 ease-out ${
          isTransitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        }`}
      >
        {view === 'home' && (
          <>
            {/* 1. Hero Section */}
            <Hero setView={navigateTo} />
            {/* 2. Properties (Collection) Right Below Hero */}
            <Collection setView={navigateTo} />
            {/* 3. About Story & Figures */}
            <About setView={navigateTo} />
            {/* 4. Why Tinos Banner */}
            <QuoteHero setView={navigateTo} />
            {/* 5. Guest Reviews */}
            <Reviews setView={navigateTo} />
          </>
        )}

        {view === 'coming-soon' && (
          <div className="relative min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center pt-20">
            <button
              onClick={() => navigateTo('home')}
              className="absolute top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center transition-all duration-500"
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