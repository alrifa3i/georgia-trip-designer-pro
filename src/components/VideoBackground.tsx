
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
        className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] sm:w-[150vw] sm:h-[150vh] md:min-w-full md:min-h-full transform -translate-x-1/2 -translate-y-1/2"
        src="https://www.youtube.com/embed/aGG-YeIdeG8?autoplay=1&mute=1&loop=1&playlist=aGG-YeIdeG8&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
        title="Georgia Background Video"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          pointerEvents: 'none',
          border: 'none'
        }}
      />
      {/* Dark overlay for text readability and transparency */}
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
};
