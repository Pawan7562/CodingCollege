# Quick Setup Guide - Fix Deployment Error

## 🚨 Current Issue
Your app is deployed at https://codingcollege.onrender.com but database connection is failing.

## ⚡ Immediate Fix (5 minutes)

### Step 1: Generate JWT Secrets
Run these commands to generate secure secrets:

```bash
# Generate JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate Refresh Secret  
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Get MongoDB URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Select your database cluster
3. Click "Connect" → "Drivers" 
4. Copy the full connection string
5. Replace `<username>` and `<password>` with your actual credentials

### Step 3: Set Environment Variables in Render

Go to: https://dashboard.render.com → codingcollege → Environment

Add these variables:

```bash
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/college
JWT_SECRET=paste-generated-secret-here
JWT_REFRESH_SECRET=paste-generated-refresh-secret-here
NODE_ENV=production
```

### Step 4: Redeploy
Click "Manual Deploy" in Render dashboard

## 🧪 Test After Setup

Once deployed, test:
```bash
curl https://codingcollege.onrender.com/api/auth/register
curl https://codingcollege.onrender.com/api/auth/login
```

## 📱 Expected Result

You should see:
```
Server is running on port 5000
MongoDB Connected
```

Instead of:
```
MongoDB Connection Error: MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

## 🔧 Alternative: Use MongoDB Atlas Free Tier

If you don't have MongoDB:
1. Create free account at https://www.mongodb.com/atlas
2. Create free cluster (M0 Sandbox)
3. Create database user
4. Get connection string
5. Add to Render environment variables

This will give you 512MB free - perfect for testing!
