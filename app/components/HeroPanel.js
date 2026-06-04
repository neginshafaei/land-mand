import { formatCoins } from "./uiData";

export default function HeroPanel({ userData, hourlyIncome }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl md:p-10">
      {/* Dynamic Background Effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(52,211,153,0.15)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(245,158,11,0.1)_0%,transparent_50%)]" />
      
      {/* Animated Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto]">
        
        {/* Left Side: Branding & Empire Status */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              Imperial Command
            </span>
          </div>
          
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            Build your <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">Empire</span>
          </h1>
          
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400 md:text-base">
            Dominate the marketplace by discovering rare plots and optimizing your production chain. Every coordinate is a new opportunity.
          </p>
        </div>

        {/* Right Side: Wealth Hub */}
        <div className="relative">
          {/* Decorative Outer Glow */}
          <div className="absolute inset-0 -m-4 rounded-3xl bg-amber-500/5 blur-3xl" />
          
          <div className="relative flex min-w-70 flex-col gap-6 rounded-2xl border border-white/10 bg-white/3 p-8 backdrop-blur-xl">
            {/* Balance Section */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Available Balance</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-amber-200">
                  {formatCoins(userData?.balance || 0)}
                </span>
                <span className="text-xs font-bold text-amber-500/80 uppercase">Coins</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Stats Footer */}
            <div className="flex items-center justify-between">
               <div>
                  <p className="text-[9px] font-bold uppercase text-slate-500">Hourly Yield</p>
                  <p className="font-mono text-sm font-bold text-emerald-400">+{hourlyIncome}/h</p>
               </div>
               
               <div className="text-right">
                  <p className="text-[9px] font-bold uppercase text-slate-500">Global Rank</p>
                  <p className="font-mono text-sm font-bold text-white">#--</p>
               </div>
            </div>

            {/* "Live" Indicator */}
            <div className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}