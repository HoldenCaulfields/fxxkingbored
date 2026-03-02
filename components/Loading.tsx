export default function Loading() {
  return (
    <div className="h-full w-full bg-white flex flex-col items-center justify-center gap-5">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-[18px] bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-200" />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">SV</div>
        <div className="absolute -inset-2.5 rounded-[26px] border-2 border-rose-200 border-t-rose-500 animate-spin" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[13px] font-semibold text-slate-500">Đang tải bản đồ…</p>
        <div className="w-16 h-0.5 rounded-full bg-slate-100 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 animate-[shimmer_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
