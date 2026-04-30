export default function Suites() {
  return (
    <section id="suites" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Suites
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose from our carefully curated selection of luxury apartments.
          </p>
        </div>

        {/* First showcase section */}
        <div className="mb-16 rounded-3xl overflow-hidden h-96 md:h-96 relative group">
          <img
            src="https://images.pexels.com/photos/3356408/pexels-photo-3356408.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2"
            alt="Penthouse Suite"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Penthouse Collection
            </h3>
            <p className="text-lg text-white/90 max-w-xl mb-8 drop-shadow-md">
              Experience unparalleled luxury with panoramic city views and exclusive amenities.
            </p>
            <button className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200 shadow-lg">
              Discover More
            </button>
          </div>
        </div>

        {/* Standard suites grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              name: 'Studio',
              beds: 'Studio',
              baths: '1',
              sqft: '600',
              price: '$2,500',
              image:
                'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
            },
            {
              name: 'One Bedroom',
              beds: '1 Bed',
              baths: '1',
              sqft: '900',
              price: '$3,500',
              image:
                'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
            },
            {
              name: 'Two Bedroom',
              beds: '2 Beds',
              baths: '2',
              sqft: '1,400',
              price: '$5,500',
              image:
                'https://images.pexels.com/photos/1872286/pexels-photo-1872286.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
            },
          ].map((suite, i) => (
            <div
              key={i}
              className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-100/50"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={suite.image}
                  alt={suite.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{suite.name}</h3>
                <div className="flex gap-4 mb-4 text-sm text-slate-600">
                  <span>{suite.beds}</span>
                  <span>•</span>
                  <span>{suite.baths} Bath</span>
                  <span>•</span>
                  <span>{suite.sqft} sqft</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 mb-4">{suite.price}/mo</p>
                <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Second showcase section */}
        <div className="rounded-3xl overflow-hidden h-96 md:h-96 relative group">
          <img
            src="https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2"
            alt="Luxury Amenities"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-blue-900/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              World-Class Amenities
            </h3>
            <p className="text-lg text-white/90 max-w-xl mb-8 drop-shadow-md">
              Indulge in our curated selection of premium facilities designed for the discerning resident.
            </p>
            <button className="px-8 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 shadow-lg">
              Explore Amenities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
