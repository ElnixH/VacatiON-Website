import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

export default function VideoShowcase() {
  // 1. Removed TypeScript types here
  const videoRefs = useRef([]);
  const containerRefs = useRef([]);
  const [playingId, setPlayingId] = useState(null);

  const videos = [
    {
      id: 1,
      title: 'Penthouse Tour',
      description: 'Take a virtual tour of our stunning penthouse suites.',
      image: 'https://images.pexels.com/photos/3356408/pexels-photo-3356408.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
      videoUrl: 'https://videos.pexels.com/video-files/3532832/3532832-uhd_2560_1440_25fps.mp4',
    },
    {
      id: 2,
      title: 'Rooftop Lounge',
      description: 'Experience our exclusive rooftop with panoramic views.',
      image: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
      videoUrl: 'https://videos.pexels.com/video-files/3532832/3532832-uhd_2560_1440_25fps.mp4',
    },
    {
      id: 3,
      title: 'Spa & Wellness',
      description: 'Relax and rejuvenate in our world-class wellness center.',
      image: 'https://images.pexels.com/photos/3571215/pexels-photo-3571215.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
      videoUrl: 'https://videos.pexels.com/video-files/3532832/3532832-uhd_2560_1440_25fps.mp4',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 2. Removed "as HTMLDivElement" here
          const index = containerRefs.current.indexOf(entry.target);
          if (index !== -1) {
            const video = videoRefs.current[index];
            if (entry.isIntersecting && video) {
              video.play();
              setPlayingId(videos[index].id);
            } else if (video) {
              video.pause();
              if (playingId === videos[index].id) {
                setPlayingId(null);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    containerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [videos, playingId]);

  return (
    <section id="events" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Explore Luxe
          </h2>
          <p className="text-lg text-slate-600">
            Take a virtual tour of our world-class facilities and stunning residences.
          </p>
        </div>

        <div className="space-y-8">
          {videos.map((video, idx) => (
            <div
              key={video.id}
              ref={(el) => {
                containerRefs.current[idx] = el;
              }}
              className="group relative h-96 rounded-3xl overflow-hidden"
            >
              {/* Video */}
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                muted
                loop
                poster={video.image}
              >
                <source src={video.videoUrl} type="video/mp4" />
              </video>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {video.title}
                </h3>
                <p className="text-lg text-white/90 max-w-xl mb-6 drop-shadow-md">
                  {video.description}
                </p>
                {playingId !== video.id && (
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <Play size={28} className="text-slate-900 fill-slate-900 ml-1" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}