export interface TarotCard {
  id: string;
  imageId?: string; // Optional identifier for image file name if different from id
  normalizedName?: string; // Optional normalized name for image paths if needed
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  meaningUpright: string;
  meaningReversed: string;
  keywords: string[];
  imagePath?: string; // Optional direct image path if provided by API
  element?: string;
  zodiacSign?: string;
  astrologicalSign?: string;
  planet?: string;
}

// Sample cards for testing - this would typically be pulled from the Supabase database
export const allTarotCards: TarotCard[] = [
  {
    id: "fool",
    name: "The Fool",
    arcana: "major",
    meaningUpright: "New beginnings, spontaneity, free spirit",
    meaningReversed: "Recklessness, naivety, poor planning",
    keywords: ["innocence", "adventure", "potential"],
    element: "Air",
    zodiacSign: "Aquarius"
  },
  {
    id: "magician",
    name: "The Magician",
    arcana: "major", 
    meaningUpright: "Manifestation, resourcefulness, power",
    meaningReversed: "Manipulation, untapped talents",
    keywords: ["willpower", "creation", "manifestation"],
    element: "Fire",
    zodiacSign: "Mercury"
  },
  {
    id: "high-priestess",
    name: "High Priestess",
    arcana: "major",
    meaningUpright: "Intuition, mystery, subconscious",
    meaningReversed: "Secrets, hidden agendas",
    keywords: ["intuition", "mystery", "divine knowledge"],
    element: "Water",
    zodiacSign: "Moon"
  },
  {
    id: "ace-of-cups",
    name: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    meaningUpright: "New feelings, new relationships, emotional fulfillment",
    meaningReversed: "Emotional loss, blocked creativity, emptiness",
    keywords: ["love", "compassion", "creativity"],
    element: "Water"
  },
  {
    id: "ace-of-wands",
    name: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    meaningUpright: "Creation, willpower, inspiration, desire",
    meaningReversed: "Lack of energy, lack of passion, boredom",
    keywords: ["inspiration", "creative spark", "new initiative"],
    element: "Fire"
  },
  {
    id: "ace-of-swords",
    name: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    meaningUpright: "Breakthrough, clarity, sharp mind",
    meaningReversed: "Confusion, brutality, chaos",
    keywords: ["clarity", "truth", "breakthrough"],
    element: "Air"
  },
  {
    id: "ace-of-pentacles",
    name: "Ace of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    meaningUpright: "New financial or career opportunity, manifestation, abundance",
    meaningReversed: "Missed opportunity, scarcity mindset, lack of planning",
    keywords: ["prosperity", "abundance", "new resources"],
    element: "Earth"
  }
];