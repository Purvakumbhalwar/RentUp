# How to deploy this project

## Upload to GitHub

```bash
# Setup git
git init
git add .
git commit -m "My PG finder project"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

## Vercel Deployment

### 1. Environment Variables Setup
In Vercel dashboard, add these environment variables:

**Backend Variables:**
```
MONGO=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-key
```

**Frontend Variables:**
```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Deploy to Vercel

**Option 1: Vercel CLI**
```bash
npm i -g vercel
vercel --prod
```

**Option 2: GitHub Integration**
1. Go to vercel.com → Import Project
2. Connect your GitHub repository
3. Vercel will auto-detect the configuration
4. Add environment variables
5. Deploy

### 3. Domain Setup
- Vercel provides a free `.vercel.app` domain
- You can add a custom domain in Vercel settings
- SSL is automatically configured

## Project Structure for Deployment

```
mern-estate/
├── api/                 # Backend (deployed as Vercel Functions)
├── client/              # Frontend (static build)
├── vercel.json         # Vercel configuration
├── package.json        # Root dependencies
└── .gitignore          # Excludes .env and node_modules
```

## Important Notes

1. **Environment Files**: `.env` files are ignored by Git (already in .gitignore)
2. **Documentation**: Technical docs are excluded from repository
3. **Database**: Ensure MongoDB Atlas allows connections from `0.0.0.0/0` for Vercel
4. **CORS**: Backend should allow your Vercel domain
5. **Firebase**: Update Firebase project settings to include your domain

## Troubleshooting

### Build Issues
- Ensure all dependencies are in `package.json`
- Check environment variables are correctly set
- Verify Firebase configuration

### API Issues  
- Check MongoDB connection string
- Ensure JWT secret is set
- Verify API routes are accessible

### Frontend Issues
- Check Vite build configuration
- Ensure all React components are properly imported
- Verify environment variables have `VITE_` prefix
