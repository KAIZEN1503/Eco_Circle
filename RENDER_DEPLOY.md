# Render Deployment Configuration

This file provides the necessary configuration for deploying the Flask backend to Render.

## Render Build Configuration

When creating a new Web Service on Render, use these settings:

### Basic Settings
- **Name**: `eco-circle-api` (or your preferred name)
- **Runtime**: `Python 3`
- **Region**: Choose closest to your target audience
- **Branch**: `main`

### Build & Deploy
- **Build Command**: 
  ```bash
  pip install -r requirements-backend.txt
  ```

- **Start Command**: 
  ```bash
  python app.py
  ```

### Environment Variables

Add these environment variables in Render dashboard (Settings → Environment):

| Key | Value | Description |
|-----|-------|-------------|
| `PYTHON_VERSION` | `3.10` | Python version to use |
| `FRONTEND_URL` | `https://your-netlify-site.netlify.app` | Your Netlify frontend URL (update after deploying frontend) |
| `FLASK_ENV` | `production` | Set to production mode |

## Important Notes

### Free Tier Limitations
- Service will spin down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds (cold start)
- Perfect for demo/portfolio projects

### Upgrading to Paid Tier
If you need:
- Always-on service (no cold starts)
- More RAM for faster model loading
- Custom domains with SSL

Consider upgrading to Render's paid plan ($7/month for Starter)

## Testing Your Deployment

After deployment, test your API:

1. **Health Check**:
   ```
   GET https://your-app.onrender.com/api/health
   ```
   Expected response:
   ```json
   {
     "status": "online",
     "model_loaded": true,
     "timestamp": "2025-10-27T..."
   }
   ```

2. **Image Classification** (using curl):
   ```bash
   curl -X POST https://your-app.onrender.com/api/classify \
     -F "image=@path/to/image.jpg"
   ```

## Troubleshooting

### Model Loading Issues
- **Symptom**: `model_loaded: false`
- **Solution**: Check Render logs, may need more RAM (upgrade plan)

### CORS Errors
- **Symptom**: Frontend can't connect
- **Solution**: Ensure `FRONTEND_URL` environment variable is set correctly

### Timeout on First Request
- **Symptom**: Request takes 60+ seconds
- **Solution**: This is normal on free tier (cold start). Subsequent requests are fast.

### Out of Memory
- **Symptom**: Service crashes during startup
- **Solution**: The model is large (~2GB). Free tier has limited RAM. Consider:
  - Upgrading to Starter plan
  - Using a lighter model
  - Optimizing model loading

## Monitoring

Monitor your deployment:
- **Logs**: Dashboard → Logs tab
- **Metrics**: Dashboard → Metrics tab
- **Events**: Dashboard → Events tab

## Updating Your Deployment

Render automatically deploys when you push to your GitHub repository:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically:
1. Detect the push
2. Run build command
3. Deploy new version
4. Zero-downtime deployment

## Custom Domain (Optional)

1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records:
   ```
   Type: CNAME
   Name: api (or your subdomain)
   Value: your-app.onrender.com
   ```

## Support

- Render Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com
