# 🚀 Quick Deployment Steps for Netlify

## Prerequisites
- GitHub account with your Eco_Circle repository
- Netlify account (free): https://app.netlify.com
- Render account (free): https://render.com

## Step-by-Step Deployment

### Part 1: Deploy Backend First (5 minutes)

1. **Go to Render**: https://render.com and sign in with GitHub

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Select your `Eco_Circle` repository
   - Settings:
     - Name: `eco-circle-api`
     - Runtime: `Python 3`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `python app.py`
   - Click "Create Web Service"

3. **Wait for deployment** (5-10 minutes on first deploy)

4. **Copy your backend URL**: 
   - Will be something like: `https://eco-circle-api.onrender.com`
   - **IMPORTANT**: Save this URL, you'll need it next!

### Part 2: Deploy Frontend to Netlify (3 minutes)

1. **Go to Netlify**: https://app.netlify.com

2. **Import Project**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize and select your `Eco_Circle` repository

3. **Build Settings** (Netlify auto-detects these, just verify):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" → "New variable"

4. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://eco-circle-api.onrender.com` (your backend URL from step 1)
   - Click "Add"

5. **Deploy**:
   - Click "Deploy site"
   - Wait 2-3 minutes

6. **Your site is live!** 🎉
   - Netlify will give you a URL like: `https://random-name-12345.netlify.app`

### Part 3: Update Backend CORS (1 minute)

After getting your Netlify URL, update the backend:

1. Go to your Render dashboard
2. Select your `eco-circle-api` service
3. Go to "Environment" tab
4. Add variable:
   - Key: `FRONTEND_URL`
   - Value: Your Netlify URL (e.g., `https://random-name-12345.netlify.app`)
5. Click "Save Changes" (this will redeploy)

OR manually update `app.py` line 11:
```python
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "https://your-netlify-url.netlify.app"]}})
```

### Testing

1. Visit your Netlify URL
2. Go to "Upload Image" page
3. Upload a waste image
4. Should classify it as wet/dry/e-waste

## Common Issues

### Backend takes long to respond
- **Cause**: Render free tier sleeps after 15 mins of inactivity
- **Solution**: First request takes 30-60 seconds to wake up, subsequent requests are fast

### CORS errors
- **Fix**: Make sure you updated CORS in app.py with your Netlify URL

### Build fails on Netlify
- **Check**: Environment variable `VITE_API_URL` is set correctly

## Custom Domain (Optional)

### Netlify:
1. Site settings → Domain management → Add custom domain
2. Update DNS records with your domain registrar

### Render:
1. Settings → Custom domain → Add your domain
2. Update DNS records

## Next Steps

✅ Test all features on production
✅ Share your live URL!
✅ Monitor logs on Render dashboard
✅ Check Netlify analytics

Your live URLs:
- Frontend: Check Netlify dashboard
- Backend: Check Render dashboard

Need help? Check DEPLOYMENT_GUIDE.md for detailed troubleshooting!
