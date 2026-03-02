"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Map, Zap, Star, Trophy, RotateCcw, Play,
  Music2, Film, BookOpen, Heart, Gamepad2,
  Rocket, Lightbulb, Briefcase, Volume2, VolumeX,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Home, Joystick,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────
type GameMode = "menu" | "snake" | "reaction" | "quiz" | "vibecheck";
type NavTab = "fun" | "game" | "study";

// ─── Quiz Data ─────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "Bạn thích đi chơi vào?",
    opts: ["🌙 Ban đêm", "☀️ Ban ngày", "🌅 Hoàng hôn", "🌧️ Mưa bụi"],
    tag: ["fun", "study", "fun", "chill"],
  },
  {
    q: "Cuối tuần lý tưởng của bạn?",
    opts: ["🎮 Gaming marathon", "📚 Đọc sách chill", "🎉 Party với bạn", "🧘 Ở nhà một mình"],
    tag: ["game", "study", "fun", "chill"],
  },
  {
    q: "Loại nhạc nào hợp với bạn?",
    opts: ["🎸 Indie / Rock", "🎹 Lo-fi / Jazz", "💃 EDM / Pop", "🎼 Classical"],
    tag: ["fun", "study", "fun", "study"],
  },
  {
    q: "Bạn là người như thế nào?",
    opts: ["⚡ Năng động, thích mới", "🌿 Bình tĩnh, sâu sắc", "😂 Hài hước, vui tính", "🧠 Trí tuệ, phân tích"],
    tag: ["fun", "chill", "fun", "study"],
  },
];

// ─── Subgame: SNAKE ────────────────────────────────────────────
const GRID = 12;
type Pt = { x: number; y: number };

function SnakeGame({ onScore, onExit }: { onScore: (s: number) => void; onExit: () => void }) {
  const [snake, setSnake] = useState<Pt[]>([{ x: 6, y: 6 }]);
  const [food, setFood]   = useState<Pt>({ x: 3, y: 3 });
  const [dir, setDir]     = useState<Pt>({ x: 1, y: 0 });
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [dead, setDead]   = useState(false);
  const dirRef = useRef(dir);

  const randFood = (s: Pt[]) => {
    let f: Pt;
    do { f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }
    while (s.some(p => p.x === f.x && p.y === f.y));
    return f;
  };

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const map: Record<string, Pt> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      };
      if (map[e.key]) { dirRef.current = map[e.key]; setDir(map[e.key]); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  useEffect(() => {
    if (!running || dead) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: (prev[0].x + dirRef.current.x + GRID) % GRID, y: (prev[0].y + dirRef.current.y + GRID) % GRID };
        if (prev.some(p => p.x === head.x && p.y === head.y)) {
          setDead(true); setRunning(false); onScore(score); return prev;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...prev.slice(0, ate ? undefined : -1)];
        if (ate) { setScore(s => s + 10); setFood(randFood(next)); }
        return next;
      });
    }, 130);
    return () => clearInterval(interval);
  }, [running, dead, food, score]);

  const reset = () => {
    setSnake([{ x: 6, y: 6 }]); setDir({ x: 1, y: 0 }); dirRef.current = { x: 1, y: 0 };
    setFood({ x: 3, y: 3 }); setScore(0); setDead(false); setRunning(true);
  };

  const handleDir = (d: Pt) => { dirRef.current = d; setDir(d); };

  return (
    <div className="flex flex-col items-center gap-3 h-full">
      <div className="flex items-center justify-between w-full">
        <span className="text-[10px] font-black text-cyan-400 tracking-widest">SNAKE</span>
        <span className="text-[10px] font-black text-yellow-400">⭐ {score}</span>
      </div>

      {/* Grid */}
      <div
        className="grid border border-cyan-900/50 rounded-lg overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, gap: 1, background: "#0a0e1a" }}
      >
        {Array.from({ length: GRID * GRID }).map((_, i) => {
          const x = i % GRID, y = Math.floor(i / GRID);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = snake.slice(1).some(p => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div key={i} className="w-[16px] h-[16px] rounded-sm transition-colors"
              style={{
                background: isHead ? "#00fff0" : isBody ? "#00c8c8" : isFood ? "#ff4466" : "#0d1428",
                boxShadow: isHead ? "0 0 6px #00fff0" : isFood ? "0 0 6px #ff4466" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Controls */}
      {!running && !dead && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 font-black text-xs border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors">
          <Play size={12} /> PLAY
        </motion.button>
      )}
      {dead && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="text-red-400 font-black text-xs mb-2">GAME OVER — {score} pts</p>
          <button onClick={reset} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 text-white font-black text-[10px] hover:bg-white/10 transition-colors mx-auto">
            <RotateCcw size={10} /> RETRY
          </button>
        </motion.div>
      )}

      {/* D-pad */}
      {running && (
        <div className="grid grid-cols-3 gap-1 mt-auto">
          {[
            [null, { x: 0, y: -1 }, null],
            [{ x: -1, y: 0 }, null, { x: 1, y: 0 }],
            [null, { x: 0, y: 1 }, null],
          ].map((row, ri) => row.map((d, ci) => d ? (
            <button key={`${ri}-${ci}`} onPointerDown={() => handleDir(d)}
              className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/60 active:bg-white/20 transition-colors border border-white/8">
              {ri === 0 ? <ChevronUp size={14} /> : ri === 2 ? <ChevronDown size={14} /> : ci === 0 ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : <div key={`${ri}-${ci}`} />))}
        </div>
      )}
    </div>
  );
}

// ─── Subgame: REACTION ─────────────────────────────────────────
function ReactionGame({ onScore }: { onScore: (s: number) => void }) {
  const [phase, setPhase] = useState<"wait" | "ready" | "go" | "result">("wait");
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    setPhase("ready");
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setPhase("go"); setStartTime(Date.now());
    }, delay);
  };

  const tap = () => {
    if (phase === "ready") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("wait"); setElapsed(0);
      return;
    }
    if (phase === "go") {
      const ms = Date.now() - startTime;
      setElapsed(ms); setPhase("result");
      if (!best || ms < best) setBest(ms);
      onScore(Math.max(0, 1000 - ms));
    }
    if (phase === "result") { setPhase("wait"); }
  };

  const color = phase === "go" ? "#00ff88" : phase === "ready" ? "#ff4466" : "#1e293b";
  const label = phase === "wait" ? "TAP TO START" : phase === "ready" ? "WAIT..." : phase === "go" ? "NOW! TAP!" : `${elapsed}ms`;

  return (
    <div className="flex flex-col items-center gap-4 h-full justify-center">
      <div className="flex items-center justify-between w-full">
        <span className="text-[10px] font-black text-purple-400 tracking-widest">REACTION</span>
        {best && <span className="text-[10px] font-black text-yellow-400">🏆 {best}ms</span>}
      </div>
      <motion.button
        onPointerDown={phase === "wait" || phase === "result" ? start : tap}
        onClick={phase === "ready" || phase === "go" ? tap : undefined}
        className="w-full flex-1 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer border-2"
        style={{ background: color + "22", borderColor: color + "44" }}
        animate={{ scale: phase === "go" ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: color, boxShadow: `0 0 30px ${color}` }}
          animate={{ scale: phase === "go" ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.2, repeat: phase === "go" ? Infinity : 0, repeatDelay: 0.3 }}
        >
          <Zap size={28} className="text-black" />
        </motion.div>
        <span className="font-black text-white text-sm tracking-widest">{label}</span>
        {phase === "result" && (
          <span className="text-[10px] text-white/50">Tap again to retry</span>
        )}
      </motion.button>
    </div>
  );
}

// ─── Subgame: VIBE CHECK ───────────────────────────────────────
function VibeCheck({ onDone }: { onDone: (result: string) => void }) {
  const [qIdx, setQIdx]     = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone]     = useState(false);
  const [result, setResult] = useState("");

  const handleAnswer = (tag: string, opt: string) => {
    const next = [...answers, tag];
    if (qIdx + 1 >= QUIZ_QUESTIONS.length) {
      const counts: Record<string, number> = {};
      next.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      const map: Record<string, string> = {
        fun: "🎉 Party Animal — Bạn sống để chill và tận hưởng!",
        study: "🧠 Deep Thinker — Bạn thích chiều sâu và ý nghĩa",
        game: "🎮 Gamer Soul — Digital world là home của bạn",
        chill: "🌿 Zen Viber — Bạn bình thản và sâu sắc",
      };
      const res = map[top] || "✨ Unique Vibe — Bạn không thể phân loại!";
      setResult(res); setDone(true); onDone(res);
    } else {
      setAnswers(next); setQIdx(q => q + 1);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-2">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-5xl">{result.split(" ")[0]}</motion.div>
        <p className="text-sm font-black text-white leading-snug">{result.slice(3)}</p>
        <p className="text-[10px] text-white/40">Vibe của bạn đã được phân tích!</p>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[qIdx];
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-pink-400 tracking-widest">VIBE CHECK</span>
        <span className="text-[9px] text-white/30">{qIdx + 1}/{QUIZ_QUESTIONS.length}</span>
      </div>
      {/* Progress */}
      <div className="h-0.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div className="h-full bg-pink-500 rounded-full"
          animate={{ width: `${((qIdx) / QUIZ_QUESTIONS.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
          className="flex flex-col gap-2 flex-1">
          <p className="text-xs font-black text-white mt-2 leading-snug">{q.q}</p>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {q.opts.map((opt, i) => (
              <motion.button key={opt} whileTap={{ scale: 0.94 }} onClick={() => handleAnswer(q.tag[i], opt)}
                className="flex items-center justify-center text-center px-2 py-3 rounded-xl bg-white/5 border border-white/8 text-[10px] font-bold text-white hover:bg-white/10 transition-colors leading-snug">
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Menu Screen ───────────────────────────────────────────────
const GAMES = [
  { id: "snake"     as GameMode, emoji: "🐍", label: "Snake Neon",  desc: "Classic arcade",  color: "#00fff0" },
  { id: "reaction"  as GameMode, emoji: "⚡", label: "Reflex Rush", desc: "Test your speed", color: "#a855f7" },
  { id: "vibecheck" as GameMode, emoji: "🎭", label: "Vibe Check",  desc: "Who are you?",    color: "#ec4899" },
];

// ─── Category Sidebar Items ────────────────────────────────────
const FUN_ITEMS = [
  { icon: <Film size={14} />,   label: "Phim Ảnh", color: "#FF0055" },
  { icon: <Music2 size={14} />, label: "Âm Nhạc",  color: "#7000FF" },
  { icon: <Heart size={14} />,  label: "Hẹn Hò",   color: "#FF3D00" },
  { icon: <Joystick size={14} />, label: "Kho Game", color: "#00D1FF" },
];
const STUDY_ITEMS = [
  { icon: <BookOpen size={14} />,    label: "Đọc Sách",  color: "#00E676" },
  { icon: <Briefcase size={14} />,   label: "Làm Việc",  color: "#2979FF" },
  { icon: <Rocket size={14} />,      label: "Khởi Nghiệp", color: "#FFC400" },
  { icon: <Lightbulb size={14} />,   label: "Ý Tưởng",  color: "#F50057" },
];

// ─── Main GameScreen ───────────────────────────────────────────
type Props = { goMap: () => void };

export default function GameScreen({ goMap }: Props) {
  const [activeGame, setActiveGame] = useState<GameMode>("menu");
  const [navTab, setNavTab]         = useState<NavTab>("game");
  const [scores, setScores]         = useState<Record<string, number>>({});
  const [isOn, setIsOn]             = useState(true);
  const [muted, setMuted]           = useState(false);
  const [vibeResult, setVibeResult] = useState("");

  const handleScore = (game: string, score: number) => {
    setScores(prev => ({ ...prev, [game]: Math.max(prev[game] || 0, score) }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div
      className="h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row items-stretch gap-4 p-3 md:p-6 font-mono"
      style={{
        background: "#05070f",
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,255,240,0.04) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(168,85,247,0.04) 0%, transparent 50%),
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "auto, auto, 28px 28px, 28px 28px",
      }}
    >
      {/* ── MOBILE TOP NAV ── */}
      <nav className="md:hidden flex items-center justify-between px-2 flex-shrink-0">
        <button onClick={goMap}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-white/60 text-xs font-black hover:bg-white/10 transition-colors">
          <Map size={12} /> MAP
        </button>
        <span className="text-[10px] font-black text-white/30 tracking-[4px] uppercase">G-BOY</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setMuted(m => !m)} className="text-white/30 hover:text-white transition-colors">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-yellow-400" />
            <span className="text-[10px] font-black text-yellow-400">{totalScore}</span>
          </div>
        </div>
      </nav>

      {/* ── LEFT SIDEBAR (desktop) ── */}
      <aside className="hidden md:flex flex-col justify-between py-4 w-48 flex-shrink-0">
        <div>
          <p className="text-[9px] font-black text-white/20 tracking-[3px] uppercase mb-4">ĂN CHƠI</p>
          <div className="space-y-2">
            {FUN_ITEMS.map((item, i) => (
              <motion.div key={i}
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 cursor-pointer group transition-all hover:border-white/15"
                style={{ background: item.color + "0d" }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-[10px] font-black text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-wide">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <button onClick={goMap}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/8 text-white/40 text-xs font-black hover:bg-white/5 hover:text-white/70 transition-all">
          <Map size={13} /> Back to Map
        </button>
      </aside>

      {/* ── MAIN CONSOLE ── */}
      <main className="flex-1 flex items-center justify-center min-w-0 min-h-0">
        <div
          className="relative w-full max-w-[320px] h-full max-h-[680px] flex flex-col rounded-[3rem] p-1"
          style={{
            background: "linear-gradient(145deg, #1a0a1e, #0d0d1f, #001a1a)",
            border: "1.5px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 60px rgba(0,255,240,0.06), 0 0 120px rgba(168,85,247,0.04), 0 40px 80px rgba(0,0,0,0.8)",
          }}
        >
          {/* Inner */}
          <div className="flex-1 flex flex-col rounded-[2.6rem] overflow-hidden"
            style={{ background: "linear-gradient(160deg, #12001a, #001218, #0d0d1a)" }}>

            {/* ── STATUS BAR ── */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: isOn ? "#00ff88" : "#1a1a2e" }}
                  animate={isOn ? { boxShadow: ["0 0 4px #00ff88", "0 0 10px #00ff88", "0 0 4px #00ff88"] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[9px] font-black text-white/20 tracking-[4px]">G-BOY</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Trophy size={9} className="text-yellow-400" />
                  <span className="text-[9px] font-black text-yellow-400">{totalScore}</span>
                </div>
                <button onClick={() => setMuted(m => !m)} className="text-white/20 hover:text-white/50 transition-colors">
                  {muted ? <VolumeX size={10} /> : <Volume2 size={10} />}
                </button>
              </div>
            </div>

            {/* ── SCREEN ── */}
            <div className="mx-5 flex-1 rounded-2xl overflow-hidden relative"
              style={{
                background: "#060d18",
                boxShadow: "inset 0 2px 20px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,255,240,0.06)",
                minHeight: 0,
              }}
            >
              {/* Scanlines overlay */}
              <div className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
                }}
              />
              {/* Screen glow corner */}
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl pointer-events-none"
                style={{ background: "rgba(0,255,240,0.05)" }} />

              <div className="relative z-0 p-4 h-full flex flex-col">
                <AnimatePresence mode="wait">
                  {!isOn ? (
                    <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex-1 flex items-center justify-center">
                      <div className="w-16 h-0.5 bg-white/8 animate-pulse rounded-full" />
                    </motion.div>
                  ) : activeGame === "menu" ? (
                    <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black text-white/20 tracking-[3px] uppercase">SELECT GAME</span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        {GAMES.map((g, i) => (
                          <motion.button key={g.id}
                            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => setActiveGame(g.id)}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left group"
                            style={{ background: g.color + "0d", borderColor: g.color + "25" }}
                          >
                            <span className="text-2xl">{g.emoji}</span>
                            <div>
                              <p className="text-xs font-black text-white">{g.label}</p>
                              <p className="text-[9px]" style={{ color: g.color + "aa" }}>{g.desc}</p>
                            </div>
                            {scores[g.id] ? (
                              <span className="ml-auto text-[9px] font-black text-yellow-400">{scores[g.id]}</span>
                            ) : (
                              <span className="ml-auto text-white/10 group-hover:text-white/30 transition-colors">▶</span>
                            )}
                          </motion.button>
                        ))}
                      </div>

                      {/* Quick stats */}
                      {totalScore > 0 && (
                        <div className="flex items-center gap-2 mt-auto">
                          <Star size={9} className="text-yellow-400" />
                          <span className="text-[9px] text-white/30">Total: <span className="text-yellow-400 font-black">{totalScore}</span> pts</span>
                        </div>
                      )}
                    </motion.div>
                  ) : activeGame === "snake" ? (
                    <motion.div key="snake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                      <button onClick={() => setActiveGame("menu")}
                        className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white/60 transition-colors mb-2">
                        <Home size={9} /> MENU
                      </button>
                      <SnakeGame onScore={s => handleScore("snake", s)} onExit={() => setActiveGame("menu")} />
                    </motion.div>
                  ) : activeGame === "reaction" ? (
                    <motion.div key="reaction" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                      <button onClick={() => setActiveGame("menu")}
                        className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white/60 transition-colors mb-2">
                        <Home size={9} /> MENU
                      </button>
                      <ReactionGame onScore={s => handleScore("reaction", s)} />
                    </motion.div>
                  ) : activeGame === "vibecheck" ? (
                    <motion.div key="vibecheck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                      <button onClick={() => setActiveGame("menu")}
                        className="flex items-center gap-1 text-[9px] text-white/30 hover:text-white/60 transition-colors mb-2">
                        <Home size={9} /> MENU
                      </button>
                      <VibeCheck onDone={r => { setVibeResult(r); handleScore("vibecheck", 500); }} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* ── CONTROLS ── */}
            <div className="px-6 pt-4 pb-6 flex flex-col gap-3">
              {/* Center pills + power */}
              <div className="flex items-center justify-center gap-4">
                {["SEL", "STR"].map((lbl, i) => (
                  <button key={lbl}
                    onClick={i === 1 ? () => setIsOn(o => !o) : undefined}
                    className="px-4 h-3 rounded-full transition-all active:scale-95"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      transform: "rotate(-18deg)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  />
                ))}
              </div>

              {/* D-pad + ABXY */}
              <div className="flex items-center justify-between">
                {/* D-pad */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-7 rounded-md" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.04)" }} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center">
                    <div className="w-7 h-full rounded-md" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.04)" }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full" style={{ background: "rgba(0,0,0,0.6)" }} />
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Gamepad2 size={14} className="text-white/20" />
                  </div>
                </div>

                {/* ABXY — neon style */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {[
                    { l: "A", r: -1, d: 0, color: "#00fff0" },
                    { l: "B", r: 0, d: 1, color: "#a855f7" },
                    { l: "X", r: 0, d: -1, color: "#ec4899" },
                    { l: "Y", r: 1, d: 0, color: "#f59e0b" },
                  ].map(({ l, r, d, color }) => (
                    <motion.button key={l}
                      whileTap={{ scale: 0.85 }}
                      className="absolute w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] transition-all"
                      style={{
                        background: color + "18",
                        border: `1.5px solid ${color}40`,
                        color,
                        transform: `translate(${r * 26}px, ${d * 26}px)`,
                        boxShadow: `0 2px 8px ${color}20`,
                      }}
                    >
                      {l}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── RIGHT SIDEBAR (desktop) ── */}
      <aside className="hidden md:flex flex-col justify-between py-4 w-48 flex-shrink-0 text-right">
        <div>
          <p className="text-[9px] font-black text-white/20 tracking-[3px] uppercase mb-4 text-right">HỌC TẬP</p>
          <div className="space-y-2">
            {STUDY_ITEMS.map((item, i) => (
              <motion.div key={i}
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-row-reverse items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 cursor-pointer group transition-all hover:border-white/15"
                style={{ background: item.color + "0d" }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-[10px] font-black text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-wide">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Score card */}
        <div className="rounded-xl p-3 text-left"
          style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.1)" }}>
          <p className="text-[8px] font-black text-yellow-400/50 uppercase tracking-widest mb-1.5">HIGH SCORES</p>
          {GAMES.map(g => (
            <div key={g.id} className="flex items-center justify-between py-0.5">
              <span className="text-[8px] text-white/30">{g.emoji} {g.label}</span>
              <span className="text-[8px] font-black" style={{ color: scores[g.id] ? g.color : "rgba(255,255,255,0.1)" }}>
                {scores[g.id] || "—"}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden flex justify-around bg-white/4 backdrop-blur-md border border-white/8 p-1.5 rounded-2xl flex-shrink-0">
        {[
          { id: "fun"   as NavTab, icon: <Heart size={14} />,       label: "FUN",   color: "#FF0055" },
          { id: "game"  as NavTab, icon: <Gamepad2 size={14} />,    label: "GAME",  color: "#00fff0" },
          { id: "study" as NavTab, icon: <BookOpen size={14} />,    label: "LEARN", color: "#00E676" },
        ].map(btn => (
          <button key={btn.id} onClick={() => setNavTab(btn.id)}
            className="flex-1 flex flex-col items-center py-2 rounded-xl transition-all"
            style={navTab === btn.id
              ? { background: btn.color + "18", color: btn.color }
              : { color: "rgba(255,255,255,0.2)" }
            }
          >
            {btn.icon}
            <span className="text-[8px] font-black mt-0.5 tracking-widest">{btn.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}