import { ArrowLeft } from 'lucide-react';

export default function CookiesPolicy({ setView }) {
  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-white pt-32 pb-32">
      
      {/* Back navigation */}
      <button 
        onClick={goHome}
        className="fixed top-8 left-6 md:top-12 md:left-12 p-2 group flex items-center justify-center transition-all duration-500 z-50"
        aria-label="Return to Home"
      >
        <ArrowLeft 
          size={28} 
          strokeWidth={1} 
          className="text-[#191D30]/40 group-hover:text-[#191D30] group-hover:-translate-x-2 transition-all duration-500" 
        />
      </button>

      <div className="max-w-3xl mx-auto px-8 md:px-12">
        
        {/* Page header */}
        <div className="text-center mb-24">
          <h1 className="font-display text-2xl md:text-4xl tracking-[0.4em] text-[#191D30] uppercase mb-8">
            Cookies Policy
          </h1>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />
          <p className="font-body text-[11px] tracking-[0.2em] text-[#191D30]/50 uppercase">
            Last Updated: April 2026
          </p>
        </div>

        <div className="space-y-16 font-body font-light text-[13px] md:text-[14px] leading-[2.2] text-[#191D30]/80">
          
          <section>
            <h2 className="font-display text-[16px] md:text-[18px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              Information related to the Cookies Policy
            </h2>
            <div className="space-y-4">
              <p>
                At VacatiON, we use cookies to make your experience on our site better. The use of cookies helps us improve the site's functions, to make your browsing easier, and to assist you in your selections. Thus, we are able to provide you with personalised content and advertisements that are based on your interests and needs. In addition, cookies are used so that we can analyse our site's traffic and detect problematic pages that need improvement. Our goal is to improve our site in order to provide a continuously improved experience and services during visits by our users.
              </p>
              <p>
                At VacatiON, the primary goal is to protect the privacy of visitors to the website and, for this reason, the organisation adheres to a strict policy.
              </p>
              <p>
                We recommend that you spend a little time to read this policy, so that you can understand the type of cookies we use, the information we collect through the use of cookies, and how this information is utilised. By using our website, you agree to the use of cookies in accordance with this policy.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-[16px] md:text-[18px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              What are cookies?
            </h2>
            <p>
              "Cookies" are small files with information that a website saves on a user's computer (usually in the web navigation software such as Chrome, Safari, Mozilla, Firefox, Edge, etc.) so that every time the user connects to the website, it recovers the information in question and provides the user with services related to it. A typical example of such information includes the user's preferences on a website as these are expressed through the selections that the user makes on the specific site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[16px] md:text-[18px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              General information regarding the classification of Cookies
            </h2>
            <p className="mb-4">Two general categories of cookies exist:</p>
            <ul className="list-disc pl-6 space-y-4 mb-8">
              <li><strong>Technical cookies:</strong> these are necessary for the proper functioning of a website and navigation therein by the user. Without these, it is possible for the user not to be in a position to display the pages correctly or to use certain services.</li>
              <li><strong>Cookies for the creation of a profile:</strong> these are used to create user profiles for sending advertising messages according to the preferences that the user exhibits during navigation.</li>
            </ul>

            <p className="mb-4">Cookies can also be classified as:</p>
            <ul className="list-disc pl-6 space-y-4 mb-8">
              <li><strong>"Session" cookies</strong> which are immediately deleted when the navigation software is shut down.</li>
              <li><strong>"Permanent" cookies</strong> that remain in the navigation software for a specified period of time. These cookies are used, for example, to recognise the device connecting to a website, facilitating the user identification procedure.</li>
              <li><strong>"Proprietary" cookies</strong> which are created and are directly monitored by the operator of the website where the user is navigating.</li>
            </ul>

            <p className="mb-4">Our Website uses "technical" cookies, and more specifically the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li>Proprietary cookies, session cookies and permanent cookies, which are necessary for navigation of the Website, for purposes of internal security and system management.</li>
              <li>Third party cookies, permanent cookies that are used by the Website to send statistical information to Google Analytics, whereby the Company can conduct a statistical analysis of access/visits to the Website. You can block Google from collecting data through cookies by downloading the add-on from <a href="http://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-[#A18E7E] hover:text-[#191D30] transition-colors underline underline-offset-4">this address</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-[16px] md:text-[18px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              Specific Classification by Function
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-body font-medium text-[14px] uppercase tracking-wider mb-2">Strictly Necessary Cookies</h3>
                <p>These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. These cookies do not store any personally identifiable information.</p>
              </div>
              <div>
                <h3 className="font-body font-medium text-[14px] uppercase tracking-wider mb-2">Performance Cookies</h3>
                <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous.</p>
              </div>
              <div>
                <h3 className="font-body font-medium text-[14px] uppercase tracking-wider mb-2">Functional Cookies</h3>
                <p>These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages. If you do not allow these cookies then some or all of these services may not function properly.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-[16px] md:text-[18px] tracking-[0.2em] text-[#191D30] uppercase mb-6">
              How to control cookies
            </h2>
            <p>
              Most navigation software on the internet provide you with the ability to select whether or not you wish to use cookies. You can manage these settings directly through your browser (Chrome, Safari, Firefox, Edge, etc.). If you use a different browser, please refer to your provider's official information on cookie management.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}