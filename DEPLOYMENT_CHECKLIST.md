# 🚀 Deployment Checklist for Eco Circle

## ✅ Pre-Deployment Verification

All code changes have been made and committed to GitHub. Your project is **production-ready**!

### Code Changes Made:

1. **Backend ([app.py](file://c:\Users\lenovo\OneDrive\Desktop\eco_circle\eco_circle\app.py))**:
   - ✅ Dynamic port binding from `PORT` environment variable
   - ✅ Production CORS configuration with `FRONTEND_URL` environment variable
   - ✅ Debug mode controlled by `FLASK_ENV` environment variable
   - ✅ Informative startup logs showing environment and CORS settings

2. **Frontend ([ImageUpload.tsx](file://c:\Users\lenovo\OneDrive\Desktop\eco_circle\eco_circle\src\pages\ImageUpload.tsx))**:
   - ✅ Uses `VITE_API_URL` environment variable for backend connection
   - ✅ Falls back to localhost for development

3. **Configuration Files**:
   - ✅ [netlify.toml](file://c:\Users\lenovo\OneDrive\Desktop\eco_circle\eco_circle\netlify.toml) - Netlify build configuration
   - ✅ [.env.example](file://c:\Users\lenovo\OneDrive\Desktop\eco_circle\eco_circle\.env.example) - Environment variables template
   - ✅ [.gitignore](file://c:\Users\lenovo\OneDrive\Desktop\eco_circle\eco_circle\.gitignore) - Excludes env files and venv
   - ✅ [package.json](file://c:\Users\lenovo\OneDrive\Desktop\eco_circle\eco_circle\package.json) - Updated with type-check script

4. **Documentation**:
   - ✅ QUICK_DEPLOY.md - Quick start guide
   - ✅ DEPLOYMENT_GUIDE.md - Comprehensive deployment guide
   - ✅ NETLIFY_DEPLOY.md - Netlify-specific instructions
   - ✅ RENDER_DEPLOY.md - Render-specific instructions

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Render (10 minutes)

#### 1.1 Create Render Account
- Go to: https://render.com
- Sign up with GitHub

#### 1.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Eco_Circle`
3. Configure service:
   ```
   Name: eco-circle-api
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python app.py
   ```
4. Click **"Create Web Service"**

#### 1.3 Wait for Deployment
- Initial deployment: 5-10 minutes
- Watch the logs for "✅ SIGLIP model loaded successfully!"

#### 1.4 Save Your Backend URL
- Copy the URL (e.g., `https://eco-circle-api.onrender.com`)
- You'll need this for the next step!

#### 1.5 Test Backend
Visit: `https://eco-circle-api.onrender.com/api/health`

Expected response:
```json
{
  "status": "online",
  "model_loaded": true,
  "timestamp": "2025-10-27T..."
}
```

---

### Step 2: Deploy Frontend to Netlify (5 minutes)

#### 2.1 Create Netlify Account
- Go to: https://app.netlify.com
- Sign up with GitHub

#### 2.2 Import Project
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"GitHub"**
3. Authorize Netlify
4. Select your **`Eco_Circle`** repository

#### 2.3 Configure Build Settings
Netlify auto-detects from `netlify.toml`, just verify:
- Build command: `npm run build`
- Publish directory: `dist`
- Click **"Show advanced"** → **"New variable"**

#### 2.4 Add Environment Variable ⚠️ CRITICAL
1. Add variable:
   ```
   Key: VITE_API_URL
   Value: https://eco-circle-api.onrender.com
   ```
   (Use YOUR backend URL from Step 1.4)

2. Click **"Add"**

#### 2.5 Deploy Site
1. Click **"Deploy site"**
2. Wait 2-3 minutes
3. Your site is live! 🎉

#### 2.6 Save Your Frontend URL
- Copy the URL (e.g., `https://eco-circle-waste.netlify.app`)
- You'll need this for the next step!

---

### Step 3: Update Backend CORS (2 minutes)

Now that you have your Netlify URL, update the backend to allow requests from it.

#### Option A: Via Render Dashboard (Recommended)
1. Go to Render dashboard
2. Select **`eco-circle-api`** service
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   ```
   Key: FRONTEND_URL
   Value: https://eco-circle-waste.netlify.app
   ```
   (Use YOUR Netlify URL from Step 2.6)
6. Click **"Save Changes"**
7. Service will auto-redeploy (takes 2-3 minutes)

#### Option B: Update Code (Alternative)
Edit `app.py` line 13-19 and add your Netlify URL to the CORS configuration, then commit and push.

---

### Step 4: Test Your Live Application (3 minutes)

#### 4.1 Test Frontend
1. Visit your Netlify URL
2. Navigate to **"Upload Image"** page
3. Upload a waste image (battery, plastic bottle, food waste, etc.)
4. Should classify correctly as wet/dry/e-waste

#### 4.2 Check Browser Console (F12)
- Look for successful API calls to your Render backend
- Should see no CORS errors

#### 4.3 Test Different Waste Types
- Battery → Should classify as **E-Waste** ⚡
- Banana peel → Should classify as **Wet Waste** 💧
- Plastic bottle → Should classify as **Dry Waste** 🗑️

---

## 🎯 Your Live URLs

After deployment, you'll have:

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Netlify | `https://your-site.netlify.app` |
| Backend | Render | `https://eco-circle-api.onrender.com` |
| API Health | Render | `https://eco-circle-api.onrender.com/api/health` |

---

## ⚙️ Environment Variables Summary

### Netlify (Frontend)
| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_URL` | `https://eco-circle-api.onrender.com` | Backend API endpoint |

### Render (Backend)
| Variable | Value | Purpose |
|----------|-------|---------|
| `FRONTEND_URL` | `https://your-site.netlify.app` | CORS allowed origin |
| `FLASK_ENV` | `production` | Production mode (optional) |
| `PYTHON_VERSION` | `3.10` | Python version (optional) |

---

## 🆓 Free Tier Limitations

### Render Free Tier
- ⚠️ Backend sleeps after 15 minutes of inactivity
- First request after sleep: 30-60 seconds (cold start)
- Subsequent requests: Fast and normal
- Perfect for demo/portfolio projects

### Netlify Free Tier
- ✅ Always online, no sleep
- 100 GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS

---

## 🔧 Troubleshooting

### Issue: "Model not loaded"
- **Solution**: Check Render logs, model might be loading. Wait 1-2 minutes after deployment.

### Issue: CORS errors in browser console
- **Solution**: Make sure `FRONTEND_URL` is set in Render with your exact Netlify URL

### Issue: First request takes 60+ seconds
- **Solution**: This is normal on Render free tier (cold start). Service was sleeping.

### Issue: Netlify build fails
- **Solution**: 
  1. Check build logs in Netlify
  2. Verify `VITE_API_URL` is set
  3. Make sure Node version is 18

### Issue: Image classification doesn't work
- **Solution**: 
  1. Check browser console for errors
  2. Verify `VITE_API_URL` is correct
  3. Test backend health endpoint directly

---

## 📊 Monitoring Your Deployment

### Netlify
- **Dashboard**: View builds, deployments, and analytics
- **Logs**: Real-time build logs
- **Functions**: Monitor serverless functions (if any)

### Render
- **Dashboard**: View service status and metrics
- **Logs**: Real-time application logs
- **Events**: Deployment history

---

## 🔄 Continuous Deployment

Both platforms support auto-deployment:

1. **Make changes** to your code locally
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```
3. **Automatic deployment**:
   - Netlify: Deploys frontend automatically (2-3 min)
   - Render: Deploys backend automatically (5-10 min)

---

## 🌐 Custom Domain (Optional)

### For Netlify (Frontend)
1. Site settings → Domain management
2. Add custom domain: `ecocircle.com`
3. Update DNS records as instructed

### For Render (Backend)
1. Settings → Custom domain
2. Add subdomain: `api.ecocircle.com`
3. Update DNS records

Don't forget to update `FRONTEND_URL` in Render and `VITE_API_URL` in Netlify!

---

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Backend health check returns `"status": "online"`
- ✅ Frontend loads without errors
- ✅ Image upload works
- ✅ Classification returns correct waste type
- ✅ No CORS errors in browser console

---

## 📚 Additional Resources

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **Project Repo**: https://github.com/KAIZEN1503/Eco_Circle

---

## 🆘 Need Help?

Refer to these detailed guides:
1. `QUICK_DEPLOY.md` - Quick step-by-step guide
2. `NETLIFY_DEPLOY.md` - Netlify-specific details
3. `RENDER_DEPLOY.md` - Render-specific details
4. `DEPLOYMENT_GUIDE.md` - Comprehensive troubleshooting

---

**Ready to deploy? Start with Step 1! 🚀**
