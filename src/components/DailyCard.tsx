import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { TarotCard } from '../data/tarot-data';
import { getDailyCard, getCardImagePath } from '../utils/daily-card';

interface DailyCardProps {
  card?: TarotCard; 
  isReversed?: boolean;
  className?: string;
  userId?: string;
}

export const DailyCard: React.FC<DailyCardProps> = ({
  card,
  isReversed = false,
  className = '',
  userId
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Get the image path for the card
  const imagePath = card ? getCardImagePath(card) : '';
  
  // Handle image loading
  useEffect(() => {
    if (!imagePath) return;
    
    const img = new Image();
    img.src = imagePath;
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${imagePath}`);
      setIsLoading(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imagePath]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsFlipped(!isFlipped);
    }
  };

  if (!card) {
    return <div className="tarot-card-placeholder">Card not available</div>;
  }

  const cardMeaning = isReversed ? card.meaningReversed : card.meaningUpright;

  return (
    <div 
      className={`tarot-card ${className} ${isFlipped ? 'flipped' : ''}`}
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      role="button"
      tabIndex={0}
      aria-label={`${card.name} card. ${isFlipped ? 'Currently showing interpretation' : 'Press Enter to flip and see interpretation'}.`}
    >
      <div 
        className="card-inner"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'none',
          transition: prefersReducedMotion ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="card-front">
          {isLoading ? (
            <div className="card-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div 
              className="card-image" 
              style={{
                backgroundImage: `url(${imagePath})`,
                transform: isReversed ? 'rotate(180deg)' : 'none'
              }}
              aria-label={`${card.name} ${isReversed ? 'reversed' : 'upright'}`}
            />
          )}
          {isReversed && (
            <div className="card-reversed-indicator">
              Reversed
            </div>
          )}
        </div>
        
        <div className="card-back">
          <h3>{card.name}</h3>
          <div className="card-details">
            <p className="card-meaning">{cardMeaning}</p>
            
            <div className="card-keywords">
              <h4>Keywords:</h4>
              <ul>
                {card.keywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
            
            <div className="card-info">
              <p><strong>Arcana:</strong> {card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'}</p>
              {card.suit && (
                <p><strong>Suit:</strong> {card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};