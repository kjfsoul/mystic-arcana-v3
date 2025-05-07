import React from 'react';
import { DailyCard } from './DailyCard';

interface Card {
  id: string;
  image: string;
  name: string;
  interpretation: string;
}

interface ReadingBoardProps {
  cards: Card[];
  layout: 'daily' | 'three-card' | 'celtic-cross';
}

export const ReadingBoard: React.FC<ReadingBoardProps> = ({ cards, layout }) => {
  return (
    <div className={`reading-board ${layout}`}>
      {cards.map(card => (
        <DailyCard
          key={card.id}
          cardImage={card.image}
          cardName={card.name}
          interpretation={card.interpretation}
        />
      ))}
    </div>
  );
};