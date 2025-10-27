# Deployment Guide for Eco Circle Waste Management

This guide will help you deploy your full-stack application to production.

## Architecture

- **Frontend**: React + Vite → Netlify
- **Backend**: Flask API → Render/Railway/PythonAnywhere

## Part 1: Deploy Backend (Flask API)

### Option A: Deploy to Render (Recommended - Free tier available)

1. **Create a Render account**: Go to [render.com](https://render.com) and sign up

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: eco-circle-backend
     - **Root Directory**: Leave blank (uses project root)
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `python app.py`

3. **Add Environment Variables** (in Render dashboard):
   - `PYTHON_VERSION`: 3.10

4. **Update app.py for production**:
   - Change the last line to:
   ```python
   if __name__ == "__main__":
       app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
   ```

5. **Deploy**: Click "Create Web Service"

6. **Get your backend URL**: After deployment, copy the URL (e.g., `https://eco-circle-backend.onrender.com`)

### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up and create new project
3. Deploy from GitHub repo
4. Add start command: `python app.py`
5. Copy the deployed URL

### Option C: Deploy to PythonAnywhere

1. Go to [pythonanywhere.com](https://www.pythonanywhere.com)
2. Create free account
3. Upload your code
4. Configure WSGI file
5. Install dependencies

## Part 2: Deploy Frontend to Netlify

### Step 1: Build Test Locally

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Step 2: Deploy to Netlify

#### Method 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Site name: eco-circle-waste-management
   - Deploy path: `./dist`

4. **Deploy to production**:
   ```bash
   netlify deploy --prod
   ```

#### Method 2: Deploy via Netlify Dashboard

1. **Go to Netlify**: Visit [app.netlify.com](https://app.netlify.com)

2. **Create new site**:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize
   - Select your `Eco_Circle` repository

3. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

4. **Add Environment Variables**:
   - Go to Site settings → Environment variables
   - Add variable:
     - **Key**: `VITE_API_URL`
     - **Value**: Your backend URL (e.g., `https://eco-circle-backend.onrender.com`)

5. **Deploy**: Click "Deploy site"

### Step 3: Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

## Part 3: Update CORS in Backend

After deploying frontend, update your Flask backend to allow requests from your Netlify domain:

```python
# In app.py
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "https://your-netlify-site.netlify.app",
            "https://your-custom-domain.com"
        ]
    }
})
```

## Testing Your Deployment

1. **Test Backend**:
   - Visit `https://your-backend-url/api/health`
   - Should return: `{"status": "online", "model_loaded": true}`

2. **Test Frontend**:
   - Visit your Netlify URL
   - Try uploading an image
   - Check browser console for any errors

## Environment Variables Summary

### Netlify (Frontend)
- `VITE_API_URL`: Your backend API URL

### Render/Railway (Backend)
- `PORT`: Auto-set by platform
- `PYTHON_VERSION`: 3.10

## Troubleshooting

### Backend Issues
- **Model not loading**: Check Render/Railway logs
- **Memory issues**: Upgrade to paid tier or use lighter model
- **CORS errors**: Update CORS configuration in app.py

### Frontend Issues
- **Build fails**: Check Node version (should be 18)
- **API calls fail**: Verify `VITE_API_URL` is set correctly
- **404 on refresh**: Ensure netlify.toml redirects are configured

## Continuous Deployment

Both Netlify and Render support auto-deployment:
- Push to `main` branch → Auto-deploys to production
- Create feature branches for testing
- Use pull requests for code review

## Cost Estimate

- **Netlify**: Free tier (100GB bandwidth/month)
- **Render**: Free tier (limited hours, sleeps after inactivity)
- **Total**: $0/month for development, ~$7-20/month for production

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Get backend URL
3. ✅ Configure Netlify environment variables
4. ✅ Deploy frontend to Netlify
5. ✅ Test end-to-end functionality
6. ✅ Set up custom domain (optional)
7. ✅ Enable HTTPS (automatic on both platforms)

Need help? Check the logs in both Netlify and Render dashboards!
