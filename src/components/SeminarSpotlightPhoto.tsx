import React, { useState } from 'react';

interface SeminarSpotlightPhotoProps {
  primaryImage: string;
  secondaryImage?: string;
  title: string;
  availableSeats?: number;
  totalSeats?: number;
}

export const SeminarSpotlightPhoto: React.FC<SeminarSpotlightPhotoProps> = ({
  primaryImage,
  secondaryImage,
  title,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Active secondary image ONLY when hovered with cursor or clicked/tapped (NO auto timer)
  const showSecondary = Boolean(secondaryImage && (isHovered || isClicked));

  return (
    <div
      className="relative w-full h-full min-h-[360px] sm:min-h-[420px] bg-zinc-950 overflow-hidden select-none cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsClicked(false);
      }}
      onClick={() => {
        if (secondaryImage) {
          setIsClicked((prev) => !prev);
        }
      }}
    >
      {/* 1. Primary Action Image (Autorské dielo / Modelka) */}
      <img
        src={primaryImage}
        alt={`${title} - Autorská technika stylingu`}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-in-out ${
          !showSecondary ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
        }`}
      />

      {/* 2. Secondary Practical Action Image (Preklikávacia / Prejdenie kurzorom) */}
      {secondaryImage && (
        <img
          src={secondaryImage}
          alt={`${title} - Salónny styling a fixácia textúry`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-in-out ${
            showSecondary ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
          }`}
        />
      )}
    </div>
  );
};
