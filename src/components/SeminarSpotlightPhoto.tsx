import React, { useState, useEffect, useRef } from 'react';

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
  const [activeTab, setActiveTab] = useState<'action' | 'atelier'>('action');
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate every 5.5 seconds when not hovered by user
  useEffect(() => {
    if (!secondaryImage) return;

    if (isHovered) {
      // When hovered, show the authentic atelier
      setActiveTab('atelier');
      return;
    } else {
      // When hover leaves, return to primary action photo
      setActiveTab('action');
    }

    timerRef.current = setInterval(() => {
      setActiveTab((prev) => (prev === 'action' ? 'atelier' : 'action'));
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, secondaryImage]);

  return (
    <div
      className="relative w-full h-full min-h-[360px] sm:min-h-[420px] bg-zinc-950 overflow-hidden group select-none cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Primary Action Image (Autorské dielo / Modelka) */}
      <img
        src={primaryImage}
        alt={`${title} - Autorská technika stylingu`}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
          activeTab === 'action' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
        }`}
      />

      {/* 2. Secondary Authentic Atelier Image (Lučenec akadémia) */}
      {secondaryImage && (
        <img
          src={secondaryImage}
          alt={`${title} - Ateliér a účastníci v Lučenci`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
            activeTab === 'atelier' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        />
      )}
    </div>
  );
};
