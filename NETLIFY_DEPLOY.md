# Netlify Deployment Configuration

This file provides the necessary configuration for deploying the React frontend to Netlify.

## Netlify Build Configuration

The `netlify.toml` file in the root directory contains all build settings. No manual configuration needed!

### Build Settings (Auto-configured)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: `18`

## Environment Variables

**CRITICAL**: You must add environment variables in Netlify dashboard.

### How to Add Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add the following:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_API_URL` | Your Render backend URL | `https://eco-circle-api.onrender.com` |

⚠️ **Important**: 
- Do NOT include trailing slash in the URL
- The variable must start with `VITE_` to be accessible in the app
- After adding variables, you must redeploy (trigger a new deploy)

## Deployment Methods

### Method 1: Continuous Deployment (Recommended)

1. **Connect to GitHub**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Authorize Netlify
   - Select your `Eco_Circle` repository

2. **Configure Build**:
   - Netlify auto-detects settings from `netlify.toml`
   - Just verify and click "Deploy"

3. **Add Environment Variable**:
   - Go to Site settings → Environment variables
   - Add `VITE_API_URL` with your Render backend URL
   - Click "Trigger deploy" to rebuild with new env var

4. **Auto-Deploy**:
   - Every push to `main` branch auto-deploys
   - Pull requests create preview deploys

### Method 2: Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Initialize**:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select team
   - Site name: `eco-circle-waste-management`

4. **Set Environment Variable**:
   ```bash
   netlify env:set VITE_API_URL "https://your-render-backend.onrender.com"
   ```

5. **Deploy**:
   ```bash
   # Test deploy
   netlify deploy
   
   # Production deploy
   netlify deploy --prod
   ```

### Method 3: Manual Deploy (Drag & Drop)

1. **Build Locally**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag the `dist` folder to the upload area
   - Note: Environment variables must be set via dashboard

## Testing Your Deployment

After deployment, test your site:

1. **Visit your Netlify URL**: 
   - Format: `https://your-site-name.netlify.app`
   - Or custom domain if configured

2. **Test Image Upload**:
   - Navigate to "Upload Image" page
   - Upload a waste image
   - Should classify correctly

3. **Check Console** (F12):
   - Look for API calls to your Render backend
   - Should see successful responses

## Build Troubleshooting

### Build Fails

**Check Node Version**:
- Netlify uses Node 18 (configured in netlify.toml)
- Verify locally: `node --version`

**Dependencies Issue**:
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variable Not Working

1. **Check naming**: Must start with `VITE_`
2. **Redeploy**: After adding env vars, trigger new deploy
3. **Verify in code**: 
   ```typescript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

### 404 on Page Refresh

- Already fixed via redirects in `netlify.toml`
- If still issues, check that `netlify.toml` is in root

### CORS Errors

- Ensure backend CORS is configured with your Netlify URL
- Check backend logs on Render

## Custom Domain

### Add Custom Domain

1. **In Netlify**:
   - Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `ecocircle.com`)

2. **DNS Configuration**:
   
   **Option A - Netlify DNS (Recommended)**:
   - Use Netlify's nameservers
   - Automatically handles SSL
   
   **Option B - External DNS**:
   - Add CNAME record:
     ```
     Type: CNAME
     Name: www (or @)
     Value: your-site-name.netlify.app
     ```

3. **SSL Certificate**:
   - Netlify provides free SSL (Let's Encrypt)
   - Automatically provisioned (takes ~24 hours)

### Update Backend CORS

After adding custom domain, update Render environment variable:
```
FRONTEND_URL=https://ecocircle.com,https://www.ecocircle.com
```

## Performance Optimization

Already configured:
- ✅ React Router redirects
- ✅ SPA fallback routing
- ✅ Build optimization via Vite
- ✅ Asset compression

### Additional Optimizations

1. **Enable Asset Optimization**:
   - Site settings → Build & deploy → Post processing
   - Enable: Bundle CSS, Minify JS, Compress images

2. **Analytics** (Optional):
   - Site settings → Analytics
   - Enable Netlify Analytics ($9/month)

## Deployment Status

### Build Logs
- Dashboard → Deploys → Click on deploy → Deploy log
- Check for errors or warnings

### Deploy Previews
- Every PR creates a preview deploy
- Test before merging to main

### Rollback
- Dashboard → Deploys
- Click "..." on previous deploy
- Choose "Publish deploy"

## Branch Deploys (Advanced)

Deploy different branches:

1. **Branch Deploy Settings**:
   - Site settings → Build & deploy → Continuous deployment
   - Branch deploys: All, None, or specific branches

2. **Deploy Contexts**:
   ```toml
   # netlify.toml
   [context.production]
   command = "npm run build"
   
   [context.deploy-preview]
   command = "npm run build:dev"
   ```

## Cost

- **Free Tier**: 
  - 100GB bandwidth/month
  - 300 build minutes/month
  - Unlimited sites
  - Automatic HTTPS
  - Perfect for most projects!

- **Pro Tier** ($19/month):
  - More bandwidth
  - More build minutes
  - Team collaboration features

## Support Resources

- Documentation: https://docs.netlify.com
- Community: https://answers.netlify.com
- Status: https://www.netlifystatus.com

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Set `VITE_API_URL` environment variable
3. ✅ Test image classification
4. ✅ (Optional) Add custom domain
5. ✅ Monitor build logs
6. ✅ Set up deploy notifications (Settings → Build hooks)

Your frontend is now live! 🎉
