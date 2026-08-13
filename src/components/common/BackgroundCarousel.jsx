import React, { useState, useEffect } from 'react';

const BACKGROUND_IMAGES = [
  '/bg-slide1.png',
  '/bg-slide2.jpg'
];

export default function BackgroundCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000); // Swipe every 6 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="bg-carousel-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -5,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {BACKGROUND_IMAGES.map((imgSrc, idx) => {
        const isActive = idx === currentIdx;
        return (
          <div
            key={imgSrc}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              opacity: isActive ? 0.22 : 0,
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              transition: 'opacity 1.8s ease-in-out, transform 8s ease-out',
              filter: 'blur(3px) brightness(0.7)'
            }}
          />
        );
      })}

      {/* Dark Ambient Masking Overlay to Protect Legibility & Theme */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 30%, rgba(13, 18, 30, 0.7) 0%, rgba(13, 18, 30, 0.94) 80%)'
        }}
      />
    </div>
  );
}
