#!/usr/bin/env node

/**
 * Environment Variables Checker for MysticArcana
 * 
 * This script:
 * 1. Checks for required environment variables
 * 2. Validates they have values
 * 3. Provides guidance for setting them up
 * 
 * Usage:
 *   node scripts/check-env-vars.js
 */

// Check if this is running on Netlify
const isNetlify = process.env.NETLIFY === 'true';

// Define required environment variables
const requiredVars = {
  supabase: [
    { name: 'SUPABASE_URL', frontend: 'VITE_SUPABASE_URL' },
    { name: 'SUPABASE_ANON_KEY', frontend: 'VITE_SUPABASE_ANON_KEY' },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', frontend: null } // No frontend equivalent
  ],
  openai: [
    { name: 'OPENAI_API_KEY', frontend: null }  // No frontend equivalent (security)
  ],
  stripe: [
    { name: 'STRIPE_SECRET_KEY', frontend: null }, // No frontend equivalent (security)
    { name: 'STRIPE_PUBLISHABLE_KEY', frontend: 'VITE_STRIPE_PUBLISHABLE_KEY' }
  ]
};

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Helper to mask sensitive variables
function maskValue(value) {
  if (!value) return null;
  if (value.length <= 8) return '********';
  return value.substring(0, 4) + '********' + value.substring(value.length - 4);
}

// Check if an environment variable exists
function checkEnvVar(varName) {
  return {
    exists: !!process.env[varName],
    value: process.env[varName]
  };
}

// Print section header
function printHeader(title) {
  console.log(`\n${colors.cyan}==== ${title} =====${colors.reset}\n`);
}

// Print environment variable status
function printVarStatus(varName, exists, maskedValue = null) {
  if (exists) {
    console.log(`${colors.green}✓ ${varName}${colors.reset}: ${maskedValue || 'Set'}`);
  } else {
    console.log(`${colors.red}✗ ${varName}${colors.reset}: Not set`);
  }
}

// Main check function
function checkEnvironment() {
  console.log(`\n${colors.magenta}🔮 MysticArcana Environment Variables Check${colors.reset}`);
  console.log(`${colors.magenta}==============================================${colors.reset}`);
  
  if (isNetlify) {
    console.log(`\n${colors.yellow}Running on Netlify${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}Running locally${colors.reset}`);
  }
  
  let missingVars = [];
  
  // Check each category of variables
  for (const [category, variables] of Object.entries(requiredVars)) {
    printHeader(category.toUpperCase());
    
    for (const variable of variables) {
      // Check backend variable
      const backendVar = checkEnvVar(variable.name);
      printVarStatus(variable.name, backendVar.exists, 
                    backendVar.exists ? maskValue(backendVar.value) : null);
      
      if (!backendVar.exists) {
        missingVars.push(variable.name);
      }
      
      // If there's a frontend equivalent, check it too
      if (variable.frontend) {
        const frontendVar = checkEnvVar(variable.frontend);
        printVarStatus(`  ${variable.frontend} (frontend)`, frontendVar.exists, 
                      frontendVar.exists ? maskValue(frontendVar.value) : null);
        
        if (!frontendVar.exists) {
          missingVars.push(variable.frontend);
        }
      }
    }
  }
  
  // Provide guidance if there are missing variables
  if (missingVars.length > 0) {
    printHeader('MISSING VARIABLES');
    console.log(`${colors.red}The following environment variables are missing:${colors.reset}`);
    console.log(missingVars.join('\n'));
    
    printHeader('SETUP INSTRUCTIONS');
    
    if (isNetlify) {
      console.log(`${colors.yellow}To set up environment variables on Netlify:${colors.reset}`);
      console.log('1. Go to your Netlify site dashboard');
      console.log('2. Navigate to Site settings > Build & deploy > Environment');
      console.log('3. Add each missing variable and its value');
      console.log('4. Redeploy your site');
    } else {
      console.log(`${colors.yellow}To set up environment variables locally:${colors.reset}`);
      console.log('1. Create or edit a .env file in the project root');
      console.log('2. Add each missing variable in the format KEY=VALUE');
      console.log('3. Restart your development server');
      
      console.log(`\n${colors.yellow}Sample .env file:${colors.reset}`);
      console.log('```');
      console.log('# Supabase');
      console.log('SUPABASE_URL=https://your-project.supabase.co');
      console.log('SUPABASE_ANON_KEY=your-anon-key');
      console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-key');
      console.log('VITE_SUPABASE_URL=https://your-project.supabase.co');
      console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
      console.log('\n# OpenAI');
      console.log('OPENAI_API_KEY=your-openai-key');
      console.log('\n# Stripe (if needed)');
      console.log('STRIPE_SECRET_KEY=your-stripe-secret-key');
      console.log('STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key');
      console.log('VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key');
      console.log('```');
    }
    
    console.log(`\n${colors.red}⚠️ The application may not function correctly without these variables.${colors.reset}`);
  } else {
    console.log(`\n${colors.green}✅ All required environment variables are set!${colors.reset}`);
  }
  
  console.log('\n');
}

// Run the check
checkEnvironment();