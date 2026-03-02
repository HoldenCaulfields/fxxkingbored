"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { UserProfile } from "@/types/user";
import { sendMessage, listenMessages, Message } from "@/services/social";

const QUICK = ["Oke nha! 👍", "Cho mình hỏi…", "Cùng đi không?", "Mình bận rồi 😅", "Haha 😂", "🔥🔥"];

export default function ChatScreen({ peer, onBack }: { peer: UserProfile; onBack: () => void }) {
  const my = useUserStore(s => s.profile);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isGuest = !my.id || my.id === "me";

  useEffect(() => {
    if (isGuest) return;
    return listenMessages(my.id, peer.id, setMsgs);
  }, [my.id, peer.id, isGuest]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async (content?: string) => {
    const txt = content ?? text.trim();
    if (!txt || isGuest) return;
    setSending(true);
    setText("");
    try {
      await sendMessage(my.id, my.name, my.avatar || "/tet.jpg", peer.id, txt);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[6000] flex flex-col bg-white"
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-3 border-b border-slate-100 bg-white">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "#f1f5f9" }}>
          <ArrowLeft size={16} style={{ color: "#475569" }} />
        </button>
        <div className="relative">
          <img src={peer.avatar || "/tet.jpg"}
            className="w-10 h-10 rounded-2xl object-cover"
            alt={peer.name} />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{peer.name}</p>
          {peer.currentMood && (
            <p className="text-[10px] italic truncate" style={{ color: "#7c3aed" }}>{peer.currentMood}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar" style={{ background: "#f8fafc" }}>
        {isGuest && (
          <div className="mb-4 text-center text-xs rounded-2xl p-3 border"
            style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}>
            ⚠️ Đăng nhập Google để nhắn tin thật sự
          </div>
        )}

        {!isGuest && msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <span className="text-4xl">👋</span>
            <p className="text-sm font-semibold text-slate-400">Gửi lời chào đầu tiên!</p>
          </div>
        )}

        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {msgs.map((msg) => {
              const isMe = msg.senderId === my.id;
              return (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  {!isMe && (
                    <img src={msg.senderAvatar || "/tet.jpg"}
                      className="w-7 h-7 rounded-xl object-cover shrink-0 self-end"
                      alt="" />
                  )}
                  <div className="flex flex-col gap-0.5" style={{ maxWidth: "72%" }}>
                    <div
                      className={`px-3.5 py-2.5 text-sm leading-relaxed ${isMe ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md"}`}
                      style={isMe
                        ? { background: "#0f172a", color: "white" }
                        : { background: "white", color: "#1e293b", border: "1px solid #eef2f7" }}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[9px] text-slate-400 px-1 ${isMe ? "text-right" : "text-left"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick replies */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2 bg-white border-t border-slate-100">
        {QUICK.map(q => (
          <button key={q} onClick={() => send(q)} disabled={isGuest}
            className="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors disabled:opacity-40"
            style={{ background: "#f1f5f9", color: "#475569" }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-safe pt-2 flex gap-2 bg-white border-t border-slate-100">
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={isGuest ? "Đăng nhập để nhắn tin…" : "Nhắn gì đó…"}
          disabled={isGuest}
          className="flex-1 px-4 py-3 rounded-2xl text-sm transition-all disabled:opacity-50"
          style={{
            background: "#f1f5f9",
            border: "1.5px solid #e2e8f0",
            color: "#0f172a",
            outline: "none",
          }}
        />
        <button
          onClick={() => send()}
          disabled={!text.trim() || sending || isGuest}
          className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
          style={{ background: "#0f172a", color: "white" }}
        >
          {sending
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Send size={15} />}
        </button>
      </div>
    </motion.div>
  );
}
