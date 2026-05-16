import { Star } from 'lucide-react';

export default function Reviews() {
  const reviews = [
    {
      name: 'James Mitchell',
      title: 'Architectural Consultant',
      rating: 5,
      text: 'Living at Vacation has been an absolute game-changer. The silent luxury, the community, and the architectural design are unparalleled.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    },
    {
      name: 'Sarah Thompson',
      title: 'Global Executive',
      rating: 5,
      text: 'The attention to detail is incredible. Every suite, every common space is designed with a sense of architectural perfection.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    },
    {
      name: 'David Chen',
      title: 'Technology Director',
      rating: 5,
      text: 'Vacation offers the perfect blend of silence, convenience, and modern aesthetic. Highly recommended for the discerning resident.',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    },
  ];

  return (
    <section id="reviews" className="py-32 bg-[#191D30]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header: Centered & Sophisticated */}
        <div className="text-center mb-24">
          <h2 className="font-display text-2xl md:text-3xl tracking-[0.4em] text-white uppercase mb-4">
            Guest Experiences
          </h2>
          <div className="w-12 h-[1px] bg-[#A18E7E] mx-auto mb-6" />
          <p className="font-body font-light text-[11px] tracking-[0.2em] text-[#A18E7E] uppercase">
            
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="group relative flex flex-col p-8 border border-white/5 bg-white/[0.02] rounded-md transition-all duration-500 hover:bg-white/[0.04] hover:border-[#A18E7E]/30"
            >
              {/* Rating: Using Stone color instead of Amber */}
              <div className="flex gap-1 mb-8 transition-transform duration-500 group-hover:-translate-y-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={12} className="fill-[#A18E7E] text-[#A18E7E]" />
                ))}
              </div>

              {/* Text: Inter font for readability */}
              <p className="font-body font-light text-[14px] leading-[1.8] text-[#A9ABB1]/80 mb-10 italic">
                "{review.text}"
              </p>

              {/* Author Section */}
              <div className="mt-auto flex items-center gap-4">
                <div className="relative">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 rounded-full border border-[#A18E7E]/20" />
                </div>
                <div>
                  <p className="font-display text-[12px] tracking-[0.2em] text-white uppercase">
                    {review.name}
                  </p>
                  <p className="font-body text-[10px] tracking-[0.1em] text-[#A18E7E] uppercase mt-1">
                    {review.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}