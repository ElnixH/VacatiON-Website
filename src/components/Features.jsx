import { Zap, Shield, BarChart2, Globe, Layers, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Deploy in seconds with our global edge network. Sub-50ms response times worldwide, guaranteed.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'SOC 2 Type II certified with end-to-end encryption. Your data stays yours, always.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: BarChart2,
    title: 'Real-time Analytics',
    description:
      'Deep insights into every user action. Make data-driven decisions with confidence.',
    color: 'text-sky-500',
    bg: 'bg-sky-50',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description:
      '200+ edge locations serving your content faster than ever, no configuration needed.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  {
    icon: Layers,
    title: 'Modular Architecture',
    description:
      'Compose exactly what you need. Every component is independent and infinitely extensible.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Built for teams of any size. Real-time multiplayer editing with zero conflicts.',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-semibold tracking-wide uppercase mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Everything you need to ship
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-lg leading-relaxed">
            Designed for modern teams. Powerful enough for enterprise. Simple enough for anyone.
          </p>
        </div>

        {/* feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-7 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 cursor-default"
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <f.icon size={22} className={f.color} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}