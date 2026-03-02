/**
 * services/social.ts
 * Backend hoàn chỉnh: Connections · Signals · Chat threads
 * Tất cả đều lưu Firestore realtime.
 */
import {
  collection, doc, setDoc, getDoc, addDoc, query,
  where, onSnapshot, orderBy, limit, updateDoc,
  increment, serverTimestamp, deleteDoc, writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ══════════════════════════════════════════════
// CONNECTIONS
// ══════════════════════════════════════════════
export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  status: "pending" | "accepted";
  createdAt: number;
  updatedAt: number;
}

/** Gửi lời mời kết nối (idempotent — merge: true) */
export async function sendConnection(fromId: string, toId: string): Promise<void> {
  const id = [fromId, toId].sort().join("_");
  await setDoc(doc(db, "connections", id), {
    fromId, toId, status: "pending",
    createdAt: Date.now(), updatedAt: Date.now(),
  }, { merge: true });
}

/** Chấp nhận lời mời */
export async function acceptConnection(fromId: string, toId: string): Promise<void> {
  const id = [fromId, toId].sort().join("_");
  await updateDoc(doc(db, "connections", id), {
    status: "accepted", updatedAt: Date.now(),
  });
}

/** Hủy kết nối */
export async function removeConnection(fromId: string, toId: string): Promise<void> {
  const id = [fromId, toId].sort().join("_");
  await deleteDoc(doc(db, "connections", id));
}

/** Lắng nghe connections của user */
export function listenConnections(
  userId: string,
  cb: (connections: Connection[]) => void,
) {
  // Firestore không hỗ trợ OR nên dùng query simple rồi filter client
  const q = query(collection(db, "connections"), limit(200));
  return onSnapshot(q, snap => {
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Connection));
    cb(all.filter(c => c.fromId === userId || c.toId === userId));
  });
}

/** Kiểm tra trạng thái kết nối với một user cụ thể */
export async function getConnectionStatus(
  myId: string,
  otherId: string,
): Promise<"none" | "pending" | "accepted"> {
  const id = [myId, otherId].sort().join("_");
  const snap = await getDoc(doc(db, "connections", id));
  if (!snap.exists()) return "none";
  return (snap.data() as Connection).status;
}

// ══════════════════════════════════════════════
// SIGNALS
// ══════════════════════════════════════════════
export type SignalType = "coffee" | "chill" | "food" | "study" | "music" | "sport" | "help";

export interface Signal {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: SignalType;
  message: string;
  createdAt: number;
  expiresAt: number;
}

/** Phát tín hiệu mới */
export async function sendSignal(signal: Omit<Signal, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "signals"), signal);
  return ref.id;
}

/** Lắng nghe các tín hiệu đang còn hiệu lực */
export function listenSignals(cb: (signals: Signal[]) => void) {
  const now = Date.now();
  const q = query(
    collection(db, "signals"),
    where("expiresAt", ">", now),
    orderBy("expiresAt", "desc"),
    limit(30),
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Signal)));
  });
}

/** Xóa tín hiệu của mình */
export async function deleteSignal(signalId: string): Promise<void> {
  await deleteDoc(doc(db, "signals", signalId));
}

// ══════════════════════════════════════════════
// CHAT / MESSAGES
// ══════════════════════════════════════════════
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: number;
  read?: boolean;
}

export interface ChatThread {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantAvatars: Record<string, string>;
  lastMessage: string;
  lastSenderId: string;
  lastAt: number;
  unread: Record<string, number>; // userId → unread count
}

function threadId(a: string, b: string) {
  return [a, b].sort().join("__");
}

/** Gửi tin nhắn */
export async function sendMessage(
  fromId: string,
  fromName: string,
  fromAvatar: string,
  toId: string,
  text: string,
): Promise<void> {
  const tid = threadId(fromId, toId);
  const now = Date.now();

  // Batch: write message + update thread atomically
  const batch = writeBatch(db);

  const msgRef = doc(collection(db, "chats", tid, "messages"));
  batch.set(msgRef, {
    senderId: fromId, senderName: fromName,
    senderAvatar: fromAvatar, text, createdAt: now, read: false,
  });

  const threadRef = doc(db, "chats", tid);
  batch.set(threadRef, {
    participants: [fromId, toId],
    participantNames: { [fromId]: fromName },
    participantAvatars: { [fromId]: fromAvatar },
    lastMessage: text, lastSenderId: fromId, lastAt: now,
    [`unread.${toId}`]: increment(1),
  }, { merge: true });

  await batch.commit();
}

/** Đánh dấu đã đọc */
export async function markRead(myId: string, otherId: string): Promise<void> {
  const tid = threadId(myId, otherId);
  await updateDoc(doc(db, "chats", tid), { [`unread.${myId}`]: 0 });
}

/** Lắng nghe messages của một thread */
export function listenMessages(
  myId: string,
  otherId: string,
  cb: (msgs: Message[]) => void,
) {
  const tid = threadId(myId, otherId);
  const q = query(
    collection(db, "chats", tid, "messages"),
    orderBy("createdAt", "asc"),
    limit(100),
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Message)));
    // Auto mark read
    if (myId && myId !== "me") markRead(myId, otherId).catch(() => {});
  });
}

/** Lắng nghe danh sách threads của user */
export function listenThreads(
  userId: string,
  cb: (threads: ChatThread[]) => void,
) {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId),
    orderBy("lastAt", "desc"),
    limit(30),
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatThread)));
  });
}

/** Tổng số unread của user */
export function listenUnreadCount(
  userId: string,
  cb: (count: number) => void,
) {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId),
    limit(50),
  );
  return onSnapshot(q, snap => {
    const total = snap.docs.reduce((sum, d) => {
      const data = d.data() as ChatThread;
      return sum + (data.unread?.[userId] ?? 0);
    }, 0);
    cb(total);
  });
}
