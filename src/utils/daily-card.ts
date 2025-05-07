/**
 * Daily Card Generation Utilities
 * 
 * Provides functions for generating and retrieving daily tarot cards.
 */
import { isAllowedTarotImagePath, sanitizeTarotImagePath } from './path-cleanup';
import { TarotCard } from '../data/tarot-data';

/**
 * Get the image path for a tarot card based on the specified folder structure
 * @param card The tarot card object
 * @returns The path to the card's image
 */
export function getCardImagePath(card: TarotCard): string {
  if (!card) return '';
  
  // Based on the specified folder structure:
  // Major arcana cards are in the 'major' folder
  let imagePath = '';
  
  if (card.arcana === 'major') {
    imagePath = `/images/tarot/decks/rider-waite/major/${card.id}.png`;
  }
  // Minor arcana cards are in suit-specific folders
  else if (card.arcana === 'minor' && card.suit) {
    imagePath = `/images/tarot/decks/rider-waite/minor/${card.suit}/${card.id}.png`;
  }
  
  // Verify the path is valid and allowed
  if (!isAllowedTarotImagePath(imagePath)) {
    // If not, try to sanitize it
    imagePath = sanitizeTarotImagePath(imagePath);
  }
  
  return imagePath;
}

/**
 * Get a deterministic daily card based on the date
 * @param allCards Array of all tarot cards
 * @param userId Optional user ID for user-specific cards
 * @returns The selected card and whether it's reversed
 */
export function getDailyCard(allCards: TarotCard[], userId?: string) {
  if (!allCards || allCards.length === 0) {
    throw new Error('No cards provided to getDailyCard');
  }
  
  // Get today's date string in YYYY-MM-DD format
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // Create a seed from the date and optional user ID
  let seed = dateStr;
  if (userId) {
    seed = `${dateStr}-${userId}`;
  }
  
  // Generate a deterministic hash from the seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Use the hash to select a card deterministically
  const index = Math.abs(hash) % allCards.length;
  const card = allCards[index];
  
  // Determine if card is reversed (22% chance, deterministically)
  const reversedHash = Math.abs(hash + 1) % 100; // +1 to get a different hash than the card selection
  const isReversed = reversedHash < 22; // 22% chance of reversal
  
  // Get the image path for the card
  const imagePath = getCardImagePath(card);
  
  // Return the card, reversed status, and image path
  return { 
    card, 
    isReversed,
    imagePath,
    meaning: isReversed ? card.meaningReversed : card.meaningUpright 
  };
}