import React, { useEffect } from 'react';
import { PortfolioSection } from '../components/PortfolioSection';
import { PortfolioItem } from '../data/content';

interface PortfolioPageProps {
  onSelectItem: (item: PortfolioItem) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onSelectItem }) => {
  useEffect(() => {
    document.title = 'Tvorba | Hair Salon Riccardo Lučenec';
  }, []);

  return (
    <div className="pt-20">
      <PortfolioSection onSelectItem={onSelectItem} />
    </div>
  );
};
