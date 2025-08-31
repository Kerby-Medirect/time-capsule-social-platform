# 🚀 Vercel Auto-Deployment Setup Guide

## Overview
This guide will help you set up automatic deployment to Vercel that triggers whenever you push changes to your GitHub repository.

## Prerequisites
- ✅ GitHub repository with your code (already done!)
- ✅ MongoDB Atlas database (already configured!)
- 🔄 Vercel account (we'll set this up)

## Step 1: Create Vercel Account & Connect GitHub

### 1.1 Sign Up for Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** for seamless integration
4. Authorize Vercel to access your GitHub account

### 1.2 Import Your Repository
1. After signing in, click **"Add New Project"**
2. Find your repository: `time-capsule-social-platform`
3. Click **"Import"**

## Step 2: Configure Environment Variables

### 2.1 Production Environment Variables
In Vercel dashboard, go to your project → **Settings** → **Environment Variables**

Add these variables:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/time-capsule-social?retryWrites=true&w=majority

# Authentication Secrets (Generate new ones for production!)
JWT_SECRET=your-production-jwt-secret-64-chars-long
NEXTAUTH_SECRET=your-production-nextauth-secret-64-chars-long

# Application Configuration
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### 2.2 Generate Secure Production Secrets
Run these commands to generate secure secrets:

```bash
# Generate JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate NextAuth Secret  
node -e "console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Configure Vercel Project Settings

### 3.1 Build Settings (Usually Auto-Detected)
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 3.2 Node.js Version
- Set Node.js version to `18.x` or `20.x` in Vercel settings

## Step 4: Create Vercel Configuration File

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Step 5: Automatic Deployment Workflow

### How It Works
1. **Code Changes**: You make changes locally
2. **Git Commit**: `git add . && git commit -m "Your changes"`
3. **Git Push**: `git push origin main`
4. **Auto Deploy**: Vercel automatically detects the push and deploys
5. **Live Update**: Your site updates automatically!

### Deployment Triggers
- ✅ **Push to main branch** → Production deployment
- ✅ **Push to other branches** → Preview deployments
- ✅ **Pull requests** → Preview deployments with unique URLs

## Step 6: Production Database Setup

### 6.1 MongoDB Atlas Production Configuration
1. **Create Production Cluster** (or use existing)
2. **Add Vercel IPs to Whitelist**:
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allow all) or specific Vercel IPs
3. **Create Production Database User**
4. **Update Connection String** in Vercel environment variables

### 6.2 Database Seeding for Production
You may want to seed your production database:

```bash
# Option 1: Run seed script with production environment
MONGODB_URI="your-production-uri" npm run seed

# Option 2: Create a one-time deployment endpoint
# Add this to your production app temporarily
```

## Step 7: Domain Configuration (Optional)

### 7.1 Custom Domain
1. In Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain (e.g., `timecapsule.yoursite.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable

### 7.2 SSL Certificate
- Vercel automatically provides SSL certificates
- Your site will be available over HTTPS

## Step 8: Monitoring & Logs

### 8.1 Deployment Logs
- View real-time deployment logs in Vercel dashboard
- Check for build errors or warnings

### 8.2 Runtime Logs
- Monitor API errors and performance
- Set up alerts for production issues

## Example Workflow

```bash
# 1. Make changes locally
git add .
git commit -m "✨ Add new nostalgic feature"

# 2. Push to GitHub
git push origin main

# 3. Vercel automatically:
#    - Detects the push
#    - Builds your app
#    - Deploys to production
#    - Updates your live site

# 4. Your site is now live with new changes!
```

## Branch Strategy

### Production Branch: `main`
- Deploys to: `https://your-app.vercel.app`
- Triggered by: Pushes to `main` branch

### Feature Branches: `feature/*`
```bash
# Create feature branch
git checkout -b feature/new-decade-filter

# Make changes and push
git push origin feature/new-decade-filter
# → Creates preview deployment with unique URL
```

### Preview Deployments
- Every branch gets its own preview URL
- Perfect for testing before merging to main
- Share preview links with team for review

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables**
   - Double-check all required variables are set
   - Verify MongoDB connection string format
   - Ensure secrets are properly generated

3. **API Routes Failing**
   - Check function timeout settings
   - Verify database connectivity from Vercel
   - Review API route logs

### Debug Commands
```bash
# Test build locally
npm run build

# Test production mode locally
npm run start

# Check environment variables
vercel env ls
```

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use different secrets for development/production
   - Rotate secrets regularly

2. **Database Security**
   - Use restricted IP access when possible
   - Create dedicated production database users
   - Monitor database access logs

3. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS in production

## Cost Considerations

### Vercel Pricing
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for production apps
- **Enterprise**: Custom pricing

### Usage Limits
- **Function Execution**: 100GB-hours (Hobby), 1000GB-hours (Pro)
- **Bandwidth**: 100GB (Hobby), 1TB (Pro)
- **Build Minutes**: Usually sufficient for most projects

## Demo Application URLs

After deployment, your app will be available at:
- **Production**: `https://time-capsule-social-platform.vercel.app`
- **Custom Domain**: `https://your-custom-domain.com` (if configured)

### Demo Credentials (Keep These!)
- Email: `demo@example.com` | Password: `demo123`
- Email: `nostalgia@example.com` | Password: `90skid`

## Next Steps After Deployment

1. **Test Production Site**
   - Verify all features work
   - Test login/registration
   - Check nostalgic posts display

2. **Monitor Performance**
   - Check Vercel analytics
   - Monitor API response times
   - Watch for errors

3. **Share Your Site**
   - Your nostalgic social platform is now live!
   - Share with friends and family
   - Collect feedback for improvements

## Continuous Development

### Recommended Workflow
```bash
# Daily development
git pull origin main          # Get latest changes
# Make your changes
git add .
git commit -m "Your changes"
git push origin main          # Auto-deploys to production!
```

Your Time Capsule Social Platform will now automatically update every time you push to GitHub! 🎉
