/**
 * Tarot Deck Configuration
 * 
 * Centralized management for tarot deck configurations and switching
 */

export interface TarotDeckConfig {
  id: string;
  name: string;
  description: string;
  author: string;
  year: number;
  cardBackImage: string;
  imageFormat: 'webp' | 'jpg' | 'png';
  majorArcanaPath: string;
  minorArcanaPath: string; 
  enabledSpreadTypes: ('daily' | '3-card' | 'love' | 'career' | 'zodiac')[];
}

export const TAROT_DECKS: TarotDeckConfig[] = [
  {
    id: 'rider-waite',
    name: 'Rider-Waite-Smith',
    description: 'Classic 1909 deck by Pamela Colman Smith',
    author: 'Arthur Edward Waite',
    year: 1909,
    cardBackImage: '/images/tarot/decks/rider-waite/card-back.png',
    imageFormat: 'png',
    majorArcanaPath: '/images/tarot/decks/rider-waite/major',
    minorArcanaPath: '/images/tarot/decks/rider-waite/minor',
    enabledSpreadTypes: ['daily', '3-card', 'love', 'career', 'zodiac']
  },
  // Additional decks can be added here
];

let activeDeckId = 'rider-waite';

export function getActiveDeck(): TarotDeckConfig {
  return TAROT_DECKS.find(deck => deck.id === activeDeckId) || TAROT_DECKS[0];
}

export function setActiveDeck(deckId: string): void {
  if (TAROT_DECKS.some(deck => deck.id === deckId)) {
    activeDeckId = deckId;
    try {
      localStorage.setItem('activeTarotDeck', deckId);
    } catch (error) {
      console.warn('Unable to save active deck to localStorage', error);
    }
  }
}

// Initialize from localStorage
try {
  const storedDeck = localStorage.getItem('activeTarotDeck');
  if (storedDeck && TAROT_DECKS.some(deck => deck.id === storedDeck)) {
    activeDeckId = storedDeck;
  }
} catch (error) {
  console.warn('Unable to retrieve active deck from localStorage', error);
}