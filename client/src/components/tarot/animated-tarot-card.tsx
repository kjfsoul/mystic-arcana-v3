import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard } from '../../data/tarot-cards';
import { getCardBackPath, getTarotCardImagePath } from '../../utils/tarot-utils';

interface AnimatedTarotCardProps {
  card: TarotCard;
  isReversed?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  autoReveal?: boolean;
  revealDelay?: number;
  onClick?: () => void;
  className?: string;
  showMeaning?: boolean;
  showReversedIndicator?: boolean;
}

/**
 * AnimatedTarotCard Component
 * 
 * A tarot card component with flip animation and customizable appearance.
 */
const AnimatedTarotCard: React.FC<AnimatedTarotCardProps> = ({
  card,
  isReversed = false,
  size = 'md',
  autoReveal = false,
  revealDelay = 1500,
  onClick,
  className = '',
  showMeaning = false,
  showReversedIndicator = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGlowEffect, setHasGlowEffect] = useState(false);
  
  // Card dimensions based on size
  const dimensions = {
    sm: { width: 100, height: 170 },
    md: { width: 140, height: 240 },
    lg: { width: 180, height: 300 },
    xl: { width: 220, height: 370 },
  };
  
  const { width, height } = dimensions[size];
  
  // Get the image path for the card
  const imagePath = getTarotCardImagePath(card);
  
  // Preload the image
  useEffect(() => {
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
  
  // Auto-reveal the card after delay if enabled
  useEffect(() => {
    if (autoReveal && !isFlipped) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, revealDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoReveal, isFlipped, revealDelay]);
  
  // Add random glow effect when card is flipped
  useEffect(() => {
    if (isFlipped) {
      // 30% chance of adding a subtle glow effect
      setHasGlowEffect(Math.random() < 0.3);
    } else {
      setHasGlowEffect(false);
    }
  }, [isFlipped]);
  
  // Handle card click
  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (onClick) onClick();
  };
  
  // Get the card meaning based on orientation
  const cardMeaning = isReversed ? card.meaningReversed : card.meaningUpright;
  
  // Card flip animation variants
  const cardVariants = {
    front: { 
      rotateY: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    },
    back: { 
      rotateY: 180, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };
  
  return (
    <div 
      className={`relative perspective-1000 cursor-pointer ${className}`}
      style={{ width, height }}
      onClick={handleClick}
      role="button"
      aria-label={`Tarot card: ${card.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="w-full h-full relative preserve-3d"
          initial={false}
          animate={isFlipped ? "back" : "front"}
          variants={cardVariants}
        >
          {/* Card Back */}
          <div 
            className={`absolute w-full h-full backface-hidden rounded-lg shadow-lg border border-gold/30 overflow-hidden`}
            style={{ 
              backgroundImage: `url(${getCardBackPath()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: isFlipped ? -1 : 1,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)"
            }}
            aria-hidden={isFlipped}
          />
          
          {/* Card Front */}
          <div 
            className={`absolute w-full h-full backface-hidden rounded-lg shadow-lg border border-gold/30 overflow-hidden transform rotate-y-180 ${hasGlowEffect ? 'animate-subtle-pulse' : ''}`}
            style={{ 
              zIndex: isFlipped ? 1 : -1,
              boxShadow: hasGlowEffect 
                ? "0 0 15px 2px rgba(212, 175, 55, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.3)" 
                : "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)"
            }}
            aria-hidden={!isFlipped}
          >
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-primary-20">
                <div className="animate-spin w-8 h-8 border-2 border-gold rounded-full border-t-transparent" />
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Card Image */}
                <div 
                  className={`w-full h-full bg-primary-10 transition-transform duration-1000 ease-in-out`}
                  style={{
                    backgroundImage: `url(${imagePath})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transform: isReversed ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                  aria-label={`${card.name} ${isReversed ? 'reversed' : 'upright'}`}
                />
                
                {/* Card Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-sm p-2 text-center">
                  <h3 className="text-gold font-heading text-sm md:text-base truncate">
                    {card.name}
                  </h3>
                  {showMeaning && (
                    <p className="text-light/80 text-xs mt-1 line-clamp-2">
                      {cardMeaning}
                    </p>
                  )}
                </div>
                
                {/* Reversed Indicator */}
                {isReversed && showReversedIndicator && (
                  <div className="absolute top-2 right-2 bg-warning/80 text-dark text-xs px-1.5 py-0.5 rounded-sm font-medium backdrop-blur-sm">
                    Reversed
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTarotCard;