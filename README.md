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

