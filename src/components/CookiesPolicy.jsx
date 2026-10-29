// src/components/CookiesPolicy.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Cookie } from 'lucide-react';
import { useLanguage } from '../data/siteData';

const POLICY_CONTENT = {
  en: {
    privacyTitle: 'Privacy Policy & Data Protection',
    cookiesTitle: 'Cookies Policy',
    updated: 'Last Updated: May 2026 · GDPR & Hellenic Law Compliant',
    privacySections: [
      {
        heading: '1. Data Controller & Legal Entity',
        body: 'This website is operated by THEODORA LEKASI PC, headquartered in Tinos, Cyclades, Hellenic Republic (Email: info@vacationofficial.com). We are committed to protecting your personal privacy in accordance with the European Union General Data Protection Regulation (GDPR - EU 2016/679) and Greek Law.',
      },
      {
        heading: '2. Personal & Reservation Data We Collect',
        body: 'When you submit a direct reservation inquiry or contact form, we collect only the information necessary to register your stay and comply with Greek hospitality tax regulations: Full Name, Email Address, Phone / WhatsApp Number, Check-in/Check-out Dates, Guest & Children Ages, and National ID / Passport / Tax Identification Number (SSN/AFM) required for official hospitality registration.',
      },
      {
        heading: '3. How We Protect Your Data',
        body: 'All guest communications and identification details are transmitted over encrypted HTTPS/TLS connections and restricted strictly to authorized personnel of THEODORA LEKASI PC. We never sell, rent, or trade guest data to third parties.',
      },
      {
        heading: '4. Your Rights Under GDPR',
        body: 'You have the right to request access to, correction of, or deletion of your personal data at any time by contacting info@vacationofficial.com.',
      },
    ],
    cookiesSections: [
      {
        heading: '1. What Are Cookies?',
        body: 'Cookies are small text files stored on your device when you visit our website. They help remember your language preference (English, Italian, or Greek) and ensure smooth navigation.',
      },
      {
        heading: '2. Essential & Analytical Cookies',
        body: 'We use strictly necessary cookies to store your cookie consent choice, language selection, and secure session state, alongside anonymous performance analytics to improve page loading speed.',
      },
      {
        heading: '3. How to Control Cookies',
        body: 'You can manage or delete cookies at any time directly through your browser settings (Safari, Chrome, Firefox, Edge).',
      },
    ],
  },
  it: {
    privacyTitle: 'Informativa sulla Privacy e Protezione dei Dati',
    cookiesTitle: 'Politica sui Cookie',
    updated: 'Ultimo Aggiornamento: Maggio 2026 · Conforme al GDPR UE',
    privacySections: [
      {
        heading: '1. Titolare del Trattamento',
        body: 'Questo sito web è gestito da THEODORA LEKASI PC, con sede a Tinos, Cicladi, Repubblica Ellenica (Email: info@vacationofficial.com), in conformità al Regolamento Generale sulla Protezione dei Dati (GDPR - UE 2016/679).',
      },
      {
        heading: '2. Dati Raccolti per le Prenotazioni',
        body: 'Quando invii una richiesta di prenotazione diretta, raccogliamo esclusivamente i dati necessari per confermare il soggiorno e adempiere agli obblighi fiscali dell’ospitalità greca: Nome e Cognome, Email, Telefono/WhatsApp, Date di Soggiorno, Età di Adulti/Bambini e Codice Fiscale / Documento d’Identità / Passaporto.',
      },
      {
        heading: '3. Sicurezza e Conservazione',
        body: 'Tutti i dati sono trasmessi tramite connessioni crittografate HTTPS/TLS e accessibili solo al personale autorizzato. Non cediamo mai i dati degli ospiti a terzi.',
      },
      {
        heading: '4. Diritti dell’Interessato',
        body: 'Puoi richiedere in qualsiasi momento l’accesso, la rettifica o la cancellazione dei tuoi dati scrivendo a info@vacationofficial.com.',
      },
    ],
    cookiesSections: [
      {
        heading: '1. Cosa Sono i Cookie?',
        body: 'I cookie sono piccoli file di testo salvati sul tuo dispositivo per ricordare la lingua selezionata (Inglese, Italiano o Greco) e garantire una navigazione fluida.',
      },
      {
        heading: '2. Gestione dei Cookie',
        body: 'Puoi gestire o disabilitare i cookie in qualsiasi momento dalle impostazioni del tuo browser.',
      },
    ],
  },
  el: {
    privacyTitle: 'Πολιτική Απορρήτου & Προστασίας Δεδομένων',
    cookiesTitle: 'Πολιτική Cookies',
    updated: 'Τελευταία Ενημέρωση: Μάιος 2026 · Συμμόρφωση με τον ΓΚΠΔ (GDPR)',
    privacySections: [
      {
        heading: '1. Υπεύθυνος Επεξεργασίας Δεδομένων',
        body: 'Ο παρών ιστότοπος λειτουργεί υπό την εταιρεία THEODORA LEKASI PC, με έδρα την Τήνο Κυκλάδων (Email: info@vacationofficial.com), σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (ΕΕ 2016/679 - GDPR) και την ελληνική νομοθεσία.',
      },
      {
        heading: '2. Δεδομένα Κρατήσεων που Συλλέγουμε',
        body: 'Κατά την υποβολή αιτήματος κράτησης, συλλέγουμε μόνο τα απαραίτητα στοιχεία για την εξυπηρέτησή σας και τη νόμιμη καταχώριση φιλοξενίας: Ονοματεπώνυμο, Email, Τηλέφωνο, Ημερομηνίες Διαμονής, Ηλικίες Παιδιών και ΑΦΜ / Αριθμό Ταυτότητας ή Διαβατηρίου.',
      },
      {
        heading: '3. Ασφάλεια Δεδομένων',
        body: 'Όλα τα στοιχεία μεταδίδονται μέσω κρυπτογραφημένων συνδέσεων HTTPS/TLS και τηρούνται αυστηρά εμπιστευτικά.',
      },
      {
        heading: '4. Τα Δικαιώματά Σας',
        body: 'Μπορείτε ανά πάσα στιγμή να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των προσωπικών σας δεδομένων στο info@vacationofficial.com.',
      },
    ],
    cookiesSections: [
      {
        heading: '1. Τι είναι τα Cookies;',
        body: 'Τα cookies είναι μικρά αρχεία κειμένου που αποθηκεύουν την προτίμηση γλώσσας (Αγγλικά, Ιταλικά, Ελληνικά) και εξασφαλίζουν την ομαλή λειτουργία του ιστότοπου.',
      },
      {
        heading: '2. Έλεγχος Cookies',
        body: 'Μπορείτε να διαχειριστείτε ή να διαγράψετε τα cookies μέσω των ρυθμίσεων του φυλλομετρητή σας.',
      },
    ],
  },
};

export default function CookiesPolicy({ mode = 'privacy', setView }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(
    mode === 'cookies' ? 'cookies' : 'privacy'
  );

  useEffect(() => {
    setActiveTab(mode === 'cookies' ? 'cookies' : 'privacy');
  }, [mode]);

  const content = POLICY_CONTENT[lang] || POLICY_CONTENT.en;
  const sections =
    activeTab === 'privacy' ? content.privacySections : content.cookiesSections;

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] text-[#191D30] pt-28 pb-32">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        {/* Back Button */}
        <button
          onClick={() => {
            setView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="rounded-full px-5 py-2.5 border border-[#191D30]/20 text-[#191D30] hover:bg-[#191D30] hover:text-white font-body text-[10px] tracking-[0.25em] uppercase inline-flex items-center gap-2.5 mb-12 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>{t.reservation.back}</span>
        </button>

        {/* Switcher Between Privacy Policy & Cookies Policy */}
        <div className="flex items-center gap-2 bg-white border border-[#191D30]/15 rounded-full p-1.5 w-fit mb-12">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`rounded-full px-5 py-2 font-body text-xs inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#191D30] text-white font-medium'
                : 'text-[#191D30]/65 hover:text-[#191D30]'
            }`}
          >
            <ShieldCheck size={14} />
            <span>{t.footer.privacy}</span>
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`rounded-full px-5 py-2 font-body text-xs inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-[#191D30] text-white font-medium'
                : 'text-[#191D30]/65 hover:text-[#191D30]'
            }`}
          >
            <Cookie size={14} />
            <span>{t.footer.cookies}</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-14">
          <h1 className="font-display text-3xl md:text-4xl tracking-[0.12em] text-[#191D30] uppercase mb-4">
            {activeTab === 'privacy' ? content.privacyTitle : content.cookiesTitle}
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mb-4" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/55 uppercase">
            {content.updated}
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 bg-white border border-[#191D30]/10 p-8 sm:p-12">
          {sections.map((sec) => (
            <section key={sec.heading}>
              <h2 className="font-display text-lg tracking-[0.12em] text-[#191D30] uppercase mb-3">
                {sec.heading}
              </h2>
              <p className="font-body font-light text-xs sm:text-sm leading-[2] text-[#191D30]/80">
                {sec.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}