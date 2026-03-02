/**
 * utils/seedFirestore.ts
 * Seed Firestore với 10 sinh viên CDN mẫu theo UserProfile schema.
 * Gọi từ browser console hoặc admin page:
 *   import { seedAll } from "@/utils/seedFirestore"; seedAll();
 */
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

const SEED_USERS: UserProfile[] = [
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
    history: [],
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
    history: [],
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
    history: [],
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
    history: [],
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
    history: [],
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
    history: [],
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
    history: [],
    currentMood: "🎯 Tập trung",
    socialLinks: { facebook: "https://fb.com/thanhtung.startup", instagram: "thanhtung_cdn" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 600000,
  },
  {
    id: "seed_08",
    name: "Bùi Thị Kim Ngân",
    avatar: "https://i.pravatar.cc/150?u=seed08",
    bio: "Tiếng Anh K2 | K-pop & K-drama 💜 | Tìm bạn học cùng",
    location: [11.5640, 109.0120],
    categories: ["music", "film", "dating"],
    interests: [
      { id: "i_kpop", label: "K-Pop", category: "music" },
      { id: "i_kdrama2", label: "Korean Drama", category: "film" },
      { id: "i_cafe", label: "Cà phê chill", category: "dating" },
    ],
    customTags: ["kpop", "kdrama", "cdn"],
    history: [],
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
    history: [],
    currentMood: "🌙 Đêm muộn debug",
    socialLinks: { instagram: "dinhkhoa.tech" },
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
    history: [],
    currentMood: "🌊 Thư giãn",
    socialLinks: { instagram: "hongnhung.lens", tiktok: "nhunglens" },
    isPinned: false, isVisible: true, isAnonymous: false,
    createdAt: Date.now() - 86400000 * 1, updatedAt: Date.now() - 60000,
  },
];

export async function seedUsers(): Promise<void> {
  for (const user of SEED_USERS) {
    const ref = doc(db, "users", user.id);
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, user);
      console.log(`✅ Seeded: ${user.name}`);
    }
  }
}

export async function seedAll(): Promise<void> {
  console.log("🌱 Starting seed...");
  await seedUsers();
  console.log("🚀 Seed complete!");
}

/** Gọi auto-seed khi không có user nào trong Firestore */
export async function autoSeedIfEmpty(): Promise<void> {
  try {
    const firstRef = doc(db, "users", "seed_01");
    const snap = await getDoc(firstRef);
    if (!snap.exists()) {
      console.log("📦 Auto-seeding Firestore with demo users...");
      await seedAll();
    }
  } catch (e) {
    console.warn("autoSeedIfEmpty error:", e);
  }
}
