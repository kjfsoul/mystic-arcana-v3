#!/bin/bash

# MysticArcana Environment Setup Script
# This script helps set up the development environment for MysticArcana

# Terminal colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🔮 MysticArcana Development Environment Setup${NC}"
echo -e "${PURPLE}=============================================${NC}\n"

# Check if .env file exists
if [ -f .env ]; then
  echo -e "${YELLOW}⚠️ .env file already exists. Do you want to overwrite it? (y/n)${NC}"
  read -r answer
  if [[ "$answer" != "y" ]]; then
    echo -e "${BLUE}Skipping .env file creation.${NC}"
    echo -e "${YELLOW}You may need to manually update your existing .env file.${NC}"
  else
    # Backup existing .env
    echo -e "${BLUE}Backing up existing .env to .env.backup${NC}"
    cp .env .env.backup
    touch .env
    setup_env=true
  fi
else
  touch .env
  setup_env=true
fi

# Setup .env file
if [[ "$setup_env" == true ]]; then
  echo -e "${BLUE}Creating .env file...${NC}"
  
  # Prompt for Supabase details
  echo -e "${YELLOW}Enter your Supabase URL (e.g., https://xyzproject.supabase.co):${NC}"
  read -r supabase_url
  
  echo -e "${YELLOW}Enter your Supabase Anon Key:${NC}"
  read -r supabase_anon_key
  
  echo -e "${YELLOW}Enter your Supabase Service Role Key:${NC}"
  read -r supabase_service_key
  
  # Optional: Prompt for OpenAI API key
  echo -e "${YELLOW}Enter your OpenAI API Key (press enter to skip):${NC}"
  read -r openai_api_key
  
  # Optional: Prompt for Stripe keys
  echo -e "${YELLOW}Do you need to set up Stripe for payment processing? (y/n)${NC}"
  read -r setup_stripe
  if [[ "$setup_stripe" == "y" ]]; then
    echo -e "${YELLOW}Enter your Stripe Secret Key:${NC}"
    read -r stripe_secret_key
    
    echo -e "${YELLOW}Enter your Stripe Publishable Key:${NC}"
    read -r stripe_publishable_key
  fi
  
  # Write to .env file
  cat > .env << EOF
# MysticArcana Environment Variables

# Supabase Configuration
SUPABASE_URL=${supabase_url}
SUPABASE_ANON_KEY=${supabase_anon_key}
SUPABASE_SERVICE_ROLE_KEY=${supabase_service_key}

# Frontend-specific Supabase variables (used by Vite)
VITE_SUPABASE_URL=${supabase_url}
VITE_SUPABASE_ANON_KEY=${supabase_anon_key}

# OpenAI Configuration
OPENAI_API_KEY=${openai_api_key}

# API Base URL
VITE_API_BASE_URL=/api
EOF

  # Add Stripe configuration if needed
  if [[ "$setup_stripe" == "y" ]]; then
    cat >> .env << EOF

# Stripe Configuration
STRIPE_SECRET_KEY=${stripe_secret_key}
VITE_STRIPE_PUBLISHABLE_KEY=${stripe_publishable_key}
EOF
  fi

  echo -e "${GREEN}✅ .env file created successfully!${NC}"
fi

# Make scripts executable
echo -e "${BLUE}Making scripts executable...${NC}"
chmod +x scripts/*.sh
chmod +x scripts/*.js

# Check for node_modules
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}node_modules not found. Do you want to install dependencies? (y/n)${NC}"
  read -r install_deps
  if [[ "$install_deps" == "y" ]]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
  else
    echo -e "${YELLOW}Skipping dependency installation.${NC}"
    echo -e "${YELLOW}You'll need to run 'npm install' before running the application.${NC}"
  fi
else
  echo -e "${GREEN}✅ Dependencies already installed.${NC}"
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo -e "${YELLOW}Netlify CLI not found. Do you want to install it globally? (y/n)${NC}"
  read -r install_netlify
  if [[ "$install_netlify" == "y" ]]; then
    echo -e "${BLUE}Installing Netlify CLI...${NC}"
    npm install -g netlify-cli
    echo -e "${GREEN}✅ Netlify CLI installed successfully!${NC}"
  else
    echo -e "${YELLOW}Skipping Netlify CLI installation.${NC}"
    echo -e "${YELLOW}You'll need the Netlify CLI to test Netlify Functions locally.${NC}"
  fi
else
  echo -e "${GREEN}✅ Netlify CLI already installed.${NC}"
fi

# Check environment variables
echo -e "${BLUE}Checking environment variables...${NC}"
node scripts/check-env-vars.js

echo -e "\n${PURPLE}🔮 MysticArcana Setup Complete${NC}"
echo -e "${BLUE}You can now start the development server:${NC}"
echo -e "    npm run dev"
echo -e "\n${BLUE}To test Netlify Functions locally:${NC}"
echo -e "    netlify dev"
echo -e "\n${BLUE}For more information, see the README.md file.${NC}"
echo -e "${PURPLE}=============================================${NC}\n"