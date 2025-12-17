# EGWallet Deployment Guide

## Quick Deployment to Netlify

The application is **production-ready** and can be deployed to Netlify in 3 ways:

### Option 1: Deploy via Netlify Web UI (Recommended)

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/
   - Log in with your account

2. **Import from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository: `Frannica/dockerfile`
   - Select branch: `copilot/deploy-egwallet-website`

3. **Configure Build Settings** (Auto-detected from netlify.toml)
   - Build command: `npm install && npm run build`
   - Publish directory: `.next`
   - The `@netlify/plugin-nextjs` plugin will be automatically applied

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application
   - You'll get a live URL like: `https://your-site-name.netlify.app`

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Navigate to your project
cd /path/to/dockerfile

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Or deploy directly
netlify deploy --prod
```

### Option 3: Deploy via Git Integration (Continuous Deployment)

1. Merge this PR to your main branch
2. In Netlify Dashboard, connect your repository
3. Set up continuous deployment
4. Every push to main will automatically deploy

## Pre-Deployment Checklist

✅ All required files created:
- `netlify.toml` - Deployment configuration
- `app/page.tsx` - Main landing page
- `app/api/chat/route.ts` - AI chat endpoint

✅ Build tested successfully:
- Dependencies install: ✅
- TypeScript compilation: ✅
- Production build: ✅ (5/5 pages generated)

✅ Application features:
- 8 currency support (XAF, XOF, NGN, GHS, ZAR, CNY, USD, EUR)
- Real-time exchange rates API
- AI chat in 5 languages
- Responsive dark theme design

## Post-Deployment Steps

1. **Custom Domain** (Optional)
   - Go to Site settings → Domain management
   - Add your custom domain

2. **Environment Variables** (If needed)
   - Go to Site settings → Environment variables
   - Add any required API keys or secrets

3. **Test Your Deployment**
   - Visit your deployed URL
   - Test the AI chat functionality
   - Verify currency exchange rates are loading
   - Check all pages (/, /privacy)
   - Test on mobile devices

## Troubleshooting

If deployment fails:

1. **Check Build Logs**
   - Review the build logs in Netlify dashboard
   - Look for any errors during `npm install` or `npm run build`

2. **Node Version**
   - Netlify uses Node.js 18 by default
   - You can specify a version in `package.json`:
     ```json
     "engines": {
       "node": "18.x"
     }
     ```

3. **Environment Variables**
   - Ensure any required environment variables are set in Netlify

## Build Information

- **Framework**: Next.js 15
- **Build Time**: ~4 seconds
- **Output**: Static pages + API routes (Edge runtime)
- **Pages Generated**: 5
  - `/` (Landing page)
  - `/_not-found` (404 page)
  - `/api/chat` (AI chat endpoint)
  - `/api/exchange-rates` (Currency rates)
  - `/privacy` (Privacy policy)

## Support

For deployment issues:
- Netlify Docs: https://docs.netlify.com/
- Next.js Deployment: https://nextjs.org/docs/deployment

Your application is ready to go live! 🚀
