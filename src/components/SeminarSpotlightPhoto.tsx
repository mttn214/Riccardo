import React, { useState } from 'react';

const spotlightCutouts: Readonly<Record<string, string>> = {
  '/images/riccardo/richard_conka_hda_3.jpg': '/images/riccardo/hero-model-glamour.png',
  '/images/riccardo/gallery/riccardo_art_02.jpg': '/images/riccardo/seminar-richard-styling-extended.png',
};

export const hasSpotlightCutout = (source: string) => Boolean(spotlightCutouts[source]);

const photoFit = (source: string) =>
  spotlightCutouts[source] ? 'object-contain object-bottom' : 'object-cover object-center';

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
      className="relative w-full h-full min-h-[360px] sm:min-h-[420px] overflow-hidden select-none cursor-pointer"
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
        src={spotlightCutouts[primaryImage] ?? primaryImage}
        alt={`${title} - Autorská technika stylingu`}
        className={`absolute inset-0 w-full h-full ${photoFit(primaryImage)} ${primaryImage === "/images/riccardo/richard_conka_hda_3.jpg" ? "seminar-model-cutout" : ""} transition-all duration-500 ease-in-out ${
          !showSecondary ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
        }`}
      />

      {/* 2. Secondary Practical Action Image (Preklikávacia / Prejdenie kurzorom) */}
      {secondaryImage && (
        <img
          src={spotlightCutouts[secondaryImage] ?? secondaryImage}
          alt={`${title} - Salónny styling a fixácia textúry`}
          className={`absolute inset-0 w-full h-full ${photoFit(secondaryImage)} ${secondaryImage === "/images/riccardo/gallery/riccardo_art_02.jpg" ? "seminar-stylist-cutout" : ""} transition-all duration-500 ease-in-out ${
            showSecondary ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
          }`}
        />
      )}
    </div>
  );
};
