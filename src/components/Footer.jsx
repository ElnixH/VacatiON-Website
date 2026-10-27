import { useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight, Check } from 'lucide-react';
import { BRAND_ASSETS, PROPERTIES, TINOS_ATTRACTIONS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

const FOOTER_GALLERY = [
  PROPERTIES['villa-leonora'].coverImage,
  PROPERTIES['villa-leonora'].gallery[1],
  TINOS_ATTRACTIONS.villages[0].image,
  PROPERTIES['andreas-traditional'].coverImage,
  PROPERTIES['andreas-two-bed'].coverImage,
];

export default function Footer({ setView }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNav = (e, targetView) => {
    e.preventDefault();
    setView(targetView);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#FAF9F6] text-[#191D30] border-t border-[#191D30]/10">
      {/* 1. TOP 5-PHOTO VISUAL GALLERY STRIP (Inspired by Trexon Footer) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-12">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {FOOTER_GALLERY.map((src, idx) => (
            <div
              key={src}
              onClick={() => setView('media')}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <SmoothImage
                src={src}
                alt={`VacatiON Tinos ${idx + 1}`}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#191D30]/0 group-hover:bg-[#191D30]/25 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 pt-16 pb-12">
        {/* Newsletter Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-14 mb-14 border-b border-[#191D30]/10">
          <div className="max-w-md">
            <h3 className="font-display text-2xl sm:text-3xl text-[#191D30] tracking-wide mb-2">
              {t.footer.newsletterTitle}
            </h3>
            <p className="font-body font-light text-xs text-[#191D30]/70 leading-relaxed">
              {t.footer.newsletterSub}
            </p>
          </div>

          {subscribed ? (
            <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#191D30] text-white font-body text-xs tracking-wider">
              <Check size={15} className="text-[#A18E7E]" />
              <span>Thank you for subscribing to VacatiON!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex items-center w-full max-w-md bg-white rounded-full p-1.5 border border-[#191D30]/15 shadow-xs"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.emailPlaceholder}
                className="flex-1 bg-transparent px-4 py-2 text-xs font-body text-[#191D30] placeholder:text-[#191D30]/40 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#191D30] hover:bg-[#A18E7E] text-white font-body text-[10px] tracking-[0.2em] uppercase font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>{t.footer.subscribeBtn}</span>
                <ArrowRight size={12} />
              </button>
            </form>
          )}
        </div>

        {/* Multi-Column Links, Contact & Brand Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#191D30]/10">
          {/* Brand Column (5 Cols) — Dark Blue #191D30 Logo + Clean Social Icons */}
          <div className="md:col-span-5 space-y-5">
            <div
              onClick={() => setView('home')}
              aria-label="VacatiON Home"
              className="inline-block bg-[#191D30] hover:bg-[#A18E7E] transition-colors duration-300 cursor-pointer"
              style={{
                WebkitMaskImage: `url(${BRAND_ASSETS.logo})`,
                maskImage: `url(${BRAND_ASSETS.logo})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'left center',
                maskPosition: 'left center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
              }}
            >
              <img
                src={BRAND_ASSETS.logo}
                alt="VacatiON Logo"
                className="h-7 w-auto opacity-0 pointer-events-none select-none"
              />
            </div>

            <p className="font-display italic text-sm tracking-[0.15em] text-[#A18E7E]">
              ~ {t.nav.tagline} · Tinos Island, Cyclades ~
            </p>

            <p className="font-body font-light text-xs text-[#191D30]/70 max-w-xs leading-relaxed">
              Curated luxury villas and Cycladic houses in Arnados and Agios Sostis, Tinos.
            </p>

            {/* Social Icons: Facebook, Instagram, and Custom Crisp YouTube SVG (LinkedIn Removed) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-[#191D30]/15 hover:border-[#191D30] hover:bg-[#191D30] text-[#191D30] hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-[#191D30]/15 hover:border-[#191D30] hover:bg-[#191D30] text-[#191D30] hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <svg
                  className="w-4 h-4 stroke-current"
                  fill="none"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* YouTube (Custom Crisp SVG so it never breaks) */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full border border-[#191D30]/15 hover:border-[#191D30] hover:bg-[#191D30] text-[#191D30] hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links Column (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-xs tracking-[0.25em] text-[#A18E7E] uppercase mb-4">
              {t.footer.linksTitle}
            </h4>
            <ul className="space-y-3 text-xs font-body">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleNav(e, 'home')}
                  className="text-[#191D30]/75 hover:text-[#191D30] transition-colors"
                >
                  {t.footer.home}
                </a>
              </li>
              <li>
                <a
                  href="#villa-leonora"
                  onClick={(e) => handleNav(e, 'villa-leonora')}
                  className="text-[#191D30]/75 hover:text-[#191D30] transition-colors"
                >
                  Villa Leonora
                </a>
              </li>
              <li>
                <a
                  href="#andreas-traditional"
                  onClick={(e) => handleNav(e, 'andreas-traditional')}
                  className="text-[#191D30]/75 hover:text-[#191D30] transition-colors"
                >
                  Andrea&apos;s Traditional House
                </a>
              </li>
              <li>
                <a
                  href="#andreas-two-bed"
                  onClick={(e) => handleNav(e, 'andreas-two-bed')}
                  className="text-[#191D30]/75 hover:text-[#191D30] transition-colors"
                >
                  Andrea&apos;s Two-Bedroom House
                </a>
              </li>
              <li>
                <a
                  href="#discover-tinos"
                  onClick={(e) => handleNav(e, 'discover-tinos')}
                  className="text-[#191D30]/75 hover:text-[#191D30] transition-colors"
                >
                  {t.nav.discoverTinos}
                </a>
              </li>
              <li>
                <a
                  href="#media"
                  onClick={(e) => handleNav(e, 'media')}
                  className="text-[#191D30]/75 hover:text-[#191D30] transition-colors"
                >
                  {t.footer.media}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Address Column (4 Cols) */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <h4 className="font-display text-xs tracking-[0.25em] text-[#A18E7E] uppercase mb-4">
                {t.footer.contactTitle}
              </h4>
              <div className="space-y-2.5 text-xs font-body text-[#191D30]/80">
                <a
                  href="tel:+306973952375"
                  className="flex items-center gap-2.5 hover:text-[#A18E7E] transition-colors"
                >
                  <Phone size={14} className="text-[#A18E7E]" />
                  <span>+30 697 395 2375</span>
                </a>
                <a
                  href="tel:+447703341841"
                  className="flex items-center gap-2.5 hover:text-[#A18E7E] transition-colors"
                >
                  <Phone size={14} className="text-[#A18E7E]" />
                  <span>+44 770 334 1841</span>
                </a>
                <a
                  href="mailto:info@vacationofficial.com"
                  className="flex items-center gap-2.5 hover:text-[#A18E7E] transition-colors"
                >
                  <Mail size={14} className="text-[#A18E7E]" />
                  <span>info@vacationofficial.com</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display text-xs tracking-[0.25em] text-[#A18E7E] uppercase mb-2">
                {t.footer.addressTitle}
              </h4>
              <p className="flex items-start gap-2.5 text-xs font-body text-[#191D30]/75 leading-relaxed">
                <MapPin size={14} className="text-[#A18E7E] shrink-0 mt-0.5" />
                <span>
                  THEODORA LEKASI PC · Arnados &amp; Agios Sostis, Tinos, Cyclades, Greece
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-body text-[#191D30]/60">
          <p>© Vacation 2026 · All Rights Reserved · G.E.MI. 192807138000</p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#privacy"
              onClick={(e) => handleNav(e, 'privacy')}
              className="hover:text-[#191D30] transition-colors"
            >
              {t.footer.privacy}
            </a>
            <a
              href="#cookies"
              onClick={(e) => handleNav(e, 'cookies')}
              className="hover:text-[#191D30] transition-colors"
            >
              {t.footer.cookies}
            </a>
            <a
              href="#legal"
              onClick={(e) => handleNav(e, 'legal')}
              className="hover:text-[#191D30] transition-colors font-medium text-[#191D30]"
            >
              {t.footer.legal}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}