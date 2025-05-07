# Mystic Arcana (MysticOracleV2)

A comprehensive spiritual guidance platform leveraging AI to provide personalized metaphysical insights through tarot readings, astrology charts, and spiritual guidance.

## 🌟 Features

- Interactive Tarot Card Readings
- Daily Tarot Card
- Personalized Astrological Charts
- Zodiac Spreads
- Premium Content (subscription-based)
- User Reading History
- AI-Generated Interpretations

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Netlify Functions, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI API
- **Payments**: Stripe

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Supabase account
- OpenAI API key
- Stripe account (for payment features)

### Environment Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/MysticOracleV2.git
   cd MysticOracleV2
   ```

2. Run the setup script
   ```bash
   ./scripts/setup-env.sh
   ```
   This script will:
   - Create a `.env` file with the required environment variables
   - Make scripts executable
   - Check for installed dependencies
   - Install the Netlify CLI if needed

3. Alternatively, create `.env` file manually with the following variables:
   ```
   # Supabase Configuration
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # Frontend Supabase variables
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key
   
   # Stripe Configuration (optional for MVP)
   STRIPE_SECRET_KEY=your-stripe-secret-key
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   
   # API Base URL
   VITE_API_BASE_URL=/api
   ```

4. Install dependencies
   ```bash
   npm install
   ```

### Development Server

Run the development server:

```bash
npm run dev
```

For testing Netlify Functions locally:

```bash
netlify dev
```

### Supabase Connection Check

You can check your Supabase connection by visiting:

```
http://localhost:5173/check-supabase-url.html
```

This page will verify your Supabase environment variables and connection.

## 🧪 Testing

Run tests:

```bash
npm test
```

## 📦 Build

Build for production:

```bash
npm run build
```

## 🚢 Deployment to Netlify

1. Set up Netlify environment variables:
   ```bash
   node scripts/setup-netlify-env.js
   ```

2. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

## ⚠️ Known Issues

- **Daily Tarot Card Display**: Fixed in latest version, now properly connects to Rider-Waite deck.
- **Birth Chart Calculations**: Needs improvement for accurate interpretations.
- **Mobile Experience**: Ongoing improvements for better responsiveness.

## 🌐 Project Structure

- `/client`: Frontend React application
- `/netlify`: Netlify Functions and Edge Functions
- `/scripts`: Utility scripts
- `/shared`: Shared code between frontend and backend
- `/supabase`: Supabase configuration and migrations
- `/.mcp`: MCP server configuration

## 🧠 MCP Servers

The project uses Model Context Protocol (MCP) servers for various functionalities:

- For React components: MCP-React-UI and MCP-Design-System-Tailwind
- For API routes: MCP-Fullstack-Turbo and MCP-Netlify-EdgeDocs
- For tarot/astrology features: MCP-AI-FunctionPack
- For content management: MCP-CMS-Headless
- For e-commerce: MCP-Commerce-Stripe

## 📚 Documentation

Additional documentation can be found in:

- `/cline_docs`: Project documentation
- `/SETUP.md`: Setup instructions
- `/PROJECT_ROADMAP.md`: Project roadmap and goals
- `/DEVELOPER_HANDOFF.md`: Developer handoff document

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Arthur Edward Waite and Pamela Colman Smith for the Rider-Waite Tarot deck
- OpenAI for AI-generated interpretations
- Supabase for backend services
- Netlify for hosting and serverless functions# mystic-arcana-v3
