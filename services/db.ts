import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  increment,
  onSnapshot,
  Timestamp,
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  where,
  limit
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Member, Post, Story, Competition, BeautyCandidate } from "@/types/cdn";
import { UserProfile } from "@/types/user";

// ── Members ─────────────────────────────────────────────────
export const joinCollege = async (member: Omit<Member, 'joinedAt'>) => {
  const memberDoc = doc(db, "members", member.id);
  await setDoc(memberDoc, {
    ...member,
    joinedAt: Timestamp.now().toDate().toISOString()
  }, { merge: true });
};

export const isMember = async (userId: string): Promise<boolean> => {
  const memberDoc = doc(db, "members", userId);
  const snap = await getDoc(memberDoc);
  return snap.exists();
};

export const getMembers = (callback: (members: Member[]) => void) => {
  const q = query(collection(db, "members"));
  return onSnapshot(q, (snapshot) => {
    const members = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Member));
    callback(members);
  });
};

// ── Posts ────────────────────────────────────────────────────
export const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'likedBy'>) => {
  await addDoc(collection(db, "posts"), {
    ...post,
    likes: 0,
    comments: 0,
    likedBy: [],
    createdAt: Timestamp.now().toDate().toISOString()
  });
};

export const getPosts = (callback: (posts: Post[]) => void) => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(50));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
    callback(posts);
  });
};

export const likePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  const snap = await getDoc(postRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const likedBy: string[] = data.likedBy || [];
  if (likedBy.includes(userId)) {
    await updateDoc(postRef, { likes: increment(-1), likedBy: arrayRemove(userId) });
  } else {
    await updateDoc(postRef, { likes: increment(1), likedBy: arrayUnion(userId) });
  }
};

export const commentPost = async (postId: string, _comment?: string) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { comments: increment(1) });
};

// ── Stories ─────────────────────────────────────────────────
export const createStory = async (story: Omit<Story, 'id'>) => {
  await addDoc(collection(db, "stories"), {
    ...story,
    createdAt: Timestamp.now().toDate().toISOString()
  });
};

export const getStories = (callback: (stories: Story[]) => void) => {
  const q = query(collection(db, "stories"), orderBy("createdAt", "desc"), limit(20));
  return onSnapshot(q, (snapshot) => {
    const stories = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Story));
    callback(stories);
  });
};

// ── Competitions ─────────────────────────────────────────────
export const getCompetitions = (callback: (competitions: Competition[]) => void) => {
  const q = query(collection(db, "competitions"));
  return onSnapshot(q, (snapshot) => {
    const competitions = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Competition));
    callback(competitions);
  });
};

export const voteCompetition = async (compId: string, userId: string) => {
  const compRef = doc(db, "competitions", compId);
  const snap = await getDoc(compRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const votedBy: string[] = data.votedBy || [];
  if (!votedBy.includes(userId)) {
    await updateDoc(compRef, { votes: increment(1), votedBy: arrayUnion(userId) });
  }
};

// ── Beauty Contest ──────────────────────────────────────────
export const getBeautyCandidates = (callback: (candidates: BeautyCandidate[]) => void) => {
  const q = query(collection(db, "beauty_candidates"), orderBy("votes", "desc"));
  return onSnapshot(q, (snapshot) => {
    const candidates = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BeautyCandidate));
    callback(candidates);
  });
};

export const voteBeauty = async (candidateId: string, userId: string) => {
  const candidateRef = doc(db, "beauty_candidates", candidateId);
  const snap = await getDoc(candidateRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const votedBy: string[] = data.votedBy || [];
  if (!votedBy.includes(userId)) {
    await updateDoc(candidateRef, { votes: increment(1), votedBy: arrayUnion(userId) });
    return true;
  }
  return false;
};

// ── User Profile ─────────────────────────────────────────────
export const saveUserProfile = async (profile: UserProfile) => {
  const userRef = doc(db, "userProfiles", profile.id);
  await setDoc(userRef, { ...profile, updatedAt: Date.now() }, { merge: true });
};
