// Cleaned and improved phone input styling + connected country prefix with number input

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function ContactUs({ setView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // The state that holds standard dropdown value (defaulting to 'reservation')
  const [subject, setSubject] = useState('reservation');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus('Sending...');

    // The subject state here contains standard current selection from standard dropdown
    const formData = {
      name,
      email,
      phone,
      subject, 
      message,
    };

    try {
      const response = await fetch('https://formspree.io/f/xjglndja', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        setName('');
        setEmail('');
        setPhone('');
        setSubject('reservation'); // Resets to default after success
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
          className="text-[#191D30]/40 group-hover:text-[#191D30] group-hover:-translate-x-2 transition-all duration-500"
        />
      </button>

      <div className="max-w-[1200px] mx-auto px-8 md:px-12">

        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="font-display text-2xl md:text-4xl tracking-[0.4em] text-[#191D30] uppercase mb-8">
            Contact Us
          </h1>

          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-8" />

          {status && (
            <p className="font-body text-sm text-[#A18E7E]">
              {status}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">

          {/* Left Side */}
          <div className="space-y-16">

            <div>
              <h2 className="font-display text-[14px] tracking-[0.3em] text-[#191D30] uppercase mb-6">
                Headquarters
              </h2>

              <div className="font-body font-light text-[13px] leading-[2] text-[#191D30]/70 uppercase tracking-wider">
                <p>THEODORA LEKASI PC</p>
                <p>Tinos, Cyclades</p>
                <p>Hellenic Republic</p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-[11px] tracking-[0.2em] text-[#A18E7E] uppercase mb-2">
                Enquiries
              </h3>

              <a
                href="mailto:info@vacationofficial.com"
                className="font-body text-[13px] tracking-widest text-[#191D30] hover:text-[#A18E7E] transition-colors lowercase"
              >
                info@vacationofficial.com
              </a>
            </div>

          </div>

          {/* Form */}
          <div>
            <h2 className="font-display text-[14px] tracking-[0.3em] text-[#191D30] uppercase mb-10">
              Direct Inquiry
            </h2>

            <form className="space-y-10" onSubmit={handleSubmit}>

              {/* Name */}
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

              {/* Email */}
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

              {/* Phone Input */}
              <div>
                <label className="block mb-3 text-[9px] tracking-[0.2em] uppercase text-[#191D30]/50">
                  Phone Number
                </label>

                <PhoneInput
                  country={'us'}
                  value={phone}
                  onChange={setPhone}
                  enableSearch
                  inputProps={{
                    required: true,
                    name: 'phone',
                  }}
                  containerClass="!w-full"
                  inputClass="!w-full !h-[52px] !bg-transparent !border-0 !border-b !border-[#191D30]/20 !rounded-none !pl-[60px] !text-[13px] !text-[#191D30] focus:!shadow-none"
                  buttonClass="!bg-transparent !border-0 !border-b !border-[#191D30]/20 !rounded-none"
                  dropdownClass="!text-[#191D30]"
                />
              </div>

              {/* Subject Dropdown */}
              <div className="relative">
                <select
                  value={subject} // Listens to the state
                  onChange={(e) => setSubject(e.target.value)} // Updates the state
                  className="w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] uppercase tracking-wider text-[#191D30] focus:outline-none focus:border-[#A18E7E]"
                >
                  <option value="reservation">Reservation Inquiry</option>
                  <option value="event">Private Events</option>
                  <option value="career">Careers</option>
                  <option value="other">General Question</option>
                </select>

                <div className="absolute right-0 top-4 text-[#191D30]/50 pointer-events-none">
                  ▼
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-[#191D30]/20 py-3 text-[13px] text-[#191D30] resize-none focus:outline-none focus:border-[#A18E7E]"
                />

                <label className="absolute left-0 top-3 text-[11px] tracking-[0.2em] uppercase text-[#191D30]/50 transition-all peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#A18E7E] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-[9px]">
                  Your Message
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full mt-8 px-10 py-5 bg-[#191D30] text-white text-[10px] tracking-[0.3em] uppercase hover:bg-[#A18E7E] transition-colors duration-300"
              >
                Send Inquiry
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}