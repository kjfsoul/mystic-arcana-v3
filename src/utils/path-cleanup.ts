/**
 * Path Cleanup Utilities
 * 
 * This module provides functions for cleaning up and validating image paths
 * to ensure only approved tarot image paths are used.
 */

const ALLOWED_BASE_PATH = '/images/tarot/decks/rider-waite';

/**
 * Check if a path is an allowed tarot card image path
 * @param path The image path to check
 * @returns Boolean indicating whether the path is allowed
 */
export function isAllowedTarotImagePath(path: string): boolean {
  if (!path) return false;
  
  // The path must start with the allowed base path
  if (!path.startsWith(ALLOWED_BASE_PATH)) {
    return false;
  }
  
  // The path must match the correct structure
  const majorArcanaPattern = new RegExp(`^${ALLOWED_BASE_PATH}/major/[\\w-]+\\.(png|jpg|webp)$`);
  const minorArcanaPattern = new RegExp(`^${ALLOWED_BASE_PATH}/minor/(cups|wands|pentacles|swords)/[\\w-]+\\.(png|jpg|webp)$`);
  
  return majorArcanaPattern.test(path) || minorArcanaPattern.test(path);
}

/**
 * Sanitize a tarot image path
 * @param path The image path to sanitize
 * @returns The sanitized path, or empty string if invalid
 */
export function sanitizeTarotImagePath(path: string): string {
  if (isAllowedTarotImagePath(path)) {
    return path;
  }
  
  // Try to extract the filename and construct a valid path
  try {
    const filename = path.split('/').pop();
    if (!filename) return '';
    
    // Check if the filename includes information about arcana and suit
    if (filename.includes('major')) {
      const cardName = filename.replace(/major-|\..*$/g, '');
      return `${ALLOWED_BASE_PATH}/major/${cardName}.png`;
    }
    
    const suits = ['cups', 'wands', 'pentacles', 'swords'];
    for (const suit of suits) {
      if (filename.includes(suit)) {
        const cardName = filename.replace(new RegExp(`${suit}-|\\.*$`, 'g'), '');
        return `${ALLOWED_BASE_PATH}/minor/${suit}/${cardName}.png`;
      }
    }
  } catch (error) {
    console.error('Error sanitizing path:', error);
  }
  
  // If all else fails, return empty string
  return '';
}