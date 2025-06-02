
import React, { useEffect, useRef } from 'react';

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.play().catch(console.error);
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <iframe
        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] sm:w-[200%] sm:h-[200%] md:w-[150%] md:h-[150%] lg:w-[120%] lg:h-[120%] transform -translate-x-1/2 -translate-y-1/2 scale-100"
        src="https://www.youtube.com/embed/aGG-YeIdeG8?autoplay=1&mute=1&loop=1&playlist=aGG-YeIdeG8&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
        title="Georgia Background Video"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          pointerEvents: 'none',
          border: 'none',
          minWidth: '100vw',
          minHeight: '100vh'
        }}
      />
      {/* Dark overlay for text readability and transparency */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
};
