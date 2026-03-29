# Render Deployment Fix - Environment Variables Issue

## Problem Identified
The deployment is failing because `MONGODB_URI` environment variable is not set on Render platform.

## Error Message
```
MongoDB Connection Error: MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

## Solution Required

### Step 1: Set Environment Variables in Render Dashboard

Go to your Render dashboard and set these environment variables:

#### Required Variables:
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/college
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-min-32-chars
NODE_ENV=production
```

#### Optional Variables:
```
FRONTEND_URL=https://your-app-name.onrender.com
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Step 2: MongoDB Setup

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/atlas
2. **Create Database**: Name it `college` or similar
3. **Create Database User**: 
   - Username: (create a new user)
   - Password: (generate a strong password)
4. **Get Connection String**: 
   - Go to Database → Connect → Drivers
   - Copy MongoDB URI (include username/password)
5. **Add to Render**: Paste the full URI in Render environment variables

### Step 3: JWT Secret Generation

Generate strong secrets for JWT:
```bash
# Generate JWT secrets (run these commands)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use different outputs for:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

### Step 4: Redeploy

After setting environment variables:
1. Go to Render dashboard
2. Click "Manual Deploy" or push a small change to trigger redeploy
3. Monitor the deployment logs

## Quick Fix Commands

If you have the environment variables ready, you can test locally:

```bash
# Create .env file
cp backend/.env.example backend/.env

# Edit the file with your actual values
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=your-secret-key
# JWT_REFRESH_SECRET=your-refresh-secret

# Test database connection
cd backend && node test-db.js
```

## Verification

Once deployed successfully, you should see:
```
Server is running on port 5000
MongoDB Connected
```

And your API will be available at:
```
https://your-app-name.onrender.com/api/auth/register
https://your-app-name.onrender.com/api/auth/login
https://your-app-name.onrender.com/api/auth/me
```

## Common Issues

1. **MongoDB Network Access**: Make sure your IP is whitelisted in MongoDB Atlas
2. **URI Format**: Ensure the URI includes `mongodb+srv://` not `mongodb://`
3. **Special Characters**: Escape special characters in environment variables
4. **Render Restart**: Sometimes need to restart the service after adding env vars

## Support

- Render Docs: https://render.com/docs/environment-variables
- MongoDB Atlas: https://www.mongodb.com/atlas
- Your App URL: https://codingcollege.onrender.com
