import React from 'react';
import { SeminarsSection } from '../components/SeminarsSection';
import { Seminar } from '../data/content';

interface SeminarsPageProps {
  onOpenDetail: (seminar: Seminar) => void;
  onBookSeminar: (seminar: Seminar) => void;
}

export const SeminarsPage: React.FC<SeminarsPageProps> = ({ onOpenDetail, onBookSeminar }) => {
  return (
    <div className="pt-20">
      <SeminarsSection
        currency="EUR"
        onOpenDetail={onOpenDetail}
        onBookSeminar={onBookSeminar}
      />
    </div>
  );
};
