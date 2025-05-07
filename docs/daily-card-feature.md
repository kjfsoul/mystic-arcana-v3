# Daily Tarot Card Feature Documentation

## Overview

The Daily Tarot Card feature provides users with a personalized daily tarot reading. This feature:

1. Generates a deterministic daily card based on the current date
2. Ensures proper image loading from the specified folder structure
3. Supports card reversals
4. Provides detailed card interpretations
5. Implements smooth card flip animations

## Implementation Details

### Directory Structure

Tarot card images are stored in a specific folder structure:

```
/images/tarot/decks/rider-waite/
  ├── major/               # Major arcana cards
  │   ├── fool.png
  │   ├── magician.png
  │   ├── ...
  │
  └── minor/               # Minor arcana cards
      ├── cups/            # Cups suit
      │   ├── ace-of-cups.png
      │   ├── two-of-cups.png
      │   ├── ...
      │
      ├── wands/           # Wands suit
      │   ├── ace-of-wands.png
      │   ├── ...
      │
      ├── swords/          # Swords suit
      │   ├── ace-of-swords.png
      │   ├── ...
      │
      └── pentacles/       # Pentacles suit
          ├── ace-of-pentacles.png
          ├── ...
```

### Core Components

1. **DailyCard Component**: Handles the display and interaction of a single tarot card, including flip animation, loading states, and detailed information.

2. **DailyTarotReading Component**: Manages the overall daily reading experience, including date display and context.

3. **Utility Functions**: 
   - `getDailyCard()`: Generates a deterministic card based on the date
   - `getCardImagePath()`: Constructs proper image paths based on card properties
   - Path cleanup utilities to validate and sanitize image paths

### Path Handling

To ensure only approved tarot image paths are used, we've implemented:

1. **Path Validation**: All image paths are validated against the approved structure
2. **Path Sanitization**: When encountering invalid paths, we attempt to sanitize them
3. **Path Cleanup Script**: A utility for scanning the codebase for invalid paths

This ensures that only images from the specified Rider-Waite folder structure are used.

## Usage

### Basic Usage

```jsx
// Daily card with automatic generation
<DailyTarotReading />

// Daily card with user-specific generation
<DailyTarotReading userId="user123" />

// Individual card with manual control
<DailyCard card={cardData} isReversed={false} />
```

### Customization

The feature supports:

- User-specific card generation using an optional user ID
- Responsive design with different card sizes
- Customizable animations
- Accessibility options for reduced motion preferences

## Deck Switching

The codebase is structured to allow easy switching between different tarot decks. When new decks are added:

1. Update the `TAROT_DECKS` array in the config
2. Create the appropriate folder structure for the new deck
3. Ensure image filenames match the card IDs

## Accessibility Considerations

- ARIA attributes for screen readers
- Keyboard navigation support
- Reduced motion options for animations
- High contrast text overlays on cards

## Future Enhancements

1. Offline support using cached images
2. Animation improvements for card reveals
3. Expanded card details with additional meanings
4. Integration with reading history

## Troubleshooting

If images aren't loading properly:
1. Ensure the image files exist in the specified folder structure
2. Check that the card IDs match the image filenames
3. Run the path cleanup script to identify any invalid paths
4. Verify that all image paths follow the approved structure