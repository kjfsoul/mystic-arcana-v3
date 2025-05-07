#!/usr/bin/env node

/**
 * Netlify Environment Setup Script for MysticArcana
 * 
 * This script:
 * 1. Checks if you're logged in to Netlify CLI
 * 2. Helps you select your Netlify site
 * 3. Sets up required environment variables on Netlify
 * 
 * Usage:
 *   node scripts/setup-netlify-env.js
 */

const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ANSI color codes
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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Execute a command and return a promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

// Ask a question and get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Check if user is logged in to Netlify CLI
async function checkNetlifyLogin() {
  try {
    console.log(`${colors.blue}Checking Netlify login status...${colors.reset}`);
    const output = await execPromise('netlify status');
    if (output.includes('Logged in')) {
      console.log(`${colors.green}✓ You're logged in to Netlify CLI${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠️ You're not logged in to Netlify CLI${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error checking Netlify login status${colors.reset}`);
    console.log(`${colors.red}✗ Make sure Netlify CLI is installed (npm install -g netlify-cli)${colors.reset}`);
    return false;
  }
}

// Log in to Netlify CLI
async function loginToNetlify() {
  try {
    console.log(`${colors.blue}Logging in to Netlify CLI...${colors.reset}`);
    console.log(`${colors.yellow}A browser window will open for authentication.${colors.reset}`);
    await execPromise('netlify login');
    console.log(`${colors.green}✓ Successfully logged in to Netlify CLI${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ Failed to log in to Netlify CLI${colors.reset}`);
    console.log(error);
    return false;
  }
}

// Get Netlify sites
async function getNetlifySites() {
  try {
    const output = await execPromise('netlify sites:list --json');
    return JSON.parse(output);
  } catch (error) {
    console.log(`${colors.red}✗ Failed to get Netlify sites${colors.reset}`);
    console.log(error);
    return [];
  }
}

// Select a Netlify site
async function selectNetlifySite(sites) {
  console.log(`${colors.blue}Available Netlify sites:${colors.reset}`);
  sites.forEach((site, index) => {
    console.log(`${index + 1}. ${site.name} (${site.url})`);
  });
  
  const answer = await askQuestion(`${colors.yellow}Select a site by number (or type 'new' to create a new site): ${colors.reset}`);
  
  if (answer.toLowerCase() === 'new') {
    return await createNewSite();
  }
  
  const siteIndex = parseInt(answer) - 1;
  if (isNaN(siteIndex) || siteIndex < 0 || siteIndex >= sites.length) {
    console.log(`${colors.red}✗ Invalid selection${colors.reset}`);
    return null;
  }
  
  return sites[siteIndex];
}

// Create a new Netlify site
async function createNewSite() {
  try {
    console.log(`${colors.blue}Creating a new Netlify site...${colors.reset}`);
    const siteName = await askQuestion(`${colors.yellow}Enter a name for your new site (or press Enter for a random name): ${colors.reset}`);
    
    let command = 'netlify sites:create --manual';
    if (siteName) {
      command += ` --name ${siteName}`;
    }
    
    const output = await execPromise(command);
    console.log(`${colors.green}✓ Site created successfully${colors.reset}`);
    
    // Get the site ID from the output
    const siteId = output.match(/Site ID: ([a-f0-9-]+)/)?.[1];
    if (!siteId) {
      console.log(`${colors.red}✗ Could not determine site ID${colors.reset}`);
      return null;
    }
    
    // Now get the full site details
    const sites = await getNetlifySites();
    return sites.find(site => site.id === siteId);
  } catch (error) {
    console.log(`${colors.red}✗ Failed to create a new Netlify site${colors.reset}`);
    console.log(error);
    return null;
  }
}

// Load environment variables from .env file
function loadEnvVars() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.yellow}⚠️ .env file not found.${colors.reset}`);
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const vars = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key && value) {
        vars[key] = value;
      }
    }
  });
  
  return vars;
}

// Set environment variables on Netlify
async function setNetlifyEnvVars(siteId, envVars) {
  const requiredVars = [
    { name: 'SUPABASE_URL', environment: true },
    { name: 'SUPABASE_ANON_KEY', environment: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', environment: true },
    { name: 'OPENAI_API_KEY', environment: true },
    { name: 'STRIPE_SECRET_KEY', environment: true, optional: true },
    { name: 'STRIPE_PUBLISHABLE_KEY', environment: true, optional: true }
  ];
  
  console.log(`${colors.blue}Setting up environment variables on Netlify...${colors.reset}`);
  
  let updatedCount = 0;
  
  for (const varConfig of requiredVars) {
    const { name, environment, optional } = varConfig;
    
    // Skip optional variables that aren't in .env
    if (optional && !envVars[name]) {
      console.log(`${colors.yellow}⚠️ Skipping optional variable ${name} (not found in .env)${colors.reset}`);
      continue;
    }
    
    // If not in .env, ask for it
    let value = envVars[name];
    if (!value && !optional) {
      value = await askQuestion(`${colors.yellow}Enter value for ${name}: ${colors.reset}`);
    }
    
    if (!value) {
      if (optional) {
        console.log(`${colors.yellow}⚠️ Skipping optional variable ${name}${colors.reset}`);
        continue;
      } else {
        console.log(`${colors.red}✗ Required variable ${name} not provided${colors.reset}`);
        continue;
      }
    }
    
    try {
      console.log(`${colors.blue}Setting ${name}...${colors.reset}`);
      
      let command = `netlify env:set ${name} "${value}"`;
      if (environment) {
        command += ' --scope functions';
      }
      
      await execPromise(`netlify env:set ${name} "${value}" --scope functions --site-id ${siteId}`);
      console.log(`${colors.green}✓ Set ${name}${colors.reset}`);
      updatedCount++;
    } catch (error) {
      console.log(`${colors.red}✗ Failed to set ${name}${colors.reset}`);
      console.log(error);
    }
  }
  
  return updatedCount;
}

// Main function
async function main() {
  console.log(`${colors.magenta}🔮 MysticArcana Netlify Environment Setup${colors.reset}`);
  console.log(`${colors.magenta}=============================================${colors.reset}\n`);
  
  // Check if user is logged in to Netlify CLI
  const isLoggedIn = await checkNetlifyLogin();
  
  // If not logged in, log in
  if (!isLoggedIn) {
    const loginSuccess = await loginToNetlify();
    if (!loginSuccess) {
      console.log(`${colors.red}✗ Failed to log in to Netlify CLI. Exiting...${colors.reset}`);
      rl.close();
      return;
    }
  }
  
  // Get Netlify sites
  const sites = await getNetlifySites();
  
  if (sites.length === 0) {
    console.log(`${colors.yellow}⚠️ No Netlify sites found${colors.reset}`);
    const createSite = await askQuestion(`${colors.yellow}Would you like to create a new site? (y/n) ${colors.reset}`);
    
    if (createSite.toLowerCase() !== 'y') {
      console.log(`${colors.red}✗ Exiting...${colors.reset}`);
      rl.close();
      return;
    }
    
    const newSite = await createNewSite();
    if (!newSite) {
      console.log(`${colors.red}✗ Failed to create a new site. Exiting...${colors.reset}`);
      rl.close();
      return;
    }
    
    console.log(`${colors.green}✓ Successfully created site: ${newSite.name} (${newSite.url})${colors.reset}`);
    var selectedSite = newSite;
  } else {
    // Select a Netlify site
    var selectedSite = await selectNetlifySite(sites);
    if (!selectedSite) {
      console.log(`${colors.red}✗ No site selected. Exiting...${colors.reset}`);
      rl.close();
      return;
    }
  }
  
  console.log(`${colors.green}✓ Selected site: ${selectedSite.name} (${selectedSite.url})${colors.reset}`);
  
  // Load environment variables from .env file
  const envVars = loadEnvVars();
  
  // Set environment variables on Netlify
  const updatedCount = await setNetlifyEnvVars(selectedSite.id, envVars);
  
  // Update netlify.toml
  if (updatedCount > 0) {
    console.log(`${colors.green}✓ Successfully set ${updatedCount} environment variables${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️ No environment variables were set${colors.reset}`);
  }
  
  console.log(`${colors.magenta}\n🔮 MysticArcana Netlify Setup Complete${colors.reset}`);
  console.log(`${colors.blue}You can now deploy your site to Netlify:${colors.reset}`);
  console.log(`    netlify deploy --prod`);
  console.log(`${colors.blue}Or test your functions locally:${colors.reset}`);
  console.log(`    netlify dev`);
  console.log(`${colors.magenta}=============================================${colors.reset}\n`);
  
  rl.close();
}

main();