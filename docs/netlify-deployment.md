# Netlify Deployment Guide for MysticArcana

This guide will help you deploy the MysticArcana application to Netlify, including setting up serverless functions and environment variables.

## Prerequisites

- Netlify account
- Git repository with your MysticArcana code
- Supabase project set up (see `supabase-setup.md`)
- Node.js and npm installed locally

## Step 1: Prepare Your Project

Ensure your project has the following Netlify configuration files:

### netlify.toml

This file should be in the root of your project and should look similar to this:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

# Redirect all API calls to Netlify Functions
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Redirect all routes to index.html (for SPA routing)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### package.json scripts

Ensure your `package.json` has the following scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
}
```

## Step 2: Install the Netlify CLI

If you haven't already, install the Netlify CLI:

```bash
npm install -g netlify-cli
```

## Step 3: Login to Netlify

Login to your Netlify account via the CLI:

```bash
netlify login
```

This will open a browser window to authenticate your Netlify account.

## Step 4: Initialize the Netlify Site

Link your local project to a Netlify site:

```bash
netlify init
```

Follow the prompts to:
1. Create a new site or use an existing one
2. Configure your build settings (or accept the defaults)

## Step 5: Set Up Environment Variables

MysticArcana needs environment variables to connect to Supabase and other services. You can set these up in two ways:

### Option 1: Manual Setup

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Environment
3. Add the following environment variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (secret)
   - `OPENAI_API_KEY` - Your OpenAI API key (if using AI features)
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (if using payments)
   - `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (if using payments)

### Option 2: Automated Setup

Use our provided script to set up environment variables:

```bash
node scripts/setup-netlify-env.js
```

This script will:
1. Check if you're logged in to Netlify
2. Let you select your Netlify site
3. Set up the required environment variables

## Step 6: Test Netlify Functions Locally

Before deploying, test your Netlify Functions locally:

```bash
netlify dev
```

This will start a local development server that emulates the Netlify production environment, including Functions.

Test your API endpoints to ensure they're working correctly:

```
http://localhost:8888/api/daily-tarot
```

## Step 7: Deploy to Netlify

When you're ready to deploy:

```bash
netlify deploy --prod
```

This will:
1. Build your application
2. Deploy your functions
3. Publish your site to Netlify's global CDN

## Step 8: Verify Your Deployment

After deployment, verify that:

1. Your main site is working
2. Your Daily Tarot card feature works
3. Authentication is working
4. Any other critical features are functioning

### Troubleshooting Common Issues

#### Functions Not Found (404)

If your functions return 404, check:
- Your `netlify.toml` redirects are correctly set up
- Your functions are in the right directory (`netlify/functions`)
- The function files export a `handler` function

#### Environment Variable Issues

If you suspect environment variable problems:
1. Check the Netlify logs
2. Verify variables in the Netlify dashboard
3. Redeploy after making changes to environment variables

#### CORS Errors

If you're getting CORS errors:
1. Check your Supabase project settings
2. Ensure your frontend is calling `/api/function-name` (not `/.netlify/functions/...`)

## Step 9: Set Up Continuous Deployment (Optional)

For automatic deployments when you push to your repository:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Continuous Deployment
3. Connect to your Git provider (GitHub, GitLab, etc.)
4. Select your repository
5. Configure build settings

## Advanced: Custom Domain (Optional)

To use a custom domain:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Domain management
3. Click "Add custom domain"
4. Follow the instructions to configure DNS

## Function-Specific Configuration

### Daily Tarot Function

The daily tarot function needs special attention:

1. Ensure `daily-tarot.js` is properly accessing environment variables:
   ```javascript
   const supabaseUrl = process.env.SUPABASE_URL;
   const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
   ```

2. Check that the function has proper error handling
3. Verify that the card data format matches what the frontend expects

## Monitoring and Logs

To monitor your functions and check logs:

1. Go to your Netlify site dashboard
2. Navigate to Functions
3. Click on a function to see its logs and invocation history

You can also stream logs locally:

```bash
netlify functions:logs --streaming
```

## Conclusion

Your MysticArcana application should now be successfully deployed to Netlify with working serverless functions and environment configuration.

For additional help with Netlify deployments, refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)