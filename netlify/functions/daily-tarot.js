// Netlify Function for Daily Tarot Card
import { supabaseAdmin, isPremiumUser } from '../shared/supabase-admin.js';

// Helper function to get today's date string in YYYY-MM-DD format
const getTodayDateString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Helper function to generate a deterministic card for a user on a specific day
const getDeterministicCard = async (userId = null) => {
  try {
    // Get all tarot cards
    const { data: allCards, error: cardsError } = await supabaseAdmin
      .from('tarot_cards')
      .select('*');
      
    if (cardsError) {
      console.error('Error fetching all cards:', cardsError);
      throw cardsError;
    }
    
    if (!allCards || allCards.length === 0) {
      throw new Error('No tarot cards found in database');
    }
    
    // Create a deterministic seed based on the date and optional user ID
    const dateStr = getTodayDateString();
    let seed = dateStr;
    
    // If user ID is provided, make the card user-specific
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
    const selectedCard = allCards[index];
    
    // Determine if card is reversed (22% chance, deterministically)
    const reversedHash = Math.abs(hash + 1) % 100; // +1 to get a different hash than the card selection
    const isReversed = reversedHash < 22; // 22% chance of reversal
    
    return { card: selectedCard, isReversed };
  } catch (error) {
    console.error('Error in getDeterministicCard:', error);
    throw error;
  }
};

// Function to construct the image path based on card properties
const constructCardImagePath = (card) => {
  if (!card) return '';
  
  if (card.arcana === 'major') {
    return `/images/tarot/decks/rider-waite/major/${card.id}.png`;
  } else if (card.arcana === 'minor' && card.suit) {
    return `/images/tarot/decks/rider-waite/minor/${card.suit}/${card.id}.png`;
  }
  
  // Fallback
  return `/images/tarot/decks/rider-waite/${card.id}.png`;
};

export const handler = async (event, context) => {
  // Check for required environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables in daily-tarot function');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error - missing environment variables' }),
    };
  }

  try {
    // Parse request body if it exists
    const body = event.body ? JSON.parse(event.body) : {};
    const { user_id } = body;

    // Get deterministic card for today (user-specific if user_id provided)
    const { card, isReversed } = await getDeterministicCard(user_id);
    
    // Process the card data to match frontend expectations
    const processedCard = {
      id: card.id,
      name: card.name,
      arcana: card.arcana,
      suit: card.suit,
      meaningUpright: card.meaning_upright || card.meaningUpright,
      meaningReversed: card.meaning_reversed || card.meaningReversed,
      keywords: card.keywords || [],
      element: card.element,
      zodiacSign: card.zodiac_sign || card.zodiacSign,
      // Generate the proper image path based on the card's properties
      imagePath: constructCardImagePath(card)
    };

    // If user_id is provided, save this reading to user history
    if (user_id) {
      try {
        const { error: readingError } = await supabaseAdmin
          .from('user_readings')
          .insert({
            user_id,
            card_id: card.id,
            reading_type: 'daily',
            is_reversed: isReversed,
            created_at: new Date().toISOString(),
          });

        if (readingError) {
          // Log error but don't fail the request
          console.error('Error saving reading history:', readingError);
        }
        
        // Check if user has premium for additional content
        const isPremium = await isPremiumUser(user_id);
        
        // If user is premium, we could enhance the response with additional data
        if (isPremium) {
          processedCard.extendedMeaning = card.extended_meaning || 
            'Additional insights will be available soon.';
        }
      } catch (userError) {
        console.error('Error processing user data:', userError);
        // Continue despite user-related error
      }
    }

    // Return the processed card data
    return {
      statusCode: 200,
      body: JSON.stringify({
        card: processedCard,
        isReversed,
        timestamp: new Date().toISOString(),
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    };
  } catch (error) {
    console.error('Error in daily-tarot function:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to get daily tarot card',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    };
  }
};