/**
 * scripts/seed.ts
 * Seed Firestore với dữ liệu mẫu theo kiến trúc types/user.ts
 * Chạy: npx ts-node --project tsconfig.json scripts/seed.ts
 * (hoặc dùng trong browser console nếu chạy dev mode)
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArbTjxUt20KNI1mKLS5sBOhFKxB0pLbUs",
  authDomain: "sinhviennet-fc858.firebaseapp.com",
  projectId: "sinhviennet-fc858",
  storageBucket: "sinhviennet-fc858.firebasestorage.app",
  messagingSenderId: "322852182802",
  appId: "1:322852182802:web:cdae1e0a267a23dcbcb1cb",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// CDN Ninh Thuận coordinate range
const CDN_CENTER = { lat: 11.563022, lng: 109.013219 };

function randCoord(center: { lat: number; lng: number }, radiusKm = 2): [number, number] {
  const r = radiusKm / 111;
  return [
    center.lat + (Math.random() - 0.5) * 2 * r,
    center.lng + (Math.random() - 0.5) * 2 * r,
  ];
}

const SEED_USERS = [
  {
    id: "seed_01",
    name: "Nguyễn Minh Châu",
    avatar: "https://i.pravatar.cc/150?u=seed01",
    bio: "CNTT K2 | Code ban ngày, guitar ban đêm 🎸",
    location: [11.5645, 109.0148],
    categories: ["music", "startup", "game"],
    interests: [
      { id: "i_react", label: "React / Next.js", category: "startup" },
      { id: "i_guitar", label: "Acoustic Guitar", category: "music" },
      { id: "i_valorant", label: "Valorant", category: "game" },
    ],
    customTags: ["dev", "acoustic", "cdnninhthuan"],
    currentMood: "💡 Đang code project cuối kỳ",
    socialLinks: { instagram: "minchau.dev", tiktok: "minhchaucdn" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() - 3600000,
  },
  {
    id: "seed_02",
    name: "Trần Thu Hà",
    avatar: "https://i.pravatar.cc/150?u=seed02",
    bio: "Tiếng Anh K3 | IELTS 7.0 | Yêu đọc sách & du lịch 📚",
    location: [11.5620, 109.0125],
    categories: ["language", "book", "film"],
    interests: [
      { id: "i_ielts", label: "IELTS Preparation", category: "language" },
      { id: "i_novel", label: "Tiểu thuyết", category: "book" },
      { id: "i_kdrama", label: "K-Drama", category: "film" },
    ],
    customTags: ["english", "reader", "cdnninhthuan"],
    currentMood: "☕ Chill ở thư viện",
    socialLinks: { instagram: "thuha.reads", facebook: "https://fb.com/thuha.cdn" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 25, updatedAt: Date.now() - 7200000,
  },
  {
    id: "seed_03",
    name: "Lê Quang Bùi",
    avatar: "https://i.pravatar.cc/150?u=seed03",
    bio: "Điện tử K2 | Arduino nerd | Bóng đá cuối tuần ⚽",
    location: [11.5670, 109.0160],
    categories: ["startup", "game", "music"],
    interests: [
      { id: "i_arduino", label: "Arduino / IoT", category: "startup" },
      { id: "i_fifa", label: "FIFA Mobile", category: "game" },
      { id: "i_edm", label: "EDM / House", category: "music" },
    ],
    customTags: ["electronics", "football", "iot"],
    currentMood: "⚡ Đang làm mạch",
    socialLinks: { tiktok: "quangbui.diy" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() - 1800000,
  },
  {
    id: "seed_04",
    name: "Phạm Lan Phương",
    avatar: "https://i.pravatar.cc/150?u=seed04",
    bio: "Du lịch - Khách sạn K1 | Yêu bếp núc & phim ảnh 🎬",
    location: [11.5605, 109.0110],
    categories: ["film", "book", "dating"],
    interests: [
      { id: "i_cooking", label: "Nấu ăn", category: "film" },
      { id: "i_marvel", label: "Marvel Films", category: "film" },
      { id: "i_poetry", label: "Thơ ca", category: "book" },
    ],
    customTags: ["tourism", "cooking", "cinephile"],
    currentMood: "🎉 Vui vẻ",
    socialLinks: { instagram: "lanphuong.travel", youtube: "https://youtube.com/@lanphuong" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 15, updatedAt: Date.now() - 5400000,
  },
  {
    id: "seed_05",
    name: "Hoàng Đức Anh",
    avatar: "https://i.pravatar.cc/150?u=seed05",
    bio: "Ô tô K3 | Gamer hardcore | Coffee addict ☕",
    location: [11.5655, 109.0135],
    categories: ["game", "startup", "music"],
    interests: [
      { id: "i_lol", label: "League of Legends", category: "game" },
      { id: "i_3dprint", label: "3D Printing", category: "startup" },
      { id: "i_lofi", label: "Lo-fi / Chill Beats", category: "music" },
    ],
    customTags: ["gamer", "auto", "cdnninhthuan"],
    currentMood: "🎮 Đang rank",
    socialLinks: { tiktok: "ducanh.auto", instagram: "ducanh_gamer" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 900000,
  },
  {
    id: "seed_06",
    name: "Ngô Thị Mai Linh",
    avatar: "https://i.pravatar.cc/150?u=seed06",
    bio: "CNTT K1 | UI/UX Design | Vẽ tranh & anime 🎨",
    location: [11.5630, 109.0150],
    categories: ["film", "startup", "book"],
    interests: [
      { id: "i_figma", label: "Figma / UI Design", category: "startup" },
      { id: "i_anime", label: "Anime", category: "film" },
      { id: "i_manga", label: "Manga", category: "book" },
    ],
    customTags: ["designer", "anime", "uiux"],
    currentMood: "🌿 Bình tĩnh",
    socialLinks: { instagram: "mailinhart", tiktok: "mlinhart" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 8, updatedAt: Date.now() - 2700000,
  },
  {
    id: "seed_07",
    name: "Võ Thanh Tùng",
    avatar: "https://i.pravatar.cc/150?u=seed07",
    bio: "Cơ khí K2 | Đam mê khởi nghiệp | Podcast fan 🚀",
    location: [11.5615, 109.0165],
    categories: ["startup", "work", "language"],
    interests: [
      { id: "i_business", label: "Business / Startup", category: "startup" },
      { id: "i_podcast", label: "Podcast", category: "work" },
      { id: "i_english", label: "Business English", category: "language" },
    ],
    customTags: ["startup", "entrepreneur", "cdnninhthuan"],
    currentMood: "🎯 Tập trung",
    socialLinks: { facebook: "https://fb.com/thanhtung.startup", instagram: "thanhtung_cdn" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 600000,
  },
  {
    id: "seed_08",
    name: "Bùi Thị Kim Ngân",
    avatar: "https://i.pravatar.cc/150?u=seed08",
    bio: "Tiếng Anh K2 | Ghiền K-pop & K-drama 💜 | Tìm bạn học cùng",
    location: [11.5640, 109.0120],
    categories: ["music", "film", "dating"],
    interests: [
      { id: "i_kpop", label: "K-Pop", category: "music" },
      { id: "i_kdrama2", label: "Korean Drama", category: "film" },
      { id: "i_cafe", label: "Cà phê chill", category: "dating" },
    ],
    customTags: ["kpop", "kdrama", "cdn"],
    currentMood: "🤝 Tìm bạn mới",
    socialLinks: { instagram: "kimhgan.kr", tiktok: "kimhgan_cdn" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 300000,
  },
  {
    id: "seed_09",
    name: "Đinh Văn Khoa",
    avatar: "https://i.pravatar.cc/150?u=seed09",
    bio: "CNTT K3 | Backend dev | Thích đọc về AI & ML 🤖",
    location: [11.5660, 109.0155],
    categories: ["startup", "book", "work"],
    interests: [
      { id: "i_ai", label: "AI / Machine Learning", category: "startup" },
      { id: "i_python", label: "Python", category: "startup" },
      { id: "i_techbook", label: "Tech Books", category: "book" },
    ],
    customTags: ["backend", "ai", "ml", "cdnninhthuan"],
    currentMood: "🌙 Đêm muộn debug",
    socialLinks: { github: "dinhkhoa-dev" } as any,
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 120000,
  },
  {
    id: "seed_10",
    name: "Phan Thị Hồng Nhung",
    avatar: "https://i.pravatar.cc/150?u=seed10",
    bio: "Du lịch K2 | Photography | Yêu biển Ninh Thuận 🌊",
    location: [11.5598, 109.0130],
    categories: ["film", "music", "dating"],
    interests: [
      { id: "i_photo", label: "Photography", category: "film" },
      { id: "i_travel", label: "Du lịch", category: "dating" },
      { id: "i_indie", label: "Indie Music", category: "music" },
    ],
    customTags: ["photography", "travel", "ninhthuan"],
    currentMood: "🌊 Thư giãn",
    socialLinks: { instagram: "hongnhung.lens", tiktok: "nhunglens" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 1, updatedAt: Date.now() - 60000,
  },
];

async function seedUsers() {
  console.log("🌱 Seeding users...");
  for (const user of SEED_USERS) {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, {
      ...user,
      history: [],
    }, { merge: true });
    console.log(`  ✅ ${user.name}`);
  }
  console.log(`✅ Seeded ${SEED_USERS.length} users`);
}

async function seedPosts() {
  console.log("📝 Seeding posts...");
  const posts = [
    {
      author: "Ban Quản Trị CDN",
      authorAvatar: "/cdn.png",
      content: "🎉 Chào mừng tất cả sinh viên đến với mạng lưới CDN Social Map! Hãy cập nhật profile của bạn và kết nối với những bạn cùng vibe nhé!",
      likes: 142, comments: 56, likedBy: [],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      author: "Nguyễn Minh Châu",
      authorAvatar: "https://i.pravatar.cc/150?u=seed01",
      content: "💻 Tụi mình vừa hoàn thành project Web App quản lý sinh viên bằng Next.js + Firebase! Ai muốn contribute thì dm nha. #cdndev #nextjs",
      image: "https://picsum.photos/seed/code1/800/500",
      likes: 89, comments: 23, likedBy: [],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      author: "Trần Thu Hà",
      authorAvatar: "https://i.pravatar.cc/150?u=seed02",
      content: "📚 Tips ôn IELTS cho tụi mình trường CDN: Mỗi ngày đọc 1 bài BBC, nghe podcast 30 phút. Nhóm luyện thi của tụi mình gặp mỗi tối thứ 3 & 5 nhé!",
      likes: 167, comments: 41, likedBy: [],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];
  for (const post of posts) {
    await addDoc(collection(db, "posts"), post);
  }
  console.log(`✅ Seeded ${posts.length} posts`);
}

async function main() {
  try {
    await seedUsers();
    await seedPosts();
    console.log("\n🚀 Seed completed successfully!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
}

main();
