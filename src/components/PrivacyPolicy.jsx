import { ArrowLeft, ShieldCheck, Cookie } from 'lucide-react';

export default function PrivacyPolicy({ setView }) {
  const goHome = () => {
    setView('home');
  };

  const handleReopenCookieBanner = () => {
    localStorage.removeItem('vacation_cookie_consent');
    window.dispatchEvent(new Event('reopen-cookie-banner'));
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-32 pb-32">
      {/* Back navigation */}
      <button
        onClick={goHome}
        className="fixed top-20 left-6 md:top-24 md:left-12 p-2.5 rounded-lg bg-white border border-[#191D30]/10 shadow-xs group flex items-center justify-center transition-all duration-300 z-40 hover:bg-[#191D30]"
        aria-label="Return to Home"
      >
        <ArrowLeft
          size={22}
          strokeWidth={1.2}
          className="text-[#191D30] group-hover:text-white group-hover:-translate-x-1 transition-all duration-300"
        />
      </button>

      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        {/* Page Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A18E7E]/15 text-[#A18E7E] font-body text-[10px] tracking-[0.25em] uppercase mb-5">
            <ShieldCheck size={13} /> Data Protection &amp; GDPR
          </div>
          <h1 className="font-display text-3xl md:text-5xl tracking-[0.3em] text-[#191D30] uppercase mb-6">
            Privacy Policy
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-6" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/55 uppercase">
            Last updated: October 2026
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-2xl border border-[#191D30]/10 p-8 sm:p-12 shadow-xs space-y-12 font-body font-light text-[13.5px] md:text-[14px] leading-[2.1] text-[#191D30]/80">
          {/* 1. Who we are */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              1. Who we are
            </h2>
            <div className="space-y-4">
              <p>
                <strong>Vacation</strong> is the name used for the accommodation collection featured on{' '}
                <strong>vacationofficial.com</strong>, including <strong>Andrea’s Traditional House</strong>,{' '}
                <strong>Andrea’s Two-Bedroom House</strong>, and <strong>Villa Leonora</strong> in Tinos, Greece.
              </p>
              <p>
                The data controller responsible for personal data described in this policy is{' '}
                <strong>THEODORA LEKASI PC</strong> (Private Company / I.K.E., G.E.MI. Number:{' '}
                <strong>192807138000</strong>, VAT / AFM: <strong>803239089</strong>), trading as{' '}
                <strong>Vacation</strong>, with a registered address at{' '}
                <strong>Tinos, Cyclades, Hellenic Republic (Greece)</strong>.
              </p>
              <p>
                For privacy questions or requests, contact us at{' '}
                <a
                  href="mailto:info@vacationofficial.com"
                  className="text-[#A18E7E] hover:text-[#191D30] underline underline-offset-4 transition-colors"
                >
                  info@vacationofficial.com
                </a>
                .
              </p>
            </div>
          </section>

          {/* 2. Personal data we collect */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              2. Personal data we collect
            </h2>
            <p className="mb-4">
              Depending on how you use the website and our services, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li>
                <strong>Enquiry details:</strong> your name, email address, phone/WhatsApp number, requested dates, guest numbers, preferred property, estimated arrival time, and the contents of your message.
              </li>
              <li>
                <strong>Reservation and stay details:</strong> information needed to manage a booking and your stay, such as guest names, contact details, dates, preferences, and communications about the reservation.
              </li>
              <li>
                <strong>Payment and partner booking information:</strong> online instant bookings completed via our partner platform (Booking.com) are processed under Booking.com’s secure payment infrastructure. For direct reservations arranged with us, we process bank-transfer or invoice transaction details needed to confirm your reservation and comply with Greek tax regulations. This website does not directly collect or store payment-card numbers.
              </li>
              <li>
                <strong>Newsletter information:</strong> your email address and whether you have subscribed, unsubscribed, or changed your preferences.
              </li>
              <li>
                <strong>Website and device information:</strong> technical information such as IP address, browser and device details, pages viewed, referral information, and cookie choices, depending on the website and cookie settings.
              </li>
            </ul>
            <p>Please provide only information that is relevant to your enquiry or stay.</p>
          </section>

          {/* 3. How and why we use your data */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              3. How and why we use your data
            </h2>
            <p className="mb-4">We use personal data to:</p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li>
                reply to enquiries and handle reservation requests, where processing is needed to take steps at your request or perform a booking contract;
              </li>
              <li>
                manage stays, guest communications, and related concierge services, where processing is needed to perform a contract;
              </li>
              <li>
                send newsletters or seasonal updates, where you have consented; you can withdraw consent at any time;
              </li>
              <li>
                operate, secure, and troubleshoot the website, where necessary for our legitimate interests in running a reliable service;
              </li>
              <li>
                meet legal obligations, including applicable Greek tax, accounting, hospitality registration, and record-keeping duties; and
              </li>
              <li>
                use optional analytics, advertising, or personalisation cookies only where you have given the required consent.
              </li>
            </ul>
            <p>
              Where we ask for information needed to respond to an enquiry or manage a booking, not providing it may mean we cannot provide that service.
            </p>
          </section>

          {/* 4. Cookies and similar technologies */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              4. Cookies and similar technologies
            </h2>
            <div className="space-y-4">
              <p>
                The website uses a cookie-consent banner. Its notice refers to cookies used for website functionality, traffic analysis, and personalised content. Detailed information about cookie categories is available in our{' '}
                <button
                  onClick={() => setView('cookies')}
                  className="text-[#A18E7E] hover:text-[#191D30] underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Cookies Policy
                </button>
                .
              </p>
              <p>
                You can change or withdraw your cookie choices at any time by clicking the button below to reopen the consent banner, or by managing cookies in your browser settings (although blocking strictly necessary cookies may affect website functionality).
              </p>
              <div className="pt-2">
                <button
                  onClick={handleReopenCookieBanner}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF9F6] border border-[#191D30]/15 hover:border-[#191D30] text-[#191D30] text-xs font-body tracking-wider uppercase transition-all cursor-pointer"
                >
                  <Cookie size={14} className="text-[#A18E7E]" />
                  <span>Reopen Cookie Consent Settings</span>
                </button>
              </div>
            </div>
          </section>

          {/* 5. Who we share data with */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              5. Who we share data with
            </h2>
            <p className="mb-4">
              We may share relevant data with trusted service providers who help us operate the website and provide accommodation services, including:
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-4">
              <li>
                <strong>Website hosting and delivery providers:</strong> Vercel Inc. (for secure cloud hosting and content delivery);
              </li>
              <li>
                <strong>Enquiry &amp; reservation form processing:</strong> Formspree Inc. (for transmitting direct contact and reservation request submissions to our concierge team);
              </li>
              <li>
                <strong>Online reservation partners:</strong> Booking.com B.V. (when you choose to check availability or complete an online booking via Booking.com);
              </li>
              <li>
                <strong>Email and guest communications:</strong> our business email and WhatsApp Business communication channels when you opt to message our concierge; and
              </li>
              <li>
                <strong>Analytics providers:</strong> Google Analytics (only where enabled and consented to).
              </li>
            </ul>
            <p>
              These providers process data on our behalf or, in the case of external booking platforms like Booking.com, under their own independent privacy notices. We may also disclose information when required by Greek or EU law or necessary to establish, exercise, or defend legal claims.
            </p>
          </section>

          {/* 6. International transfers */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              6. International transfers
            </h2>
            <p>
              Some technical service providers (such as Formspree Inc., Vercel Inc., or Google LLC) may process personal data outside the European Economic Area (including in the United States). Where this happens, we rely on transfer mechanisms permitted by applicable EU data-protection law (GDPR), such as the EU-U.S. Data Privacy Framework adequacy decisions or European Commission Standard Contractual Clauses (SCCs). You can contact us for more information about relevant safeguards.
            </p>
          </section>

          {/* 7. How long we keep data */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              7. How long we keep data
            </h2>
            <p className="mb-4">
              We keep personal data only as long as needed for the purposes described above and for any legal obligations or claims. In particular:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Enquiry data</strong> is kept while the enquiry is handled and for up to <strong>24 months</strong> afterwards for follow-up guest service unless you request earlier deletion;
              </li>
              <li>
                <strong>Reservation, invoicing, and transaction records</strong> are kept for the statutory periods required by Greek tax and commercial law (typically up to <strong>5 to 10 years</strong>);
              </li>
              <li>
                <strong>Newsletter details</strong> are kept until you unsubscribe, except for the minimum information needed to record and respect your opt-out; and
              </li>
              <li>
                <strong>Cookie and technical records</strong> are kept for the periods stated in our Cookies Policy (such as local consent preferences stored in your browser).
              </li>
            </ul>
          </section>

          {/* 8. Your rights */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              8. Your rights
            </h2>
            <p className="mb-4">Subject to applicable law (including the GDPR), you may ask us to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>provide access to your personal data;</li>
              <li>correct inaccurate or incomplete data;</li>
              <li>erase data or restrict its processing;</li>
              <li>provide certain data in a portable format;</li>
              <li>stop processing based on legitimate interests; or</li>
              <li>stop sending direct marketing.</li>
            </ul>
            <p className="mb-4">
              If we rely on your consent, you may withdraw it at any time. This does not affect processing that took place before withdrawal. To exercise a right, contact{' '}
              <a
                href="mailto:info@vacationofficial.com"
                className="text-[#A18E7E] hover:text-[#191D30] underline underline-offset-4"
              >
                info@vacationofficial.com
              </a>
              . We may ask for information needed to verify your identity.
            </p>
            <p>
              You may also lodge a complaint with the <strong>Hellenic Data Protection Authority (HDPA)</strong> at{' '}
              <a
                href="https://www.dpa.gr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A18E7E] hover:text-[#191D30] underline underline-offset-4"
              >
                www.dpa.gr
              </a>
              , or with the supervisory authority where you live or work.
            </p>
          </section>

          {/* 9. Security */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              9. Security
            </h2>
            <p>
              We use appropriate technical and organisational measures (including HTTPS/TLS encryption and restricted administrative access) to protect personal data. No online service can guarantee absolute security, but we take steps to limit access to data to people and providers who need it for their work.
            </p>
          </section>

          {/* 10. Changes to this policy */}
          <section>
            <h2 className="font-display text-[15px] md:text-[17px] tracking-[0.2em] text-[#191D30] uppercase mb-4">
              10. Changes to this policy
            </h2>
            <p>
              We may update this policy to reflect changes to the website, our services, or applicable law. The latest version will be posted on this page with its update date.
            </p>
          </section>

          {/* Contact Summary Box */}
          <section className="p-6 rounded-xl bg-[#FAF9F6] border border-[#191D30]/10">
            <h2 className="font-display text-sm tracking-[0.25em] text-[#191D30] uppercase mb-4">
              Contact &amp; Data Controller
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <strong>Data controller:</strong> THEODORA LEKASI PC (trading as Vacation)
              </li>
              <li>
                <strong>G.E.MI. / VAT:</strong> 192807138000 / AFM 803239089
              </li>
              <li>
                <strong>Postal address:</strong> Tinos, Cyclades, Hellenic Republic (Greece)
              </li>
              <li>
                <strong>Privacy email:</strong>{' '}
                <a href="mailto:info@vacationofficial.com" className="text-[#A18E7E] underline">
                  info@vacationofficial.com
                </a>
              </li>
              <li>
                <strong>Website:</strong> vacationofficial.com
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}