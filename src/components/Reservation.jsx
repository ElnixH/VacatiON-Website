import { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function Reservation({ setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [property, setProperty] = useState('andreas-traditional');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const goHome = () => {
    setView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending request...');

    const formData = {
      name,
      email,
      phone,
      property,
      checkIn,
      checkOut,
      guests,
      message,
      type: 'Early Bird 2027 Reservation', 
    };

    try {
      // FIXED: Now using your brand new Early Bird Formspree endpoint
      const response = await fetch('https://formspree.io/f/xrpzvrgd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Reservation request sent successfully! We will contact you shortly.');
        setName('');
        setEmail('');
        setPhone('');
        setProperty('andreas-traditional');
        setCheckIn('');
        setCheckOut('');
        setGuests('2');
        setMessage('');
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Could not send message.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] pt-32 pb-32">
      
      {/* Back Button */}
      <button
        onClick={goHome}
        className="fixed top-8 left-6 md:top-12 md:left-12 p-2 group z-50"
      >
        <ArrowLeft
          size={28}
          strokeWidth={1}
          className="text-[#191D30]/40 group-hover:text-[#191D30] transform-gpu transition-transform duration-500 ease-out group-hover:-translate-x-2"
        />
      </button>

      <div className="max-w-[1200px] mx-auto px-8 md:px-12">

        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="font-display text-2xl md:text-4xl tracking-[0.4em] text-[#191D30] uppercase mb-8">
            Request a Reservation
          </h1>

          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />

          {status && (
            <p className="font-body text-sm text-[#A18E7E]">
              {status}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">

          {/* Left Side - Early Bird Info */}
          <div className="space-y-16">
            <div className="bg-[#191D30] p-10 text-[#FAF9F6] relative overflow-hidden">
              <Calendar className="absolute -right-4 -bottom-4 w-32 h-32 text-[#FAF9F6]/5" />
              
              <h2 className="font-display text-[14px] tracking-[0.3em] text-[#A18E7E] uppercase mb-6 relative z-10">
                Early Bird 2027
              </h2>

              <div className="font-body font-light text-[13px] leading-[2.2] tracking-wider relative z-10">
                <p className="mb-4">
                  We are currently accepting advance reservations for the 2027 summer season.
                </p>
                <p className="text-[#FAF9F6]/70">
                  Secure your preferred dates now and enjoy exclusive advance rates. Our team will review your request and contact you within 24 hours to confirm availability.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-[11px] tracking-[0.2em] text-[#A18E7E] uppercase mb-4">
                Need Help?
              </h3>

              <div className="flex flex-col space-y-3">
                <a
                  href="mailto:info@vacationofficial.com"
                  className="font-body text-[13px] tracking-widest text-[#191D30] hover:text-[#A18E7E] transition-colors lowercase"
                >
                  info@vacationofficial.com
                </a>
                <a
                  href="tel:+306973952375"
                  className="font-body text-[13px] tracking-widest text-[#191D30] hover:text-[#A18E7E] transition-colors"
                >
                  00 30 697 3952375
                </a>
                <a
                  href="tel:+447703341841"
                  className="font-body text-[13px] tracking-widest text-[#191D30] hover:text-[#A18E7E] transition-colors"
                >
                  00 44 770 3341841
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <h2 className="font-display text-[14px] tracking-[0.3em] text-[#191D30] uppercase mb-10">
              Booking Details
            </h2>

            <form className="space-y-10" onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] text-[#191D30] focus:outline-none focus:border-[#A18E7E]"
                  />
                  <label className="absolute left-0 top-3 text-[11px] tracking-[0.2em] uppercase text-[#191D30]/50 transition-all peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#A18E7E] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-[9px]">
                    Full Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] text-[#191D30] focus:outline-none focus:border-[#A18E7E]"
                  />
                  <label className="absolute left-0 top-3 text-[11px] tracking-[0.2em] uppercase text-[#191D30]/50 transition-all peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#A18E7E] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-[9px]">
                    Email Address
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-3 text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50">
                  Phone Number
                </label>
                <PhoneInput
                  country={'us'}
                  value={phone}
                  onChange={setPhone}
                  enableSearch
                  inputProps={{ required: true, name: 'phone' }}
                  containerClass="!w-full"
                  inputClass="!w-full !h-[52px] !bg-transparent !border-0 !border-b !border-[#191D30]/20 !rounded-none !pl-[60px] !text-[13px] !text-[#191D30] focus:!shadow-none"
                  buttonClass="!bg-transparent !border-0 !border-b !border-[#191D30]/20 !rounded-none"
                  dropdownClass="!text-[#191D30]"
                />
              </div>

              <div className="relative">
                <label className="block mb-1 text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50">
                  Select Property
                </label>
                <select
                  value={property}
                  onChange={(e) => setProperty(e.target.value)}
                  className="w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] uppercase tracking-wider text-[#191D30] focus:outline-none focus:border-[#A18E7E] appearance-none"
                >
                  <option value="andreas-traditional">Andrea's - Traditional House</option>
                  <option value="andreas-two-bed">Andrea's - Two Bedroom House</option>
                  <option value="villa-leonora">Villa Leonora</option>
                </select>
                <div className="absolute right-0 bottom-4 text-[#191D30]/50 pointer-events-none">
                  ▼
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-1 text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] text-[#191D30] focus:outline-none focus:border-[#A18E7E]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] text-[#191D30] focus:outline-none focus:border-[#A18E7E]"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block mb-1 text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] text-[#191D30] focus:outline-none focus:border-[#A18E7E]"
                  />
                </div>
              </div>

              <div className="relative mt-8">
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] text-[#191D30] resize-none focus:outline-none focus:border-[#A18E7E]"
                />
                <label className="absolute left-0 top-3 text-[11px] tracking-[0.2em] uppercase text-[#191D30]/50 transition-all peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#A18E7E] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-[9px]">
                  Additional Requests (Optional)
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-8 px-10 py-5 bg-[#191D30] text-white text-[10px] tracking-[0.3em] uppercase hover:bg-[#A18E7E] transition-colors duration-300"
              >
                Submit Request
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}