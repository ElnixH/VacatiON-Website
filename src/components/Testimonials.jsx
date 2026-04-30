import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO at Vantage',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    quote:
      'Lumina cut our deployment time from 2 hours to under 4 minutes. The DX is unlike anything else on the market. Our entire engineering org switched within a week.',
  },
  {
    name: 'Marcus Webb',
    role: 'Lead Engineer at Horizon',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    quote:
      'We handle 50M requests per day through Lumina with zero downtime. The observability tooling alone is worth the switch. I recommend it to every team I talk to.',
  },
  {
    name: 'Priya Anand',
    role: 'Product Director at Forge',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2',
    quote:
      'Our team went from idea to production in three days on Lumina. The collaboration features are a game-changer — designers and engineers finally speak the same language.',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 text-xs font-semibold tracking-wide uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Loved by teams worldwide
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-lg">
            Join thousands of companies already building on Lumina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Stars />
              <p className="text-slate-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo strip */}
        <div className="mt-16 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40">
            {['Vantage', 'Horizon', 'Forge', 'Nexus', 'Apex'].map((name) => (
              <span key={name} className="text-slate-600 font-bold text-lg tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
