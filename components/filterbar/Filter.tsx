'use client'
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Check, Sparkles, User, Map as MapIcon } from "lucide-react";

/* ---------------- DATA CẤU TRÚC GIỮ NGUYÊN ---------------- */
const SUB_DATA: Record<string, string[]> = {
    music: ["K-Pop", "V-Pop", "US-UK", "EDM", "Jazz", "Rock", "Indie", "Lofi"],
    movie: ["Action", "Anime", "Horror", "Sci-Fi", "Drama", "Comedy", "Indie", "Docu"],
    dating: ["Dinner", "Cafe", "Movie Night", "Walk", "Gift", "Chat", "Travel", "Game"],
    game: ["MOBA", "FPS", "RPG", "Puzzle", "Racing", "Sports", "Indie", "Casual"],
    book: ["Fiction", "Self-help", "Comic", "Science", "History", "Business", "Poem", "Art"],
    language: ["English", "Chinese", "Japanese", "French", "Korean", "Spanish", "German", "Thai"],
    work: ["Coding", "Design", "Meeting", "Email", "Report", "Planning", "Review", "Sales"],
    startup: ["Pitching", "Funding", "MVP", "Networking", "Marketing", "Legal", "Hiring", "Product"],
};

const GRID_CONFIG = [
    { id: "music", name: "Music", icon: '🎵', type: "play" },
    { id: "movie", name: "Film", icon: '🎬', type: "play" },
    { id: "user", name: "Me", icon: <User size={16} />, type: "special" },
    { id: "book", name: "Book", icon: '📚', type: "study" },
    { id: "language", name: "Lang", icon: '🌐', type: "study" },
    { id: "dating", name: "Dating", icon: '❤️', type: "play" },
    { id: "game", name: "Game", icon: '🎮', type: "play" },
    { id: "map", name: "Map", icon: <MapIcon size={16} />, type: "special" },
    { id: "work", name: "Work", icon: '💼', type: "study" },
    { id: "startup", name: "Startup", icon: '🚀', type: "study" },
];

export default function RedConsoleFilter() {
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [customItems, setCustomItems] = useState<Record<string, string[]>>({});
    const [showAdd, setShowAdd] = useState(false);
    const [input, setInput] = useState("");

    const stats = useMemo(() => {
        let study = 0, play = 0;
        selected.forEach(id => {
            const parentId = id.split(':')[0];
            const config = GRID_CONFIG.find(m => m.id === parentId);
            if (config?.type === 'study') study++;
            else if (config?.type === 'play') play++;
        });
        const total = study + play;
        return {
            study: total === 0 ? 50 : (study / total) * 100,
            play: total === 0 ? 50 : (play / total) * 100
        };
    }, [selected]);

    const countsByParent = useMemo(() => {
        const counts: Record<string, number> = {};
        selected.forEach(id => {
            const pId = id.split(':')[0];
            counts[pId] = (counts[pId] || 0) + 1;
        });
        return counts;
    }, [selected]);

    const toggleItem = (pId: string, name: string) => {
        const id = `${pId}:${name}`;
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    const handleAdd = () => {
        if (!input.trim() || !currentId) return;
        setCustomItems(prev => ({ ...prev, [currentId]: [input, ...(prev[currentId] || [])] }));
        toggleItem(currentId, input);
        setInput("");
        setShowAdd(false);
    };

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4">
            
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                        className="pointer-events-auto mb-6 w-full max-w-[320px] bg-[#222] rounded-xl p-2 flex gap-2 border-2 border-red-900 shadow-2xl"
                    >
                        <input value={input} onChange={e => setInput(e.target.value)} autoFocus placeholder="ITEM NAME..." className="flex-1 bg-transparent px-3 outline-none text-xs font-bold text-red-500 placeholder:text-red-900 uppercase italic" onKeyDown={e => e.key === 'Enter' && handleAdd()} />
                        <button onClick={handleAdd} className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black shadow-[0_4px_0_rgb(153,27,27)] active:translate-y-1 active:shadow-none transition-all">OK</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* THÂN MÁY MÀU ĐỎ */}
            <motion.div layout className="pointer-events-auto w-full max-w-[420px] bg-[#c1272d] rounded-[2.5rem] p-4 shadow-[0_15px_0_#8b1a1f,0_25px_50px_rgba(0,0,0,0.4)] border-t-4 border-red-400">
                
                {/* MÀN HÌNH NHỎ HIỂN THỊ STATS */}
                <div className="mb-4 mx-2 bg-[#2a0e0e] rounded-xl p-3 border-4 border-[#1a0a0a] shadow-inner">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-blue-400 tracking-widest italic">LEARN</span>
                        <span className="text-[9px] font-black text-rose-500 tracking-widest italic">CHILL</span>
                    </div>
                    <div className="h-3 w-full bg-[#111] rounded-sm flex p-0.5 gap-1">
                        <motion.div animate={{ width: `${stats.study}%` }} className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                        <motion.div animate={{ width: `${stats.play}%` }} className="h-full bg-gradient-to-r from-rose-400 to-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-3 px-1">
                    {GRID_CONFIG.map((item, idx) => {
                        const isSubView = currentId !== null && !['user', 'map'].includes(currentId);
                        const count = countsByParent[item.id] || 0;

                        // 1. GIAO DIỆN NÚT TRONG SUB-VIEW
                        if (isSubView) {
                            if (idx === 2) return (
                                <button key="back" onClick={() => { setCurrentId(null); setShowAdd(false) }} className="aspect-square rounded-full bg-[#333] border-b-4 border-[#111] text-white flex items-center justify-center active:translate-y-1 active:border-b-0 transition-all">
                                    <ChevronLeft size={24} strokeWidth={4} />
                                </button>
                            );
                            if (idx === 7) return (
                                <button key="add" onClick={() => setShowAdd(!showAdd)} className="aspect-square rounded-full bg-yellow-500 border-b-4 border-yellow-700 text-yellow-900 flex items-center justify-center active:translate-y-1 active:border-b-0 transition-all">
                                    <Plus size={24} strokeWidth={4} />
                                </button>
                            );

                            const activeSubs = [...(customItems[currentId!] || []), ...(SUB_DATA[currentId!] || [])];
                            const subIndices = [0, 1, 3, 4, 5, 6, 8, 9];
                            const subIdx = subIndices.indexOf(idx);
                            const subName = activeSubs[subIdx];

                            if (!subName) return <div key={`empty-${idx}`} className="aspect-square bg-red-900/20 rounded-full border-2 border-dashed border-red-900/30" />;

                            const isSelected = selected.has(`${currentId}:${subName}`);
                            const parentType = GRID_CONFIG.find(g => g.id === currentId)?.type;

                            return (
                                <motion.button key={subName} whileTap={{ scale: 0.9 }} onClick={() => toggleItem(currentId!, subName)}
                                    className={`aspect-square rounded-full flex flex-col items-center justify-center text-[8px] font-black uppercase leading-[0.8] transition-all border-b-4
                                    ${isSelected 
                                        ? (parentType === 'study' ? 'bg-blue-600 border-blue-900 text-white' : 'bg-rose-600 border-rose-900 text-white') 
                                        : 'bg-[#eeeeee] border-gray-400 text-gray-600'}`}
                                >
                                    {subName.substring(0, 5)}
                                    {isSelected && <Check size={10} strokeWidth={4} className="mt-1" />}
                                </motion.button>
                            );
                        }

                        // 2. GIAO DIỆN NÚT CHÍNH (MAIN VIEW)
                        if (item.id === 'user' || item.id === 'map') {
                            const isUser = item.id === 'user';
                            return (
                                <button key={item.id} onClick={() => isUser && console.log("Profile")} 
                                    className={`aspect-square rounded-full flex flex-col items-center justify-center border-b-4 transition-all active:translate-y-1 active:border-b-0
                                    ${isUser ? 'bg-emerald-500 border-emerald-800' : 'bg-orange-500 border-orange-800'} text-white shadow-lg`}
                                >
                                    {item.icon}
                                    <span className="text-[7px] font-black mt-1 uppercase">{item.name}</span>
                                </button>
                            );
                        }

                        return (
                            <button key={item.id} onClick={() => setCurrentId(item.id)} className="aspect-square relative group">
                                <div className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all border-b-4 active:translate-y-1 active:border-b-0
                                    ${count > 0
                                        ? (item.type === 'study' ? 'bg-blue-600 border-blue-900 text-white' : 'bg-rose-600 border-rose-900 text-white')
                                        : 'bg-[#333] border-[#111] text-gray-500 hover:bg-[#3a3a3a]'}`}>
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="text-[7px] font-black uppercase tracking-tighter mt-1">{item.name}</span>
                                </div>
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-black rounded-full text-[10px] font-black flex items-center justify-center border-2 border-[#c1272d]">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* CHI TIẾT TRANG TRÍ MÁY CHƠI GAME 
                <div className="mt-6 flex justify-between items-center px-6">
                    <div className="flex flex-col gap-1.5 opacity-30">
                        <div className="w-12 h-1 bg-black rounded-full" />
                        <div className="w-12 h-1 bg-black rounded-full" />
                        <div className="w-12 h-1 bg-black rounded-full" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-2 bg-black/20 rounded-full rotate-[-25deg] shadow-inner" />
                            <span className="text-[6px] font-black mt-1 text-red-900">SELECT</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-2 bg-black/20 rounded-full rotate-[-25deg] shadow-inner" />
                            <span className="text-[6px] font-black mt-1 text-red-900">START</span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black/10 border-2 border-black/5 flex items-center justify-center">
                         <div className="w-4 h-4 rounded-full bg-red-800/20" />
                    </div>
                </div> */}
            </motion.div>
        </div>
    );
}