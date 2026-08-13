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
    }, 5000); // Swipe every 5 seconds

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
              backgroundPosition: 'center center',
              opacity: isActive ? 0.72 : 0,
              transform: isActive ? 'scale(1.03)' : 'scale(1)',
              transition: 'opacity 1.5s ease-in-out, transform 6s ease-out',
              filter: 'brightness(0.85) contrast(1.1)'
            }}
          />
        );
      })}

      {/* Dark Ambient Masking Layer (Protects legibility while keeping photos very clear) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(13, 18, 30, 0.62) 0%, rgba(13, 18, 30, 0.75) 50%, rgba(13, 18, 30, 0.88) 100%)'
        }}
      />
    </div>
  );
}
