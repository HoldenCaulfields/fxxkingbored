export interface Member {
  id: string;
  name: string;
  avatar: string;
  lat: number;
  lng: number;
  role: 'student' | 'teacher' | 'alumni';
  major: string;
  joinedAt: string;
}

export interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  likedBy?: string[];
  createdAt: string;
  tags?: string[];
}

export interface Story {
  id: string;
  studentName: string;
  avatar: string;
  content: string;
  image?: string;
  createdAt?: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  category: 'english' | 'electronics' | 'beauty' | 'photo' | 'sport' | 'other';
  votes?: number;
  deadline?: string;
  prize?: string;
  participants?: number;
}

export interface CollegeData {
  id: string;
  name: string;
  shortName: string;
  description: string;
  location: [number, number];
  avatar: string;
  cover: string;
  bio: string;
  address: string;
  phone: string;
  website: string;
  stats: {
    members: number;
    posts: number;
    groups: number;
    teachers: number;
  };
  departments: string[];
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: 'english' | 'electronics' | 'it' | 'auto' | 'tourism' | 'other';
  description: string;
  members: number;
  maxMembers: number;
  schedule: string;
  room: string;
  leader: string;
  leaderAvatar: string;
  isOpen: boolean;
  tags?: string[];
}

export interface TimetableEntry {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
  class: string;
  color: string;
  credits?: number;
}

export interface BeautyCandidate {
  id: string;
  name: string;
  major: string;
  year: number;
  avatar: string;
  votes: number;
  bio: string;
  votedBy?: string[];
  hobbies?: string[];
  achievement?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  publishedAt: string;
  views: number;
  pinned?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  registeredCount: number;
  maxParticipants?: number;
  fee?: number;
}

export interface Faculty {
  id: string;
  name: string;
  title: string;
  avatar: string;
  department: string;
  subjects: string[];
  email: string;
  rating: number;
}