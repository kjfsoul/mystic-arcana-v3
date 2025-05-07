/**
 * Tarot Card Data
 * 
 * This module contains the tarot card definitions used by the application.
 * Each card has properties including name, arcana type, suit (for minor arcana),
 * and meanings for both upright and reversed positions.
 */

export interface TarotCard {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  meaningUpright: string;
  meaningReversed: string;
  keywords: string[];
}

export const majorArcana: TarotCard[] = [
  {
    id: "fool",
    name: "The Fool",
    arcana: "major",
    meaningUpright: "New beginnings, innocence, spontaneity, a free spirit",
    meaningReversed: "Holding back, recklessness, risk-taking, naivety",
    keywords: ["beginnings", "innocence", "journey", "spontaneity"]
  },
  {
    id: "magician",
    name: "The Magician",
    arcana: "major",
    meaningUpright: "Manifestation, resourcefulness, power, inspired action",
    meaningReversed: "Manipulation, poor planning, untapped talents",
    keywords: ["manifestation", "power", "action", "creation"]
  },
  {
    id: "high-priestess",
    name: "The High Priestess",
    arcana: "major",
    meaningUpright: "Intuition, sacred knowledge, divine feminine, the subconscious mind",
    meaningReversed: "Secrets, disconnected from intuition, withdrawal and silence",
    keywords: ["intuition", "subconscious", "mystery", "inner voice"]
  },
  {
    id: "empress",
    name: "The Empress",
    arcana: "major",
    meaningUpright: "Femininity, beauty, nature, nurturing, abundance",
    meaningReversed: "Creative block, dependence on others, emptiness",
    keywords: ["abundance", "nurturing", "fertility", "creation"]
  },
  {
    id: "emperor",
    name: "The Emperor",
    arcana: "major",
    meaningUpright: "Authority, establishing structure, discipline, leadership",
    meaningReversed: "Domination, excessive control, rigidity, inflexibility",
    keywords: ["authority", "structure", "control", "leadership"]
  }
];

export const cupsCards: TarotCard[] = [
  {
    id: "ace-of-cups",
    name: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    meaningUpright: "New feelings, emotional awakening, creativity, intuition",
    meaningReversed: "Emotional loss, blocked creativity, emptiness",
    keywords: ["love", "emotions", "relationships", "feelings"]
  },
  {
    id: "two-of-cups",
    name: "Two of Cups",
    arcana: "minor",
    suit: "cups",
    meaningUpright: "Unity, partnership, connection, attraction",
    meaningReversed: "Breakups, imbalanced partnerships, tension",
    keywords: ["partnership", "union", "attraction", "connection"]
  },
  {
    id: "three-of-cups",
    name: "Three of Cups",
    arcana: "minor",
    suit: "cups",
    meaningUpright: "Celebration, friendship, creativity, community",
    meaningReversed: "Overindulgence, group conflict, isolation",
    keywords: ["celebration", "friendship", "community", "joy"]
  }
];

export const wandsCards: TarotCard[] = [
  {
    id: "ace-of-wands",
    name: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    meaningUpright: "Inspiration, new opportunities, growth, potential",
    meaningReversed: "Delays, lack of direction, creative blocks",
    keywords: ["inspiration", "potential", "opportunity", "creation"]
  },
  {
    id: "two-of-wands",
    name: "Two of Wands",
    arcana: "minor",
    suit: "wands",
    meaningUpright: "Future planning, progress, decisions, discovery",
    meaningReversed: "Fear of change, playing it safe, bad planning",
    keywords: ["planning", "decisions", "direction", "discovery"]
  },
  {
    id: "three-of-wands",
    name: "Three of Wands",
    arcana: "minor",
    suit: "wands",
    meaningUpright: "Expansion, foresight, overseas opportunities",
    meaningReversed: "Obstacles, delays, setbacks, impatience",
    keywords: ["expansion", "foresight", "growth", "progress"]
  }
];

export const swordsCards: TarotCard[] = [
  {
    id: "ace-of-swords",
    name: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    meaningUpright: "Clarity, breakthrough thinking, mental strength, truth",
    meaningReversed: "Confusion, brutal honesty, miscommunication",
    keywords: ["clarity", "truth", "breakthrough", "insight"]
  },
  {
    id: "two-of-swords",
    name: "Two of Swords",
    arcana: "minor",
    suit: "swords",
    meaningUpright: "Difficult choices, indecision, stalemate, avoidance",
    meaningReversed: "Indecision, confusion, information overload",
    keywords: ["decision", "stalemate", "impasse", "balance"]
  },
  {
    id: "three-of-swords",
    name: "Three of Swords",
    arcana: "minor",
    suit: "swords",
    meaningUpright: "Heartbreak, emotional pain, sorrow, grief, hurt",
    meaningReversed: "Recovery, forgiveness, moving on, reconciliation",
    keywords: ["heartbreak", "sorrow", "grief", "emotional pain"]
  }
];

export const pentaclesCards: TarotCard[] = [
  {
    id: "ace-of-pentacles",
    name: "Ace of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    meaningUpright: "New financial or career opportunity, manifestation, abundance",
    meaningReversed: "Missed opportunity, scarcity mindset, lack of planning",
    keywords: ["opportunity", "prosperity", "abundance", "new venture"]
  },
  {
    id: "two-of-pentacles",
    name: "Two of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    meaningUpright: "Balancing resources, prioritization, adaptation",
    meaningReversed: "Imbalance, overwhelm, disorganization",
    keywords: ["balance", "prioritization", "adaptability", "time management"]
  },
  {
    id: "three-of-pentacles",
    name: "Three of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    meaningUpright: "Teamwork, collaboration, building, learning",
    meaningReversed: "Lack of teamwork, disorganization, poor workmanship",
    keywords: ["teamwork", "collaboration", "skill", "quality"]
  }
];

// Combine all cards into one array
export const allTarotCards: TarotCard[] = [
  ...majorArcana,
  ...cupsCards,
  ...wandsCards,
  ...swordsCards,
  ...pentaclesCards
];