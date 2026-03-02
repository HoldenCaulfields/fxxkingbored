import React, { useState } from 'react';
import { 
  Gamepad2, Music, Film, Heart, Joystick, 
  BookOpen, Briefcase, Rocket, Lightbulb, 
  BatteryMedium, Zap, GraduationCap, PartyPopper, Sparkles
} from 'lucide-react';

const Game = () => {
  const [isOn, setIsOn] = useState(true);
  const [currentMode, setCurrentMode] = useState('game');

  const entertainment = [
    { icon: <Film />, label: "Phim Ảnh", color: "bg-[#FF0055]" }, // Hot Pink
    { icon: <Music />, label: "Âm Nhạc", color: "bg-[#7000FF]" }, // Electric Purple
    { icon: <Heart />, label: "Hẹn Hò", color: "bg-[#FF3D00]" }, // Bright Orange
    { icon: <Joystick />, label: "Kho Game", color: "bg-[#00D1FF]" }, // Cyan
  ];

  const productivity = [
    { icon: <BookOpen />, label: "Đọc Sách", color: "bg-[#00E676]" }, // Spring Green
    { icon: <Briefcase />, label: "Làm Việc", color: "bg-[#2979FF]" }, // Royal Blue
    { icon: <Rocket />, label: "Khởi Nghiệp", color: "bg-[#FFC400]" }, // Amber
    { icon: <Lightbulb />, label: "Ý Tưởng", color: "bg-[#F50057]" }, // Rose
  ];

  return (
    // Background chuyển sang Trắng/Xám nhạt với hiệu ứng Grid (lưới) sang trọng
    <div className="h-[100dvh] w-full bg-[#f8f9fa] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] overflow-hidden flex flex-col md:flex-row items-stretch p-3 md:p-6 gap-6 font-sans">
      
      {/* MOBILE NAVBAR: Thiết kế như các phím bấm nổi */}
      <nav className="lg:hidden flex justify-around bg-white/80 backdrop-blur-md border-2 border-black p-1.5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
        {[
          { id: 'fun', icon: <PartyPopper />, label: 'FUN', activeColor: 'bg-[#FF0055]' },
          { id: 'game', icon: <Gamepad2 />, label: 'GAME', activeColor: 'bg-[#2979FF]' },
          { id: 'study', icon: <GraduationCap />, label: 'LEARN', activeColor: 'bg-[#00E676]' }
        ].map((btn) => (
          <button 
            key={btn.id}
            onClick={() => setCurrentMode(btn.id)}
            className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${currentMode === btn.id ? `${btn.activeColor} text-white scale-95 shadow-inner` : 'text-gray-400'}`}
          >
            {btn.icon}
            <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">{btn.label}</span>
          </button>
        ))}
      </nav>

      {/* CỘT TRÁI (Desktop): Các thẻ màu sắc nổi bật trên nền trắng */}
      <aside className="hidden lg:flex flex-col justify-center gap-5 w-72">
        <h3 className="text-3xl font-black italic text-black mb-2 flex items-center gap-2">
          <Sparkles className="text-[#FF0055]" /> ĂN CHƠI
        </h3>
        {entertainment.map((item, i) => (
          <div key={i} className={`flex items-center gap-4 p-4 ${item.color} text-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 transition-transform cursor-pointer font-bold italic`}>
            {item.icon} <span className="uppercase tracking-wide">{item.label}</span>
          </div>
        ))}
      </aside>

      {/* TRUNG TÂM: MÁY CHƠI GAME ĐỎ RỰC RỠ */}
      <main className="flex-grow flex items-center justify-center relative min-h-0">
        <div className="relative w-full max-w-sm h-full max-h-[720px] md:max-h-[820px] bg-[#E11D48] rounded-[3.5rem] p-6 shadow-[25px_25px_60px_-15px_rgba(0,0,0,0.3)] border-b-[12px] border-r-[12px] border-[#9F1239] flex flex-col">
          
          {/* Top Detail */}
          <div className="flex justify-between items-center mb-5 px-4 text-white">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full border border-white/20 ${isOn ? 'bg-[#00FF66] shadow-[0_0_15px_#00FF66]' : 'bg-[#1e1e1e]'}`}></div>
              <span className="font-black italic text-xl tracking-widest uppercase">G-BOY</span>
            </div>
            <BatteryMedium size={22} className="opacity-80" />
          </div>

          {/* MÀN HÌNH: Đen sâu, nội dung phát sáng (Cyberpunk vibe) */}
          <div className="flex-grow bg-[#0F172A] p-4 rounded-[2rem] border-4 border-[#9F1239] shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative">
            <div className={`flex-grow rounded-xl transition-all duration-700 relative flex flex-col overflow-hidden
                            ${isOn ? 'bg-[#1E293B]' : 'bg-black'}`}>
              
              {isOn ? (
                <div className="h-full flex flex-col p-4">
                  {/* Header màn hình */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-cyan-400 mb-4 tracking-tighter">
                    <span className="animate-pulse">● SYSTEM LIVE</span>
                    <span>13:45 PM</span>
                  </div>

                  {/* Nội dung chính linh hoạt */}
                  <div className="flex-grow flex flex-col items-center justify-center">
                    {currentMode === 'game' && (
                      <div className="text-center group">
                        <div className="relative inline-block">
                           <Joystick size={60} className="text-yellow-400 mb-4 animate-[bounce_2s_infinite]" />
                           <Zap size={24} className="absolute -top-2 -right-2 text-white animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-white italic tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">READY?</h2>
                        <div className="mt-4 px-6 py-2 bg-blue-600 text-white font-black rounded-full text-xs shadow-lg shadow-blue-500/50 cursor-pointer hover:bg-blue-400">PUSH START</div>
                      </div>
                    )}
                    
                    {currentMode === 'fun' && (
                       <div className="w-full space-y-3">
                          <p className="text-white font-black text-xs border-l-4 border-pink-500 pl-2 italic">RECOMMENDED</p>
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                             <div className="text-pink-400 font-black text-xs">CYBERPUNK 2077</div>
                             <div className="text-[10px] text-gray-400">Trending Cinema</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                             <div className="text-purple-400 font-black text-xs">LO-FI BEATS</div>
                             <div className="text-[10px] text-gray-400">Current Playlist</div>
                          </div>
                       </div>
                    )}

                    {currentMode === 'study' && (
                       <div className="w-full">
                          <div className="bg-green-500/20 p-4 rounded-xl border border-green-500/30 text-green-400">
                             <BookOpen size={24} className="mb-2" />
                             <div className="font-black text-lg">LEVEL UP</div>
                             <div className="text-[10px] opacity-80 uppercase font-bold">Next: Advanced React Patterns</div>
                             <div className="mt-2 w-full bg-gray-700 h-1.5 rounded-full">
                                <div className="bg-green-400 h-full w-[65%] rounded-full shadow-[0_0_8px_#4ade80]"></div>
                             </div>
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                   <div className="w-12 h-1 bg-white/5 animate-pulse rounded-full"></div>
                </div>
              )}
              
              {/* Lớp bóng kính cường lực */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
            </div>
          </div>

          {/* CỤM ĐIỀU KHIỂN: Màu Đen & Xanh Dương */}
          <div className="mt-8 mb-4 px-2">
            <div className="flex justify-between items-center">
              {/* D-Pad: Hiện đại hơn */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute w-full h-8 bg-[#1e1e1e] rounded-md shadow-lg border border-white/5"></div>
                <div className="absolute h-full w-8 bg-[#1e1e1e] rounded-md shadow-lg border border-white/5"></div>
                <div className="z-10 w-8 h-8 bg-[#121212] rounded-full shadow-inner border border-white/10"></div>
              </div>

              {/* Action Buttons: Blue Neon */}
              <div className="flex gap-5 rotate-[-10deg]">
                <div className="flex flex-col items-center">
                  <button className="w-14 h-14 bg-[#2979FF] rounded-full border-b-4 border-[#1565C0] active:translate-y-1 active:border-0 shadow-[0_10px_20px_rgba(41,121,255,0.4)] text-white font-black text-xl flex items-center justify-center">B</button>
                </div>
                <div className="flex flex-col items-center translate-y-[-10px]">
                  <button className="w-14 h-14 bg-[#2979FF] rounded-full border-b-4 border-[#1565C0] active:translate-y-1 active:border-0 shadow-[0_10px_20px_rgba(41,121,255,0.4)] text-white font-black text-xl flex items-center justify-center">A</button>
                </div>
              </div>
            </div>

            {/* Start/Select: Pill buttons */}
            <div className="flex justify-center gap-8 mt-8">
              <button className="w-14 h-4 bg-[#1e1e1e] rounded-full rotate-[-20deg] border-t border-white/10 shadow-lg active:scale-95 transition-transform"></button>
              <button 
                onClick={() => setIsOn(!isOn)}
                className="w-14 h-4 bg-[#1e1e1e] rounded-full rotate-[-20deg] border-t border-white/10 shadow-lg active:scale-95 transition-transform"
              ></button>
            </div>
          </div>
        </div>
      </main>

      {/* CỘT PHẢI (Desktop) */}
      <aside className="hidden lg:flex flex-col justify-center gap-5 w-72 text-right">
        <h3 className="text-3xl font-black italic text-black mb-2 flex flex-row-reverse items-center gap-2">
          <GraduationCap className="text-[#00E676]" /> HỌC TẬP
        </h3>
        {productivity.map((item, i) => (
          <div key={i} className={`flex flex-row-reverse items-center gap-4 p-4 ${item.color} text-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-2 transition-transform cursor-pointer font-bold italic`}>
            {item.icon} <span className="uppercase tracking-wide">{item.label}</span>
          </div>
        ))}
      </aside>

    </div>
  );
};

export default Game;