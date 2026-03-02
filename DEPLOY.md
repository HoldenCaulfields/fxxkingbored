# Deployment Guide - SinhVienNet (VibeMap CDN)

## Quick Start - Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel (Easy Way!)

### Option 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Link to existing project
vercel link
vercel
```

### Option 2: Using GitHub
1. Push your code to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo
5. Configure environment variables (see below)
6. Click "Deploy"

## Environment Variables

Create a `.env.local` file or configure on Vercel:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyArbTjxUt20KNI1mKLS5sBOhFKxB0pLbUs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sinhviennet-fc858.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sinhviennet-fc858
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sinhviennet-fc858.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=322852182802
NEXT_PUBLIC_FIREBASE_APP_ID=1:322852182802:web:cdae1e0a267a23dcbcb1cb

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Vercel Dashboard

After deployment, you can:
1. View logs: Logs → Runtime Logs
2. Monitor performance: Analytics
3. Configure custom domain: Settings → Domains
4. Set environment variables: Settings → Environment Variables

## Build & Performance Tips

✅ **Automatic Optimizations on Vercel:**
- Automatic code splitting
- Image optimization
- Edge caching
- Serverless functions

✅ **Best Practices Implemented:**
- TypeScript for type safety
- Next.js Image optimization
- CSS modules with Tailwind
- Dynamic imports for heavy components

## Troubleshooting

### Build fails on Vercel but works locally
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`
- Check environment variables are set

### Firebase connection issues
- Verify API keys in environment variables
- Check Firestore security rules: `firebase deploy --only firestore:rules`
- Check browser console for CORS errors

### Slow performance
- Check Analytics tab for bottlenecks
- Use Lighthouse: DevTools → Lighthouse
- Monitor real-time performance: Vercel → Analytics

## Database & Firestore Rules

### Deploy Firestore Rules
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes
```

### Current Firestore Structure
```
/users/{uid}              → User profiles (realtime)
/connections/{a_b}        → Connections between users
/signals/{id}             → User signals (coffee, study, etc)
/chats/{threadId}         → Chat threads
/chats/{threadId}/messages → Individual messages
/groups/{id}              → Study groups
/posts/{id}               → CDN posts
/members/{uid}            → CDN member profiles
```

## Production Checklist

- [ ] Environment variables configured on Vercel
- [ ] Firebase Rules deployed: `firebase deploy --only firestore:rules`
- [ ] Cloudinary upload preset created
- [ ] Custom domain connected (optional)
- [ ] Google OAuth redirect URI updated
- [ ] Tested all features on production
- [ ] Monitored performance analytics

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Status:** ✅ Ready for production  
**Last Updated:** 2026-03-02  
**Team:** HoldenCaulfields/fxxkingbored
