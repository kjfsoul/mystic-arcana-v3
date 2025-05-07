import React, { useState, useEffect } from 'react';
import { DailyCard } from './DailyCard';
import { allTarotCards } from '../data/tarot-data';
import { getDailyCard } from '../utils/daily-card';

interface DailyTarotReadingProps {
  userId?: string;
  className?: string;
}

/**
 * DailyTarotReading Component
 * 
 * This component handles showing the daily tarot card reading to the user.
 * It uses the getDailyCard utility to deterministically generate a daily card
 * based on the current date and optional user ID.
 */
export const DailyTarotReading: React.FC<DailyTarotReadingProps> = ({
  userId,
  className = ''
}) => {
  const [dailyReading, setDailyReading] = useState<{
    card: typeof allTarotCards[0];
    isReversed: boolean;
    imagePath: string;
    meaning: string;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate the daily reading on component mount
  useEffect(() => {
    try {
      // Get daily card using our utility that ensures proper image paths
      const reading = getDailyCard(allTarotCards, userId);
      setDailyReading(reading);
      setLoading(false);
    } catch (err) {
      console.error('Error getting daily tarot reading:', err);
      setError('Unable to generate your daily reading. Please try again later.');
      setLoading(false);
    }
  }, [userId]);
  
  if (loading) {
    return (
      <div className={`daily-reading-loading ${className}`}>
        <div className="loading-spinner"></div>
        <p>Drawing your card for today...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`daily-reading-error ${className}`}>
        <p className="error-message">{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!dailyReading) {
    return (
      <div className={`daily-reading-error ${className}`}>
        <p className="error-message">Something went wrong with your reading.</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className={`daily-tarot-reading ${className}`}>
      <div className="daily-reading-header">
        <h2>Your Daily Tarot Reading</h2>
        <p className="daily-date">{today}</p>
      </div>
      
      <div className="daily-card-container">
        <DailyCard 
          card={dailyReading.card} 
          isReversed={dailyReading.isReversed}
          className="daily-card" 
        />
      </div>
      
      <div className="daily-reading-footer">
        <p className="reading-instruction">
          Tap the card to reveal its meaning
        </p>
        
        <div className="daily-reading-reminder">
          <p>Your daily card represents energies and influences for today.</p>
          <p>Return tomorrow for a new reading.</p>
        </div>
      </div>
    </div>
  );
};