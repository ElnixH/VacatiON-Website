// src/components/Footer.jsx
import { useState } from 'react';
import {
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  MapPin,
} from 'lucide-react';
import { BRAND_ASSETS, useLanguage } from '../data/siteData';
import SmoothImage from './SmoothImage';

const FOOTER_GALLERY_STRIP = [
  '/images/properties/villa-leonora/image00016.webp',
  '/images/properties/andreas-house/image00006 (1).webp',
  '/images/properties/villa-leonora/image00002.webp',
  '/images/attractions/pyrgos.webp',
];

export default function Footer({ setView }) {
  const { t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNav = (e, targetView) => {
    e.preventDefault();
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#191D30] text-white">
      {/* 4-Photo Straight Square Gallery Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 w-full">
        {FOOTER_GALLERY_STRIP.map((src, idx) => (
          <div
            key={src}
            onClick={() => setView('media')}
            className="relative aspect-square w-full overflow-hidden rounded-none cursor-pointer group"
          >
            <SmoothImage
              src={src}
              alt={`Vacation Tinos highlight ${idx + 1}`}
              containerClassName="w-full h-full rounded-none"
              className="w-full h-full object-cover rounded-none transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#191D30]/15 group-hover:bg-transparent transition-colors" />
          </div>
        ))}
      </div>

      {/* Newsletter Banner Row */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 border-b border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl tracking-[0.06em] text-white mb-2">
              {t.footer.exclusiveTitle}
            </h3>
            <p className="font-body font-light text-[13px] text-white/65">
              {t.footer.exclusiveSub}
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-md"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="name@email.com"
              className="flex-1 rounded-full bg-white/5 border border-white/20 px-6 py-3.5 text-[12px] text-white placeholder:text-white/45 focus:outline-none focus:border-[#A18E7E]"
            />
            <button
              type="submit"
              className="rounded-full bg-white text-[#191D30] px-7 py-3.5 font-body text-[11px] tracking-[0.2em] uppercase inline-flex items-center justify-center gap-2 hover:bg-[#A18E7E] hover:text-white transition-all duration-500 cursor-pointer"
            >
              <span>{subscribed ? t.footer.thankYou : t.footer.subscribe}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img
              src={BRAND_ASSETS.logo}
              alt="Vacation Tinos"
              className="h-7 w-auto object-contain brightness-0 invert mb-6"
            />
            <p className="font-body font-light text-[13px] leading-[1.9] text-white/65 mb-6">
              {t.about.p1}
            </p>
            <div className="flex items-center gap-4 text-white/60">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A18E7E] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A18E7E] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A18E7E] transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={17} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A18E7E] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs tracking-[0.25em] text-[#A18E7E] uppercase mb-6">
              {t.footer.sanctuaries}
            </h4>
            <ul className="space-y-3 font-body text-[13px] text-white/75">
              <li>
                <a
                  href="#villa-leonora"
                  onClick={(e) => handleNav(e, 'villa-leonora')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.villaLeonora}
                </a>
              </li>
              <li>
                <a
                  href="#andreas-traditional"
                  onClick={(e) => handleNav(e, 'andreas-traditional')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.traditionalHouse}
                </a>
              </li>
              <li>
                <a
                  href="#andreas-two-bed"
                  onClick={(e) => handleNav(e, 'andreas-two-bed')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.twoBedHouse}
                </a>
              </li>
              <li>
                <a
                  href="#discover-tinos"
                  onClick={(e) => handleNav(e, 'discover-tinos')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.discoverTinos}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs tracking-[0.25em] text-[#A18E7E] uppercase mb-6">
              {t.footer.information}
            </h4>
            <ul className="space-y-3 font-body text-[13px] text-white/75">
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNav(e, 'contact')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.contact}
                </a>
              </li>
              <li>
                <a
                  href="#media"
                  onClick={(e) => handleNav(e, 'media')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.media}
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  onClick={(e) => handleNav(e, 'privacy')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a
                  href="#cookies"
                  onClick={(e) => handleNav(e, 'cookies')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.cookies}
                </a>
              </li>
              <li>
                <a
                  href="#legal"
                  onClick={(e) => handleNav(e, 'legal')}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.legal}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs tracking-[0.25em] text-[#A18E7E] uppercase mb-6">
              {t.footer.contactAddress}
            </h4>
            <div className="space-y-4 font-body text-[13px] text-white/75">
              <p className="flex items-center gap-3">
                <Mail size={15} className="text-[#A18E7E] flex-shrink-0" />
                <a
                  href="mailto:info@vacationofficial.com"
                  className="hover:text-white transition-colors"
                >
                  info@vacationofficial.com
                </a>
              </p>
              <p className="flex items-start gap-3">
                <MapPin size={15} className="text-[#A18E7E] flex-shrink-0 mt-1" />
                <span>
                  THEODORA LEKASI PC <br />
                  Arnados &amp; Agios Sostis, Tinos <br />
                  Cyclades, Hellenic Republic
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-body tracking-[0.2em] text-white/50 uppercase">
          <p>
            © {new Date().getFullYear()} VACATION. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={(e) => handleNav(e, 'privacy')}
              className="hover:text-white transition-colors uppercase cursor-pointer"
            >
              {t.footer.privacy}
            </button>
            <span>|</span>
            <button
              onClick={(e) => handleNav(e, 'legal')}
              className="hover:text-white transition-colors uppercase cursor-pointer"
            >
              {t.footer.legal}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}