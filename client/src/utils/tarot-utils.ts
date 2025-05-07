import { getActiveDeck } from '../config/tarot-deck-config';
import { TarotCard } from '../data/tarot-cards';

/**
 * Get the image path for a tarot card based on the active deck and card properties
 * @param card The tarot card object
 * @returns The path to the card's image
 */
export function getTarotCardImagePath(card: TarotCard): string {
  if (!card) {
    console.error('Card is undefined in getTarotCardImagePath');
    return '';
  }
  
  try {
    // If the card already has an image path defined, use it
    if (card.imagePath) {
      return card.imagePath;
    }
    
    const deck = getActiveDeck();
    const format = deck.imageFormat;
    
    // Determine path based on arcana type
    if (card.arcana === 'major') {
      return `${deck.majorArcanaPath}/${card.id}.${format}`;
    } else {
      // For minor arcana, use the suit subfolder
      return `${deck.minorArcanaPath}/${card.suit}/${card.id}.${format}`;
    }
  } catch (error) {
    console.error('Error in getTarotCardImagePath:', error);
    return '';
  }
}

/**
 * Get the path to the back of the tarot card
 * @returns The path to the card back image
 */
export function getCardBackPath(): string {
  try {
    return getActiveDeck().cardBackImage;
  } catch (error) {
    console.error('Error getting card back path:', error);
    return '/images/tarot/decks/rider-waite/card-back.png';
  }
}

/**
 * Get a deterministic daily card for the current user
 * @param cards Array of all tarot cards
 * @returns An object with the selected card and whether it's reversed
 */
export function getDailyCard(cards: TarotCard[]) {
  if (!cards || cards.length === 0) {
    throw new Error('No cards provided to getDailyCard');
  }
  
  // Get today's date string in YYYY-MM-DD format
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // Create a seed from the date (and optionally user ID if available)
  let seed = dateStr;
  
  try {
    // If we have a user ID in localStorage, make it user-specific
    const userId = localStorage.getItem('userId');
    if (userId) {
      seed = `${dateStr}-${userId}`;
    }
  } catch (e) {
    // localStorage may not be available, just use the date
    console.warn('Could not access localStorage for userId');
  }
  
  // Generate a deterministic hash from the seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Use the hash to select a card deterministically
  const index = Math.abs(hash) % cards.length;
  const card = cards[index];
  
  // Determine if card is reversed (22% chance, deterministically)
  const reversedHash = Math.abs(hash + 1) % 100; // +1 to get a different hash than the card selection
  const isReversed = reversedHash < 22; // 22% chance of reversal
  
  return { card, isReversed };
}

/**
 * Preload an image file to ensure it's available when needed
 * @param src Path to the image to preload
 * @returns Promise that resolves when the image is loaded, or rejects on error
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Get random tarot cards from a deck
 * @param cards Array of all tarot cards
 * @param count Number of cards to get
 * @param allowReversed Whether to allow reversed cards
 * @returns Array of objects with card and isReversed properties
 */
export function getRandomCards(
  cards: TarotCard[], 
  count: number = 1, 
  allowReversed: boolean = true
) {
  if (!cards || cards.length === 0) {
    throw new Error('No cards provided to getRandomCards');
  }
  
  // Shuffle a copy of the cards array
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  
  // Take the number of cards requested
  const selectedCards = shuffled.slice(0, count);
  
  // Add reversed property if allowed
  return selectedCards.map(card => ({
    card,
    isReversed: allowReversed ? Math.random() < 0.22 : false, // 22% chance of reversal
  }));
}