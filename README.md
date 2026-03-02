# VibeMap CDN — Social Map cho Sinh Viên CDN Ninh Thuận

## Chạy project

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

---

## Cấu hình Firebase

1. Tạo project tại [console.firebase.google.com](https://console.firebase.google.com)
2. Bật **Authentication → Google** provider
3. Tạo **Firestore database** (mode production)
4. Copy config vào `lib/firebase.ts`

### Deploy Firestore Rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules,firestore:indexes
```

### Tạo Cloudinary account (upload ảnh)

1. Đăng ký tại [cloudinary.com](https://cloudinary.com) (free tier ok)
2. Tạo **unsigned upload preset** tên `vibemap_avatars`
3. Điền cloud name vào `lib/uploadToCloudinary.ts`

---

## Kiến trúc Backend (Firestore)

```
/users/{uid}              → UserProfile (realtime markers)
/connections/{a_b}        → Connection (pending/accepted)
/signals/{id}             → Signal (coffee, study, chill…)
/chats/{threadId}         → ChatThread metadata + unread counts
/chats/{threadId}/messages/{id} → Message
/groups/{id}              → Group (CDN nhóm học, CLB…)
/posts/{id}               → CDN posts (tin tức, sự kiện)
/members/{uid}            → CDN member profile
```

### Security Rules

File `firestore.rules` đã bao gồm đầy đủ:
- Users: đọc public, ghi chỉ owner
- Connections: chỉ participants
- Signals: authenticated read, owner write/delete
- Chats/Messages: chỉ participants
- Groups: public read, creator manage

### Indexes cần tạo

Xem `firestore.indexes.json` hoặc deploy tự động:
```bash
firebase deploy --only firestore:indexes
```

---

## UX Flows hoàn chỉnh

1. **Onboarding** → Chọn lĩnh vực → Mood → Bản đồ
2. **Map** → Tap avatar → UserCard → Nhắn tin hoặc Kết nối (lưu DB)
3. **Match tab** → Filter → Xem scored list → Chat inline
4. **Signal** → Chọn loại → Thời hạn → Phát lên Firestore realtime
5. **Groups** → Xem nhóm → Tham gia → Tạo mới (lưu DB)
6. **Profile** → Đăng nhập Google → Chỉnh profile → GPS location → Sync

---

## Stack

- **Next.js 15** + TypeScript
- **React Leaflet** — maps
- **Firebase** — Auth + Firestore (realtime)
- **Zustand** — global state + persist
- **Framer Motion** — animations
- **Tailwind CSS** — styling
- **Plus Jakarta Sans** — font (supports Vietnamese)
- **Lucide React** — icons

---

## Deploy lên Vercel

### 1. Đơn giản nhất - GitHub + Vercel
```bash
# Push code lên GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

Sau đó vào [vercel.com](https://vercel.com):
1. Click "New Project"
2. Import repo từ GitHub
3. Configure environment variables
4. Click "Deploy"

### 2. Dùng Vercel CLI
```bash
npm install -g vercel
vercel
```

### 3. Environment Variables trên Vercel
Trong **Settings → Environment Variables**, thêm:
- `NEXT_PUBLIC_FIREBASE_API_KEY` (và các Firebase config khác)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (nếu dùng upload)

**Tất cả Firebase keys đã sẵn trong `lib/firebase.ts`** ✅

---

## Tính năng chính ✅

✅ **Map interaktif** — Hiển thị sinh viên trên bản đồ Ninh Thuận  
✅ **User profiles** — Persona (fun/study ratio), mood, interests  
✅ **Real-time Chat** — Instantly tin nhắn giữa users  
✅ **Connections** — Kết nối/Follow users  
✅ **Signals** — Broadcasting status (coffee, study, chill)  
✅ **Study Groups** — Tạo/Tham gia nhóm học  
✅ **College Details** — News, events, timetable, beauty contest  
✅ **Matching** — AI-like scoring dựa vào interests  
✅ **Responsive** — Mobile-first design ✨  

---

## Troubleshooting Build

Nếu gặp lỗi TypeScript khi build:
```bash
# Xóa cache
rm -rf .next node_modules package-lock.json

# Cài lại
npm install

# Build
npm run build
```

Nếu lỗi persists:
- Check `tsconfig.json` valid
- Check imports không có typo
- Run `npm run lint` để catch lỗi sớm

---

**Status:** 🚀 Ready for Production  
**Last Updated:** March 2, 2026
