# Mystic Oracle V2 - Developer Handoff Document

## Project Overview

Mystic Oracle V2 is a comprehensive spiritual guidance platform leveraging AI to provide personalized metaphysical insights through tarot readings, astrology charts, and spiritual guidance. The application combines modern web technologies with mystical aesthetics to create an engaging user experience.

## Current Status (As of Handoff)

The project is in active development with several core features implemented and others in progress. Recent work has focused on resolving dependency issues and ensuring the build process works correctly.

### Key Features Implemented

- Tarot reading features with both authenticated and public endpoints
- Zodiac spread generation with premium/non-premium variations
- OpenAI GPT-4o integration for generating interpretations
- Automated daily horoscope generation (scheduled at 00:05 daily)
- NASA data fetching (scheduled at 00:15 daily)
- Special event notifications (e.g., Lunar Eclipse, St. Patrick's Day)
- Supabase storage for tarot readings and horoscopes
- User reading history tracking
- Premium content storage and access control
- Zodiac spread component with premium/free variations
- Birth chart calculations (needs improvement)
- Basic animations and interactive features
- Authentication system with premium vs free user differentiation
- Premium content paywall

### Current Issues Needing Attention

- **Daily Tarot Card Display Issue**: The daily tarot deck does not properly connect to the Rider-Waite deck as intended. The page currently loads as a white page with a broken image and only a refresh button is visible. This is a critical issue affecting user experience.
- Birth chart calculations need fixing
- Authentication issues preventing access to birth chart
- Premium feature access needs testing
- Mobile experience needs enhancement
- Build and dependency issues (recently addressed but may need further work)

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js with Express (being migrated to Netlify Functions)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify
- **AI Integration**: OpenAI API
- **State Management**: React Query
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom components

## Project Structure

- `/client`: Frontend React application
  - `/src`: Source code
    - `/components`: UI components
    - `/pages`: Page components
    - `/hooks`: Custom React hooks
    - `/lib`: Utility functions and services
    - `/styles`: CSS and styling
- `/server`: Backend Express application (being migrated to Netlify Functions)
  - `/routes`: API routes
  - `/auth`: Authentication logic
  - `/openai`: OpenAI integration
  - `/storage`: Database interactions
- `/netlify`: Netlify Functions and Edge Functions
- `/shared`: Shared code between frontend and backend
- `/scripts`: Utility scripts
- `/.mcp`: MCP server configuration
- `/cline_docs`: Project documentation

## Recent Dependency Fixes

The project recently had issues with missing dependencies that have been addressed. The following packages were added to fix build and development errors:

- `@vitejs/plugin-react`: Required for Vite build
- `dotenv`: Required for environment variables
- `portfinder`: Used in server configuration
- `zod-validation-error`: Used for form validation
- `wouter`: Used for routing
- `framer-motion`: Used for animations
- `date-fns`: Used for date manipulation
- `@supabase/supabase-js`: Used for Supabase integration
- `@radix-ui/*`: Various UI components
- `@hookform/resolvers`: Form validation
- `react-hook-form`: Form handling

## Build and Development

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables (see `.env.example`)
4. Start the development server: `npm run dev`

### Build Process

The project uses Vite for frontend building and esbuild for the server:

```bash
npm run build
```

This command:

1. Builds the React frontend with Vite
2. Bundles the server code with esbuild

### Deployment

The project is configured for deployment on Netlify:

```bash
npm run deploy
```

## Authentication and Authorization

The application uses Supabase for authentication with the following user types:

- **Free Users**: Access to basic features
- **Premium Users**: Access to advanced features and premium content

Authentication is implemented in `server/auth.ts` and integrated throughout the application.

## Key API Endpoints

### Tarot Reading Endpoints

- `GET /api/tarot-data`: Get information about available tarot data
- `GET /api/tarot-cards/random`: Get random tarot cards
- `GET /api/tarot-cards/card-of-the-day`: Get the card of the day
- `POST /api/public/tarot-readings`: Generate a public tarot reading
- `GET /api/tarot-readings`: Get user's tarot readings (authenticated)
- `GET /api/tarot-readings/:id`: Get a specific tarot reading (authenticated)
- `POST /api/tarot-readings`: Generate a new tarot reading (authenticated)
- `PATCH /api/tarot-readings/:id/save`: Save/unsave a tarot reading (authenticated)
- `POST /api/tarot-readings/zodiac-spread`: Generate a zodiac spread (authenticated)

### Astrology Endpoints

- `POST /api/public/birth-chart`: Generate a birth chart (public)
- `POST /api/public/zodiac-spread`: Generate a zodiac spread preview (public)
- `GET /api/astrology-charts`: Get user's astrology charts (authenticated)
- `GET /api/astrology-charts/:id`: Get a specific astrology chart (authenticated)
- `POST /api/astrology-charts/birth-chart`: Create a new birth chart (authenticated)

### Horoscope Endpoints

- `GET /api/horoscopes/preview/:sign`: Get a preview of today's horoscope for a sign
- `GET /api/horoscopes/:sign`: Get today's horoscope for a sign

### Subscription Endpoints

- `GET /api/subscription/plans`: Get subscription plans
- `POST /api/subscription/checkout`: Create checkout session (authenticated)
- `GET /api/subscription/success`: Handle successful subscription
- `POST /api/subscription/cancel`: Cancel subscription (authenticated)
- `GET /api/subscription/status`: Get current subscription status (authenticated)

## Autonomous Agent System

The project includes an autonomous agent system that can perform tasks automatically:

- `npm run agents:start`: Start the agent runner
- `npm run agents:status`: Check agent status
- `npm run agents:away:enable`: Enable away mode (agents run during specified hours)
- `npm run agents:away:disable`: Disable away mode

## MCP Server Integration

The project uses Model Context Protocol (MCP) servers for various functionalities:

- For React components: MCP-React-UI and MCP-Design-System-Tailwind
- For API routes: MCP-Fullstack-Turbo and MCP-Netlify-EdgeDocs
- For tarot/astrology features: MCP-AI-FunctionPack
- For content management: MCP-CMS-Headless
- For e-commerce: MCP-Commerce-Stripe

## Immediate Tasks for New Developer

1. **Fix Daily Tarot Card Display Issue**: Fix the connection between the daily tarot deck and the Rider-Waite deck. Address the white page/broken image issue that currently shows only a refresh button.
2. Fix birth chart calculations to properly display interpretations
3. Add tarot card animations during selection and reading
4. Implement the zodiac spread as a premium feature
5. Configure Netlify deployment pipeline
6. Set up environment variables in Netlify dashboard
7. Convert Express routes to Netlify Functions
8. Ensure all premium features are accessible during testing
9. Fix authentication issues preventing access to birth chart

## Coding Standards

- Use TypeScript for type safety
- Implement responsive design for all components
- Ensure accessibility (WCAG 2.1 AA compliance)
- Write unit tests for critical functionality
- Follow the project's mystical design language
- Optimize for performance and SEO

## Documentation

Additional documentation can be found in:

- `/cline_docs`: Project documentation
- `/SETUP.md`: Setup instructions
- `/PROJECT_ROADMAP.md`: Project roadmap and goals

## Contact Information

For questions or issues, please contact the previous developer or project manager.
