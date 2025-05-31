
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
      <video
        ref={videoRef}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
        muted
        loop
        autoPlay
        playsInline
      >
        <source
          src="https://www.youtube.com/watch?v=yu9GPOwo0nw"
          type="video/mp4"
        />
      </video>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
};
