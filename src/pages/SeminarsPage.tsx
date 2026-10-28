import React, { useState } from 'react';
import { SeminarsSection } from '../components/SeminarsSection';
import { PastSeminarsSection } from '../components/PastSeminarsSection';
import { AcademyGallerySection } from '../components/AcademyGallerySection';
import { AcademyFAQ } from '../components/AcademyFAQ';
import { WaitlistModal } from '../components/WaitlistModal';
import { Seminar } from '../data/content';

interface SeminarsPageProps {
  onOpenDetail: (seminar: Seminar) => void;
  onBookSeminar: (seminar: Seminar) => void;
}

export const SeminarsPage: React.FC<SeminarsPageProps> = ({ onOpenDetail, onBookSeminar }) => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="pt-20">
      {/* 1. Main Upcoming Seminars Section */}
      <SeminarsSection
        currency="EUR"
        onOpenDetail={onOpenDetail}
        onBookSeminar={onBookSeminar}
      />

      {/* 2. Visual Education Atmosphere Gallery */}
      <AcademyGallerySection />

      {/* 3. Past Sold-Out Masterclasses Archive (Scarcity Proof) */}
      <PastSeminarsSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />

      {/* 4. Academy Stylist FAQ Accordion */}
      <AcademyFAQ />

      {/* 5. VIP Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
};
