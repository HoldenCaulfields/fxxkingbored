import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Icons (using inline SVG for zero-dependency) ──────────────
const Icon = {
  ArrowLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
  ),
  Bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
  ),
  Heart: ({ filled }: { filled?: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#f43f5e" : "none"} stroke={filled ? "#f43f5e" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  ),
  MessageSquare: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Share: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Camera: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
  ),
  Users: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Trophy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 6 2 6 2 12a5 5 0 0 0 5 5h0"/><polyline points="16 6 22 6 22 12a5 5 0 0 1-5 5h0"/><path d="M12 2v13"/><path d="M7 21h10"/><path d="M12 15v6"/></svg>
  ),
  Star: ({ filled }: { filled?: boolean }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke={filled ? "#f59e0b" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Crown: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
  ),
  MapPin: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Clock: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Send: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  Newspaper: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2z"/><path d="M2 6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"/><line x1="12" y1="6" x2="18" y2="6"/><line x1="12" y1="10" x2="18" y2="10"/><line x1="12" y1="14" x2="18" y2="14"/><line x1="8" y1="6" x2="8" y2="6"/></svg>
  ),
  GraduationCap: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Lock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  UserPlus: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
  ),
  Sparkles: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  ),
  BookOpen: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.88 9.63 19.79 19.79 0 0 1 1.79 1 2 2 0 0 1 3.78.01h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l1.36-.74a2 2 0 0 1 2.11.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  Globe: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Image: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  ),
  Bookmark: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
  ),
  Tag: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  ),
  Award: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  Eye: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Mail: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
};

// ── Mock Data ─────────────────────────────────────────────────
const COLLEGE = {
  id: "cdn-ninh-thuan",
  name: "Cao Đẳng Nghề Ninh Thuận",
  shortName: "CDN Ninh Thuận",
  bio: "Đào tạo nghề chất lượng cao • Tương lai vững chắc",
  address: "123 Thống Nhất, TP. Phan Rang – Tháp Chàm, Ninh Thuận",
  phone: "0259 3822 xxx",
  website: "cdnninhthuan.edu.vn",
  avatar: "https://i.pravatar.cc/150?img=68",
  cover: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  stats: { members: 2400, posts: 1200, groups: 38, teachers: 120 },
  departments: ["Điện – Điện tử", "Công nghệ thông tin", "Ô tô", "Du lịch", "Tiếng Anh", "Cơ khí"],
};

const MOCK_POSTS = [
  { id: "p1", author: "Nguyễn Minh Tuấn", authorAvatar: "https://i.pravatar.cc/80?img=11", content: "Hôm nay workshop thực hành mạch điện thật sự rất hay! Cảm ơn thầy Hùng đã chỉ dẫn tận tình 🔌⚡", likes: 48, comments: 12, createdAt: new Date(Date.now() - 3600000).toISOString(), tags: ["thực hành", "điện tử"], likedBy: [] },
  { id: "p2", author: "Trần Thị Hồng Nhung", authorAvatar: "https://i.pravatar.cc/80?img=5", content: "Mùa hè đẹp quá trời ơi! Sau buổi học nhóm tiếng Anh, mọi người ra ngoài chụp ảnh kỷ niệm 🌺🌊", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", likes: 123, comments: 31, createdAt: new Date(Date.now() - 7200000).toISOString(), tags: ["tiếng anh", "kỷ niệm"], likedBy: [] },
  { id: "p3", author: "Lê Văn Khoa", authorAvatar: "https://i.pravatar.cc/80?img=33", content: "Kết quả thi lập trình Web vừa ra 🎉 Chúc mừng các bạn đã đỗ! Cố lên những bạn chưa qua, còn một lần nữa nhé!", likes: 89, comments: 27, createdAt: new Date(Date.now() - 14400000).toISOString(), tags: ["lập trình", "web"], likedBy: [] },
  { id: "p4", author: "Phạm Thu Hà", authorAvatar: "https://i.pravatar.cc/80?img=47", content: "Nhóm du lịch vừa hoàn thành bài tiểu luận về phát triển du lịch cộng đồng tại Ninh Thuận 🌴 Thật tự hào khi được học ở đây!", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80", likes: 204, comments: 45, createdAt: new Date(Date.now() - 86400000).toISOString(), tags: ["du lịch", "nghiên cứu"], likedBy: [] },
];

const MOCK_STORIES = [
  { id: "s1", studentName: "Minh Tuấn", avatar: "https://i.pravatar.cc/150?img=11", content: "Workshop điện hôm nay 🔌", image: "https://images.unsplash.com/photo-1581092160562-40aa08e12394?w=400&q=80" },
  { id: "s2", studentName: "Hồng Nhung", avatar: "https://i.pravatar.cc/150?img=5", content: "Mùa hè tuyệt vời 🌊", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80" },
  { id: "s3", studentName: "Văn Khoa", avatar: "https://i.pravatar.cc/150?img=33", content: "Code mãi rồi 💻", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80" },
  { id: "s4", studentName: "Thu Hà", avatar: "https://i.pravatar.cc/150?img=47", content: "Du lịch CNH 🌴" },
  { id: "s5", studentName: "Hoàng Nam", avatar: "https://i.pravatar.cc/150?img=60", content: "Sửa xe xong 🚗" },
];

const MOCK_GROUPS = [
  { id: "g1", name: "CLB Tiếng Anh CDN", subject: "english", description: "Luyện nói, nghe và giao tiếp tiếng Anh thực tế. Học theo chủ đề, roleplay và thuyết trình.", members: 28, maxMembers: 35, schedule: "Thứ 3 & 5, 18:00-20:00", room: "P.205", leader: "Nguyễn Thị Lan", leaderAvatar: "https://i.pravatar.cc/80?img=9", isOpen: true, tags: ["speaking", "IELTS"] },
  { id: "g2", name: "Nhóm Lập Trình Web", subject: "it", description: "Cùng nhau học HTML, CSS, JavaScript, React. Làm project thực tế từ đầu.", members: 22, maxMembers: 25, schedule: "Thứ 2 & 4, 19:00-21:00", room: "Lab IT 1", leader: "Lê Văn Khoa", leaderAvatar: "https://i.pravatar.cc/80?img=33", isOpen: true, tags: ["React", "Frontend"] },
  { id: "g3", name: "CLB Sửa Chữa Ô tô", subject: "auto", description: "Thực hành chẩn đoán và sửa chữa động cơ. Học qua thực tế tại xưởng trường.", members: 18, maxMembers: 18, schedule: "Thứ 7, 07:30-11:30", room: "Xưởng Ô tô", leader: "Trần Văn Hùng", leaderAvatar: "https://i.pravatar.cc/80?img=53", isOpen: false, tags: ["engine", "diagnosis"] },
  { id: "g4", name: "Nhóm Điện Tử Nâng Cao", subject: "electronics", description: "PLC, Arduino, IoT cho kỹ thuật viên muốn nâng cao kỹ năng thực hành nghề điện.", members: 15, maxMembers: 20, schedule: "Thứ 6, 18:00-20:30", room: "Lab Điện", leader: "Võ Minh Đức", leaderAvatar: "https://i.pravatar.cc/80?img=70", isOpen: true, tags: ["Arduino", "IoT", "PLC"] },
  { id: "g5", name: "CLB Hướng Dẫn Du Lịch", subject: "tourism", description: "Thuyết minh, nghiệp vụ lễ tân, tổ chức tour. Thực hành tại các điểm du lịch Ninh Thuận.", members: 24, maxMembers: 30, schedule: "Thứ 4, 17:00-19:00", room: "P.301", leader: "Phạm Thu Hà", leaderAvatar: "https://i.pravatar.cc/80?img=47", isOpen: true, tags: ["hướng dẫn", "tour"] },
];

const MOCK_TIMETABLE = [
  { id: "t1", subject: "Lập trình Web", teacher: "Th.S Lê Văn Tuấn", room: "Lab IT 1", dayOfWeek: 2, startPeriod: 1, endPeriod: 3, class: "CĐ-CNTT22", color: "#6366f1", credits: 3 },
  { id: "t2", subject: "Tiếng Anh Chuyên Ngành", teacher: "Th.S Nguyễn Thị Mai", room: "P.204", dayOfWeek: 2, startPeriod: 4, endPeriod: 6, class: "CĐ-CNTT22", color: "#0ea5e9", credits: 2 },
  { id: "t3", subject: "Kỹ thuật số", teacher: "Th.S Phạm Quang Hùng", room: "Lab Điện 2", dayOfWeek: 3, startPeriod: 1, endPeriod: 3, class: "CĐ-ĐĐT22", color: "#f59e0b", credits: 3 },
  { id: "t4", subject: "Cơ sở dữ liệu", teacher: "TS. Trần Minh Châu", room: "P.301", dayOfWeek: 3, startPeriod: 7, endPeriod: 9, class: "CĐ-CNTT22", color: "#10b981", credits: 3 },
  { id: "t5", subject: "Mạng máy tính", teacher: "Th.S Võ Thành Long", room: "Lab IT 2", dayOfWeek: 4, startPeriod: 1, endPeriod: 3, class: "CĐ-CNTT22", color: "#ec4899", credits: 3 },
  { id: "t6", subject: "Thực hành điện", teacher: "Th.S Lê Đình Bảo", room: "Xưởng Điện", dayOfWeek: 4, startPeriod: 4, endPeriod: 6, class: "CĐ-ĐĐT22", color: "#f43f5e", credits: 4 },
  { id: "t7", subject: "Lập trình Python", teacher: "Th.S Nguyễn Tuấn Kiệt", room: "Lab IT 1", dayOfWeek: 5, startPeriod: 1, endPeriod: 3, class: "CĐ-CNTT22", color: "#8b5cf6", credits: 3 },
  { id: "t8", subject: "Kỹ năng mềm", teacher: "GV. Phan Thị Bích", room: "P.101", dayOfWeek: 5, startPeriod: 4, endPeriod: 5, class: "CĐ-CNTT22", color: "#64748b", credits: 1 },
  { id: "t9", subject: "Thực hành lắp ráp", teacher: "Th.S Trần Công Danh", room: "Xưởng Ô tô", dayOfWeek: 6, startPeriod: 1, endPeriod: 5, class: "CĐ-OTO22", color: "#ef4444", credits: 5 },
];

const MOCK_COMPETITIONS = [
  { id: "c1", title: "Olympic Tiếng Anh CDN 2024", description: "Cuộc thi tiếng Anh cấp trường với các phần thi nghe, nói, đọc, viết. Cơ hội nhận học bổng và phần thưởng hấp dẫn.", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80", status: "ongoing", category: "english", votes: 342, participants: 87, prize: "5.000.000đ", deadline: "2024-12-31" },
  { id: "c2", title: "Cuộc thi Sáng tạo Điện tử 2024", description: "Thiết kế và chế tạo mạch điện ứng dụng, robot mini. Dành cho sinh viên các ngành kỹ thuật.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", status: "ongoing", category: "electronics", votes: 218, participants: 45, prize: "10.000.000đ", deadline: "2025-01-15" },
  { id: "c3", title: "Ảnh Đẹp Học Đường 2024", description: "Thi ảnh chụp kỷ niệm cuộc sống sinh viên CDN. Mọi tác phẩm đều được triển lãm tại trường.", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80", status: "upcoming", category: "photo", votes: 0, participants: 0, prize: "3.000.000đ", deadline: "2025-02-01" },
  { id: "c4", title: "Hội Thi Tay Nghề Ô tô", description: "Kiểm tra và sửa chữa động cơ, chẩn đoán lỗi, thay thế linh kiện. Thi theo đội nhóm.", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", status: "ended", category: "other", votes: 567, participants: 62, prize: "Đã kết thúc" },
];

const MOCK_BEAUTY = [
  { id: "b1", name: "Nguyễn Thị Hương Giang", major: "Du lịch – Khách sạn", year: 2, avatar: "https://i.pravatar.cc/200?img=23", votes: 1243, bio: "Yêu thiên nhiên, thích khám phá văn hóa địa phương và ước mơ trở thành hướng dẫn viên quốc tế.", hobbies: ["Nhiếp ảnh", "Yoga", "Đọc sách"], achievement: "Á khôi trường THPT Phan Rang" },
  { id: "b2", name: "Trần Thị Mỹ Linh", major: "Công nghệ thông tin", year: 1, avatar: "https://i.pravatar.cc/200?img=41", votes: 987, bio: "Con gái IT nhưng không kém phần xinh đẹp và năng động. Đam mê lập trình và thiết kế đồ họa.", hobbies: ["Vẽ vời", "Gaming", "Code"], achievement: "Học sinh giỏi cấp tỉnh" },
  { id: "b3", name: "Phạm Ngọc Bảo Châu", major: "Tiếng Anh", year: 2, avatar: "https://i.pravatar.cc/200?img=16", votes: 756, bio: "Yêu tiếng Anh và muốn trở thành cầu nối văn hóa. Thích múa dân gian và các hoạt động cộng đồng.", hobbies: ["Múa", "Tiếng Anh", "Du lịch"], achievement: "Giải nhì Olympic Tiếng Anh 2023" },
  { id: "b4", name: "Đỗ Thị Kim Ngân", major: "Điện – Điện tử", year: 3, avatar: "https://i.pravatar.cc/200?img=29", votes: 521, bio: "Cô gái điện tử chứng minh rằng nghề kỹ thuật không có giới hạn về giới tính. Đam mê và kiên trì.", hobbies: ["Robots", "Âm nhạc", "Thể thao"], achievement: "Giải nhất cuộc thi Điện tử 2022" },
];

const MOCK_NEWS = [
  { id: "n1", title: "CDN Ninh Thuận ký kết hợp tác doanh nghiệp 2024", summary: "Trường vừa ký kết hợp tác đào tạo với 15 doanh nghiệp lớn trong và ngoài tỉnh, mở ra cơ hội thực tập và việc làm cho sinh viên.", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80", category: "Tin trường", publishedAt: new Date(Date.now() - 86400000).toISOString(), views: 1203, pinned: true },
  { id: "n2", title: "Học bổng toàn phần cho sinh viên xuất sắc học kỳ 1", summary: "Trường trao 25 suất học bổng toàn phần và 50 suất học bổng bán phần cho sinh viên có thành tích học tập và rèn luyện xuất sắc.", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80", category: "Học bổng", publishedAt: new Date(Date.now() - 172800000).toISOString(), views: 2456 },
  { id: "n3", title: "Khai giảng lớp tiếng Nhật N5 miễn phí", summary: "CLB Ngoại ngữ phối hợp với Trung tâm Nhật ngữ Sakura mở lớp học tiếng Nhật N5 hoàn toàn miễn phí cho sinh viên CDN.", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", category: "Đào tạo", publishedAt: new Date(Date.now() - 259200000).toISOString(), views: 891 },
];

const MOCK_EVENTS = [
  { id: "e1", title: "Ngày Hội Việc Làm CDN 2024", description: "Hơn 50 doanh nghiệp tuyển dụng trực tiếp. Cơ hội phỏng vấn và nhận việc ngay tại sự kiện.", date: "2024-12-20", time: "07:30", location: "Sân trường CDN", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80", category: "Việc làm", registeredCount: 312, maxParticipants: 500, fee: 0 },
  { id: "e2", title: "Workshop: Kỹ năng phỏng vấn xin việc", description: "Chia sẻ bí quyết vượt qua vòng phỏng vấn, cách viết CV ấn tượng và kỹ năng giao tiếp chuyên nghiệp.", date: "2024-12-15", time: "14:00", location: "Hội trường A", image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&q=80", category: "Kỹ năng", registeredCount: 89, maxParticipants: 120, fee: 0 },
  { id: "e3", title: "Hội Trại Cuối Năm CDN 2024", description: "Gala dinner, văn nghệ, trò chơi tập thể và đêm nhạc ngoài trời. Sự kiện lớn nhất năm của sinh viên CDN!", date: "2024-12-28", time: "17:00", location: "Bãi biển Ninh Chữ", image: "https://images.unsplash.com/photo-1501386761578-eaa54b02f7cf?w=600&q=80", category: "Sự kiện", registeredCount: 450, maxParticipants: 600, fee: 150000 },
];

const MOCK_FACULTY = [
  { id: "f1", name: "TS. Trần Minh Châu", title: "Trưởng khoa CNTT", avatar: "https://i.pravatar.cc/150?img=50", department: "Công nghệ thông tin", subjects: ["Cơ sở dữ liệu", "Lập trình hướng đối tượng"], email: "chauptm@cdnnt.edu.vn", rating: 4.9 },
  { id: "f2", name: "Th.S Nguyễn Thị Mai", title: "Giảng viên Tiếng Anh", avatar: "https://i.pravatar.cc/150?img=9", department: "Ngoại ngữ", subjects: ["Tiếng Anh chuyên ngành", "IELTS"], email: "maintn@cdnnt.edu.vn", rating: 4.8 },
  { id: "f3", name: "Th.S Phạm Quang Hùng", title: "Giảng viên Điện", avatar: "https://i.pravatar.cc/150?img=70", department: "Điện – Điện tử", subjects: ["Kỹ thuật số", "PLC"], email: "hungpq@cdnnt.edu.vn", rating: 4.7 },
  { id: "f4", name: "Th.S Lê Văn Tuấn", title: "Giảng viên CNTT", avatar: "https://i.pravatar.cc/150?img=60", department: "Công nghệ thông tin", subjects: ["Lập trình Web", "React"], email: "tuanlv@cdnnt.edu.vn", rating: 4.9 },
];

// ── Helpers ───────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  if (h < 24) return `${h} giờ trước`;
  return `${d} ngày trước`;
}

const PERIOD_TIMES: Record<number, string> = {
  1: "07:00", 2: "07:50", 3: "08:40", 4: "09:30",
  5: "10:20", 6: "11:10", 7: "13:00", 8: "13:50", 9: "14:40", 10: "15:30",
};
const DAY_LABELS = ["", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

// ── Sub Components ────────────────────────────────────────────

// Story Viewer
function StoryViewer({ story, onClose }: { story: any; onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 60);
    const timeout = setTimeout(onClose, 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[20000] bg-black flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="w-full max-w-sm h-full relative">
        <div className="absolute top-0 left-0 right-0 z-10 px-3 pt-4 pb-2">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-3">
            <motion.div className="h-full bg-white rounded-full" animate={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={story.avatar} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
              <div>
                <p className="text-white font-bold text-sm leading-none">{story.studentName}</p>
                <p className="text-white/60 text-xs mt-0.5">Vừa xong</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-white"><Icon.X /></button>
          </div>
        </div>
        {story.image ? (
          <img src={story.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f43f5e, #9333ea)" }}>
            <p className="text-white text-2xl font-black text-center px-8">{story.content}</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-sm font-medium">{story.content}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Feed Tab
function FeedTab() {
  const [posts, setPosts] = useState(MOCK_POSTS.map(p => ({ ...p })));
  const [stories] = useState(MOCK_STORIES);
  const [viewingStory, setViewingStory] = useState<any>(null);
  const [newPost, setNewPost] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const handleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes - 1 } : post)); }
      else { next.add(id); setPosts(p => p.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post)); }
      return next;
    });
  };

  return (
    <div>
      {/* Stories Row */}
      <div className="mb-5">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
          <button className="shrink-0 flex flex-col items-center gap-1.5">
            <div className="w-[62px] h-[62px] rounded-2xl border-2 border-dashed border-rose-300 flex items-center justify-center bg-rose-50 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center translate-x-0.5 translate-y-0.5">
                <Icon.Plus />
              </div>
              <img src="https://i.pravatar.cc/150?img=3" alt="" className="w-full h-full object-cover opacity-70" />
            </div>
            <span className="text-[10px] font-bold text-rose-500 leading-none">Đăng story</span>
          </button>
          {stories.map(story => (
            <button key={story.id} onClick={() => setViewingStory(story)} className="shrink-0 flex flex-col items-center gap-1.5 group">
              <div className="w-[62px] h-[62px] rounded-2xl overflow-hidden ring-2 ring-rose-500 ring-offset-2 transition-transform group-hover:scale-105">
                <img src={story.image || story.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-semibold text-slate-600 w-16 truncate text-center leading-none">{story.studentName.split(' ').pop()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Box */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5 overflow-hidden">
        <div className="p-4 flex gap-3">
          <img src="https://i.pravatar.cc/80?img=3" className="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="" />
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Chia sẻ điều gì đó với CDN Ninh Thuận... ✨"
              className="w-full bg-slate-50 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none min-h-[70px] border-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors text-xs font-semibold">
              <Icon.Camera /> Ảnh / Video
            </button>
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-500 transition-colors text-xs font-semibold">
              <Icon.Tag /> Tag bạn
            </button>
          </div>
          <button
            disabled={!newPost.trim()}
            onClick={() => setNewPost("")}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 hover:bg-rose-700 transition-colors"
          >
            Đăng bài <Icon.Send />
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <h5 className="font-bold text-slate-900 text-sm leading-none">{post.author}</h5>
                <span className="text-xs text-slate-400 mt-0.5 block">{timeAgo(post.createdAt)}</span>
              </div>
              <button className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400">⋯</button>
            </div>
            <div className="px-4 pb-3">
              <p className="text-slate-700 text-sm leading-relaxed">{post.content}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full font-semibold">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            {post.image && (
              <div className="mx-4 mb-4 rounded-xl overflow-hidden">
                <img src={post.image} alt="" className="w-full h-56 object-cover hover:scale-[1.02] transition-transform duration-500" />
              </div>
            )}
            <div className="px-4 py-3 border-t border-slate-50 flex items-center gap-5">
              <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 transition-colors font-bold text-xs ${likedIds.has(post.id) ? "text-rose-500" : "text-slate-500 hover:text-rose-500"}`}>
                <Icon.Heart filled={likedIds.has(post.id)} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors font-bold text-xs">
                <Icon.MessageSquare />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-slate-500 hover:text-green-500 transition-colors font-bold text-xs">
                <Icon.Share />
              </button>
              <button
                onClick={() => setBookmarked(p => { const n = new Set(p); n.has(post.id) ? n.delete(post.id) : n.add(post.id); return n; })}
                className={`ml-auto transition-colors ${bookmarked.has(post.id) ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
              >
                <Icon.Bookmark />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {viewingStory && <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />}
      </AnimatePresence>
    </div>
  );
}

// News Tab
function NewsTab() {
  return (
    <div className="space-y-4">
      {MOCK_NEWS.map((news, i) => (
        <motion.div key={news.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
          className={`bg-white rounded-2xl overflow-hidden border shadow-sm ${news.pinned ? "border-amber-200 ring-1 ring-amber-200" : "border-slate-100"}`}
        >
          {news.pinned && (
            <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-2">
              <span className="text-amber-500 text-xs">📌</span>
              <span className="text-xs font-bold text-amber-600">Tin nổi bật</span>
            </div>
          )}
          <div className="relative h-44 overflow-hidden">
            <img src={news.image} alt={news.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute bottom-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold border border-white/30">{news.category}</span>
          </div>
          <div className="p-4">
            <h4 className="font-black text-slate-900 text-sm leading-tight mb-2 line-clamp-2">{news.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{news.summary}</p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Icon.Clock />{timeAgo(news.publishedAt)}</span>
                <span className="flex items-center gap-1"><Icon.Eye />{news.views.toLocaleString()}</span>
              </div>
              <button className="text-rose-500 font-bold hover:text-rose-600 flex items-center gap-0.5">Đọc thêm <Icon.ChevronRight /></button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Events Tab
function EventsTab() {
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-4">
      {MOCK_EVENTS.map((event, i) => {
        const isReg = registered.has(event.id);
        const pct = event.maxParticipants ? Math.round((event.registeredCount / event.maxParticipants) * 100) : 0;
        const eventDate = new Date(event.date);
        const isPast = eventDate < new Date();

        return (
          <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="relative h-48">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white font-bold border border-white/30">{event.category}</span>
              </div>
              {event.fee === 0 ? (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-green-500 rounded-full text-[10px] font-black text-white">MIỄN PHÍ</div>
              ) : (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 rounded-full text-[10px] font-black text-white">{(event.fee / 1000).toFixed(0)}k</div>
              )}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <p className="text-white font-black text-base leading-tight">{event.title}</p>
                  <p className="text-white/80 text-xs mt-1 flex items-center gap-1.5">
                    <Icon.Calendar />{eventDate.toLocaleDateString('vi-VN')} · {event.time}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{event.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                <Icon.MapPin />{event.location}
              </div>
              {event.maxParticipants && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1"><Icon.Users />{event.registeredCount}/{event.maxParticipants} đã đăng ký</span>
                    <span className={pct >= 80 ? "text-red-500 font-bold" : "text-slate-400"}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 80 ? "#ef4444" : "#10b981" }} />
                  </div>
                </div>
              )}
              <button
                onClick={() => setRegistered(p => { const n = new Set(p); n.has(event.id) ? n.delete(event.id) : n.add(event.id); return n; })}
                disabled={isPast}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                style={isReg
                  ? { background: "#dcfce7", color: "#16a34a" }
                  : { background: "linear-gradient(135deg, #f43f5e, #ec4899)", color: "white" }
                }
              >
                {isReg ? <><Icon.Check />Đã đăng ký</> : isPast ? "Sự kiện đã kết thúc" : "Đăng ký tham gia →"}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Study Groups
function StudyGroupsTab() {
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const subjectConfig: Record<string, { color: string; emoji: string; label: string }> = {
    english:     { color: "#3b82f6", emoji: "🇬🇧", label: "Tiếng Anh" },
    electronics: { color: "#f59e0b", emoji: "⚡", label: "Điện tử" },
    it:          { color: "#8b5cf6", emoji: "💻", label: "CNTT" },
    auto:        { color: "#ef4444", emoji: "🚗", label: "Ô tô" },
    tourism:     { color: "#10b981", emoji: "🌴", label: "Du lịch" },
    other:       { color: "#64748b", emoji: "📖", label: "Khác" },
  };

  const subjects = ["all", ...Object.keys(subjectConfig)];
  const filtered = MOCK_GROUPS.filter(g => {
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject === "all" || g.subject === selectedSubject;
    return matchSearch && matchSubject;
  });

  return (
    <div>
      <div className="relative mb-3">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Icon.Search /></div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm nhóm học..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700" />
      </div>

      {/* Subject filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4 mb-4">
        {subjects.map(s => {
          const config = subjectConfig[s];
          const active = selectedSubject === s;
          return (
            <button key={s} onClick={() => setSelectedSubject(s)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              style={active
                ? { background: s === "all" ? "#f43f5e" : config?.color, color: "white" }
                : { background: "#f1f5f9", color: "#64748b" }
              }
            >
              {s === "all" ? "🔍 Tất cả" : `${config?.emoji} ${config?.label}`}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.map((group, i) => {
          const cfg = subjectConfig[group.subject];
          const isJoined = joined.has(group.id);
          const pct = Math.round((group.members / group.maxMembers) * 100);

          return (
            <motion.div key={group.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="h-1" style={{ background: cfg.color }} />
              <div className="p-4">
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: cfg.color + "15" }}>
                    {cfg.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-slate-900 text-sm">{group.name}</h3>
                      {!group.isOpen && <span className="text-[9px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded font-bold">Hết chỗ</span>}
                      {isJoined && <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded font-bold">Đã tham gia</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{group.description}</p>
                  </div>
                </div>

                {group.tags && (
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {group.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: cfg.color + "15", color: cfg.color }}>#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5"><Icon.Clock />{group.schedule}</div>
                  <div className="flex items-center gap-1.5"><Icon.MapPin />{group.room}</div>
                  <div className="col-span-2 flex items-center gap-2">
                    <img src={group.leaderAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                    <span className="text-slate-500">Phụ trách: <span className="font-semibold text-slate-700">{group.leader}</span></span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1 text-slate-500"><Icon.Users />{group.members}/{group.maxMembers} thành viên</span>
                    <span className="font-bold" style={{ color: cfg.color }}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cfg.color }} />
                  </div>
                </div>

                <button
                  onClick={() => setJoined(p => { const n = new Set(p); isJoined ? n.delete(group.id) : n.add(group.id); return n; })}
                  disabled={!group.isOpen && !isJoined}
                  className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 border"
                  style={isJoined
                    ? { background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }
                    : { background: cfg.color + "10", color: cfg.color, borderColor: cfg.color + "30" }
                  }
                >
                  {isJoined ? <><Icon.Check />Rời nhóm</> : !group.isOpen ? <><Icon.Lock />Hết chỗ</> : <><Icon.UserPlus />Tham gia nhóm</>}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Timetable
function TimetableTab() {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 1 : today;
  const [selectedDay, setSelectedDay] = useState(todayIdx <= 6 ? todayIdx : 1);

  const dayEntries = MOCK_TIMETABLE.filter(e => e.dayOfWeek === selectedDay).sort((a, b) => a.startPeriod - b.startPeriod);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-4 -mx-4 px-4">
        {[1,2,3,4,5,6].map(day => (
          <button key={day} onClick={() => setSelectedDay(day)}
            className={`shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl text-xs font-black transition-all min-w-[52px] ${selectedDay === day ? "bg-rose-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600"}`}
          >
            <span className="text-[9px] uppercase opacity-70">{DAY_LABELS[day].replace("Thứ ", "T")}</span>
            <span className="text-base mt-0.5">{day + 1}</span>
            {day === todayIdx && <span className="w-1 h-1 bg-rose-400 rounded-full mt-1" style={selectedDay === day ? { background: "white" } : {}} />}
          </button>
        ))}
      </div>

      {dayEntries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <span className="text-5xl">☀️</span>
          <p className="text-slate-600 font-bold mt-4">Không có tiết học</p>
          <p className="text-slate-400 text-xs mt-1">{DAY_LABELS[selectedDay]} là ngày nghỉ hoặc chưa có lịch</p>
        </div>
      ) : (
        <div className="relative">
          <div className="space-y-3">
            {dayEntries.map(entry => (
              <div key={entry.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex overflow-hidden">
                <div className="w-20 flex flex-col items-center justify-center py-4 shrink-0" style={{ background: entry.color + "12", borderRight: `3px solid ${entry.color}` }}>
                  <span className="text-[10px] font-black" style={{ color: entry.color }}>Tiết {entry.startPeriod}–{entry.endPeriod}</span>
                  <span className="text-[9px] text-slate-400 mt-1">{PERIOD_TIMES[entry.startPeriod]}</span>
                  <span className="text-[8px] text-slate-300">↕</span>
                  <span className="text-[9px] text-slate-400">{PERIOD_TIMES[entry.endPeriod]}</span>
                </div>
                <div className="p-3 flex-1">
                  <h4 className="font-black text-slate-900 text-sm leading-tight">{entry.subject}</h4>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
                    <Icon.Crown /><span>{entry.teacher}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-slate-400"><Icon.MapPin />{entry.room}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><Icon.Users />{entry.class}</span>
                    {entry.credits && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: entry.color + "15", color: entry.color }}>{entry.credits} TC</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick ref */}
      <div className="mt-5 bg-white rounded-2xl border border-slate-100 p-4">
        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Khung giờ tham chiếu</h4>
        <div className="grid grid-cols-3 gap-1">
          {[1,2,3,4,5,6,7,8,9].map(p => (
            <div key={p} className="flex items-center gap-1.5 text-xs py-1 px-2 rounded-lg bg-slate-50">
              <span className="font-bold text-slate-600 w-8">T{p}</span>
              <span className="text-slate-400">{PERIOD_TIMES[p]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Contests
function ContestsTab() {
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [comps, setComps] = useState(MOCK_COMPETITIONS.map(c => ({ ...c })));

  const catCfg: Record<string, { emoji: string; color: string }> = {
    english:     { emoji: "🇬🇧", color: "#3b82f6" },
    electronics: { emoji: "⚡", color: "#f59e0b" },
    beauty:      { emoji: "🌸", color: "#ec4899" },
    photo:       { emoji: "📷", color: "#8b5cf6" },
    sport:       { emoji: "⚽", color: "#10b981" },
    other:       { emoji: "🔧", color: "#64748b" },
  };

  const statusCfg: Record<string, { label: string; color: string; bg: string }> = {
    ongoing:  { label: "Đang diễn ra", color: "#16a34a", bg: "#dcfce7" },
    upcoming: { label: "Sắp diễn ra",  color: "#2563eb", bg: "#dbeafe" },
    ended:    { label: "Đã kết thúc",  color: "#9ca3af", bg: "#f1f5f9" },
  };

  const handleVote = (id: string) => {
    if (voted.has(id)) return;
    setVoted(p => new Set([...p, id]));
    setComps(p => p.map(c => c.id === id ? { ...c, votes: (c.votes || 0) + 1 } : c));
  };

  return (
    <div className="space-y-5">
      {comps.map((comp, i) => {
        const cat = catCfg[comp.category];
        const status = statusCfg[comp.status];
        const isVoted = voted.has(comp.id);

        return (
          <motion.div key={comp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="relative h-44 overflow-hidden">
              <img src={comp.image} alt={comp.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-full" style={{ color: status.color, background: status.bg }}>{status.label}</span>
                <span className="text-xl">{cat.emoji}</span>
              </div>
              {comp.prize && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-amber-500 rounded-full text-white text-[10px] font-black">
                  <Icon.Trophy />🏆 {comp.prize}
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <h4 className="text-white font-black text-base leading-tight">{comp.title}</h4>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{comp.description}</p>
              {comp.deadline && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <Icon.Calendar />Hạn đăng ký: {new Date(comp.deadline).toLocaleDateString('vi-VN')}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Icon.Heart filled={(comp.votes || 0) > 0} />{(comp.votes || 0).toLocaleString()} bình chọn
                  </span>
                  {comp.participants !== undefined && (
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Icon.Users />{comp.participants} thí sinh
                    </span>
                  )}
                </div>
                {comp.status !== 'ended' && (
                  <button
                    onClick={() => handleVote(comp.id)}
                    disabled={isVoted}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-70 flex items-center gap-1.5"
                    style={isVoted ? { background: "#dcfce7", color: "#16a34a" } : { background: "#fff1f2", color: "#f43f5e", border: "1px solid #fecdd3" }}
                  >
                    {isVoted ? <><Icon.Check />Đã bình chọn</> : <><Icon.Heart />Bình chọn</>}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Beauty
function BeautyTab() {
  const [candidates, setCandidates] = useState(MOCK_BEAUTY.map(c => ({ ...c })));
  const [voted, setVoted] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const maxVotes = Math.max(...candidates.map(c => c.votes));

  const handleVote = (id: string) => {
    if (voted) return;
    setVoted(id);
    setCandidates(prev => [...prev.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c)].sort((a, b) => b.votes - a.votes));
  };

  const rankColors = ["#f59e0b", "#94a3b8", "#cd7c3a"];

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden mb-5 h-36" style={{ background: "linear-gradient(135deg, #f43f5e 0%, #fb923c 50%, #fbbf24 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <span className="text-4xl mb-1.5">👑</span>
          <h3 className="text-xl font-black">Hoa Khôi CDN 2024</h3>
          <p className="text-sm text-white/80 mt-1">Bình chọn cho thí sinh yêu thích!</p>
        </div>
      </div>

      {voted && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700 font-semibold"
        >
          <Icon.Check />Đã bình chọn thành công! Cảm ơn bạn 💐
        </motion.div>
      )}

      <div className="space-y-4">
        {candidates.map((cand, i) => {
          const pct = maxVotes > 0 ? Math.round((cand.votes / maxVotes) * 100) : 0;
          const isTop3 = i < 3;
          const rankColor = rankColors[i] || "#64748b";
          const isVotedThis = voted === cand.id;
          const isExpanded = expanded === cand.id;

          return (
            <motion.div key={cand.id} layout className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${i === 0 ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-100"}`}>
              {i === 0 && (
                <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-500" />
              )}
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <img src={cand.avatar} alt={cand.name} className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg" style={{ background: rankColor }}>
                      #{i + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 text-sm leading-tight">{cand.name}</h4>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: i === 0 ? "#f59e0b" : "#f43f5e" }}>{cand.major} · Năm {cand.year}</p>
                    {cand.achievement && (
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1"><Icon.Award />{cand.achievement}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1.5 italic line-clamp-2">"{cand.bio}"</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>{cand.votes.toLocaleString()} phiếu</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: i === 0 ? "#f59e0b" : "#f43f5e" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded info */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-3 pt-3 border-t border-slate-50">
                        {cand.hobbies && (
                          <div className="flex gap-1.5 flex-wrap">
                            {cand.hobbies.map(h => (
                              <span key={h} className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-500 rounded-full font-semibold">{h}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => setExpanded(isExpanded ? null : cand.id)} className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                    {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                  </button>
                  <button
                    onClick={() => handleVote(cand.id)}
                    disabled={!!voted}
                    className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    style={isVotedThis
                      ? { background: "#dcfce7", color: "#16a34a" }
                      : { background: "linear-gradient(135deg, #f43f5e, #ec4899)", color: "white" }
                    }
                  >
                    {isVotedThis ? <><Icon.Check />Đã chọn</> : <><Icon.Heart filled />Bình chọn</>}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Faculty
function FacultyTab() {
  return (
    <div>
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
          {COLLEGE.departments.map(dept => (
            <button key={dept} className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-rose-300 hover:text-rose-500 transition-all">
              {dept}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {MOCK_FACULTY.map((teacher, i) => (
          <motion.div key={teacher.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3"
          >
            <div className="relative shrink-0">
              <img src={teacher.avatar} alt={teacher.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-white rounded-lg shadow flex items-center gap-0.5 text-[9px] font-black text-amber-500">
                <Icon.Star filled />
                {teacher.rating}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-slate-900 text-sm leading-tight">{teacher.name}</h4>
              <p className="text-xs text-rose-500 font-semibold mt-0.5">{teacher.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{teacher.department}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {teacher.subjects.map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded-full border border-slate-100 font-medium">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                <Icon.Mail />{teacher.email}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Info Tab
function InfoTab() {
  return (
    <div className="space-y-4">
      {/* About */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4">
          <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2"><Icon.BookOpen />Về trường</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Trường Cao Đẳng Nghề Ninh Thuận là cơ sở giáo dục nghề nghiệp hàng đầu tại tỉnh Ninh Thuận, 
            đào tạo nguồn nhân lực chất lượng cao cho thị trường lao động địa phương và cả nước. 
            Trường có hơn 20 năm kinh nghiệm đào tạo với đội ngũ giảng viên giàu kinh nghiệm và cơ sở vật chất hiện đại.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4">
          <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2"><Icon.Phone />Liên hệ</h3>
          <div className="space-y-3">
            {[
              { icon: <Icon.MapPin />, label: "Địa chỉ", value: COLLEGE.address },
              { icon: <Icon.Phone />, label: "Điện thoại", value: COLLEGE.phone },
              { icon: <Icon.Globe />, label: "Website", value: COLLEGE.website },
              { icon: <Icon.Mail />, label: "Email", value: "info@cdnninhthuan.edu.vn" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">{item.label}</p>
                  <p className="text-sm text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4">
          <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2"><Icon.GraduationCap />Các khoa đào tạo</h3>
          <div className="grid grid-cols-2 gap-2">
            {COLLEGE.departments.map((dept, i) => (
              <div key={dept} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2 h-2 rounded-full" style={{ background: ["#f43f5e","#3b82f6","#8b5cf6","#10b981","#f59e0b","#64748b"][i % 6] }} />
                <span className="text-xs font-semibold text-slate-700">{dept}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Năm thành lập", value: "2002", emoji: "🏛" },
          { label: "Diện tích", value: "5 ha", emoji: "🏫" },
          { label: "Phòng lab", value: "42+", emoji: "🔬" },
          { label: "Đối tác DN", value: "80+", emoji: "🤝" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <span className="text-3xl">{s.emoji}</span>
            <p className="text-xl font-black text-slate-900 mt-1">{s.value}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab config ────────────────────────────────────────────────
type TabId = "feed" | "news" | "events" | "groups" | "timetable" | "contests" | "beauty" | "faculty" | "info";

const TABS: { id: TabId; label: string; icon: React.ReactNode; badge?: boolean }[] = [
  { id: "feed",      label: "Bảng tin",  icon: <Icon.MessageSquare /> },
  { id: "news",      label: "Tin tức",   icon: <Icon.Newspaper /> },
  { id: "events",    label: "Sự kiện",   icon: <Icon.Calendar />, badge: true },
  { id: "groups",    label: "Nhóm học",  icon: <Icon.Users /> },
  { id: "timetable", label: "TKB",       icon: <Icon.BookOpen /> },
  { id: "contests",  label: "Cuộc thi",  icon: <Icon.Trophy />, badge: true },
  { id: "beauty",    label: "Hoa Khôi",  icon: <Icon.Sparkles />, badge: true },
  { id: "faculty",   label: "Giảng viên",icon: <Icon.GraduationCap /> },
  { id: "info",      label: "Giới thiệu",icon: <Icon.Globe /> },
];

// ── Main ──────────────────────────────────────────────────────
export default function CollegeDetailView({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>("feed");

  const renderTab = () => {
    switch (activeTab) {
      case "feed":      return <FeedTab />;
      case "news":      return <NewsTab />;
      case "events":    return <EventsTab />;
      case "groups":    return <StudyGroupsTab />;
      case "timetable": return <TimetableTab />;
      case "contests":  return <ContestsTab />;
      case "beauty":    return <BeautyTab />;
      case "faculty":   return <FacultyTab />;
      case "info":      return <InfoTab />;
    }
  };

  return (
    <div className="h-screen w-full bg-[#f4f6f9] flex flex-col relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
          <Icon.ArrowLeft />
        </button>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img src={COLLEGE.avatar} alt="" className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
          <div className="text-left min-w-0">
            <h1 className="font-black text-slate-900 text-sm leading-none truncate">{COLLEGE.shortName}</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Ninh Thuận 🌴</p>
          </div>
        </div>
        <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 flex-shrink-0">
          <Icon.Bell />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
      </header>

      {/* Hero */}
      <div className="flex-shrink-0 overflow-hidden">
        <div className="relative h-40 w-full">
          <img src={COLLEGE.cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f4f6f9]" />
        </div>
        <div className="px-4 -mt-10 flex items-end gap-3 relative z-10">
          <div className="w-20 h-20 rounded-2xl shadow-xl overflow-hidden bg-white border-4 border-white flex-shrink-0">
            <img src={COLLEGE.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="pb-2 flex-1 min-w-0">
            <h2 className="font-black text-slate-900 text-base leading-tight line-clamp-2">{COLLEGE.name}</h2>
            <p className="text-xs text-rose-500 font-semibold mt-0.5 line-clamp-1">{COLLEGE.bio}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 px-4 mt-4 mb-4">
          {[
            { label: "Sinh viên", value: `${(COLLEGE.stats.members / 1000).toFixed(1)}k`, color: "#3b82f6" },
            { label: "Bài viết",  value: `${(COLLEGE.stats.posts / 1000).toFixed(1)}k`,   color: "#f43f5e" },
            { label: "Nhóm học",  value: COLLEGE.stats.groups,                             color: "#f59e0b" },
            { label: "GV",        value: COLLEGE.stats.teachers,                           color: "#10b981" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl py-2.5 text-center border border-slate-100 shadow-sm">
              <span className="text-base font-black" style={{ color: s.color }}>{s.value}</span>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wide mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 flex-shrink-0 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2.5 no-scrollbar">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                style={isActive
                  ? { background: "#f43f5e", color: "white" }
                  : { background: "#f8fafc", color: "#64748b" }
                }
              >
                {tab.icon}
                {tab.label}
                {tab.badge && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 pt-4 pb-20 w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}