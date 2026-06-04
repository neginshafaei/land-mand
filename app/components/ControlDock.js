import { formatCoins } from "./uiData";

export default function ControlDock({
  busy,
  pendingIncome,
  userData,
  onDiscover,
  onClaim,
}) {
  const isClaimable = pendingIncome > 0;

  return (
    <section
      className="my-6 grid gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-3 shadow-2xl backdrop-blur-md md:grid-cols-3"
      aria-label="Economy actions"
    >
      {/* Basic Discover */}
      <button
        disabled={busy || !userData}
        onClick={() => onDiscover(100)}
        className="group relative flex flex-col items-start gap-1 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-40"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300">
          Basic Scout
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-white">100</span>
          <span className="text-xs font-bold text-slate-400">Coins</span>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute -bottom-2 -right-2 text-white/3 transition-transform group-hover:scale-110">
           <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>
      </button>

      {/* Premium Discover */}
      <button
        disabled={busy || !userData}
        onClick={() => onDiscover(500)}
        className="group relative flex flex-col items-start gap-1 overflow-hidden rounded-xl border border-purple-500/30 bg-linear-to-br from-purple-600/20 to-blue-600/10 p-4 transition-all hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] active:scale-95 disabled:opacity-40"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">
          Premium Expedition
        </span>
        <div className="flex items-center gap-2 text-purple-100">
          <span className="text-xl font-black">500</span>
          <span className="text-xs font-bold opacity-70">Coins</span>
        </div>
        {/* Sparkle decoration */}
        <div className="absolute right-3 top-3 animate-pulse text-purple-400/40">
           <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3-3-8z"/></svg>
        </div>
      </button>

      {/* Claim Button - The most important action */}
      <button
        disabled={busy || !userData || !isClaimable}
        onClick={onClaim}
        className={`group relative flex flex-col items-start gap-1 overflow-hidden rounded-xl p-4 transition-all active:scale-95 disabled:opacity-40 ${
          isClaimable 
          ? "border-emerald-500/50 bg-emerald-500 hover:bg-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.3)]" 
          : "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
        }`}
      >
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isClaimable ? "text-emerald-900" : "text-slate-500"}`}>
          Harvest Revenue
        </span>
        <div className="flex items-center gap-2">
          <strong className={`text-xl font-black ${isClaimable ? "text-slate-950" : "text-slate-400"}`}>
            {formatCoins(pendingIncome)}
          </strong>
          {isClaimable && (
             <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold text-slate-900">READY</span>
          )}
        </div>
        
        {/* Coin decoration */}
        <div className={`absolute -bottom-1 -right-1 transition-transform group-hover:rotate-12 ${isClaimable ? "text-black/10" : "text-white/5"}`}>
            <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.39 2.1-1.39 1.47 0 2.01.59 2.06 1.47h1.73c-.07-1.72-1.1-2.43-2.48-2.72V5h-2v1.81c-1.51.35-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.74-2.28-1.57H8.25c.08 1.89 1.38 2.62 2.75 2.94V19h2v-1.84c1.55-.37 2.75-1.29 2.75-2.79 0-2.21-1.89-2.88-3.69-3.33z"/></svg>
        </div>
      </button>
    </section>
  );
}