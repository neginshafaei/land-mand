import SectionTitle from "./SectionTitle";
import {
  formatCoins,
  getEffectiveIncome,
  getLevelMultiplier,
  getPendingLandIncome,
  rarityMeta,
} from "./uiData";

export default function PortfolioPanel({
  busy,
  hourlyIncome,
  lands,
  lastClaim,
  onCancelListing,
  onList,
  onUpgrade,
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/50 backdrop-blur-xl p-6 shadow-2xl">
      <div className="mb-6 flex items-end justify-between">
        <SectionTitle eyebrow="Real Estate" title="Your Holdings" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Yield</span>
          <span className="text-xl font-black text-emerald-400">+{hourlyIncome}<span className="text-sm font-medium opacity-60">/h</span></span>
        </div>
      </div>

      <div className="grid gap-4">
        {lands.length > 0 ? (
          lands.slice(0, 8).map((land) => (
            <LandCard
              busy={busy}
              key={land.id}
              land={land}
              lastClaim={lastClaim}
              onCancelListing={onCancelListing}
              onList={onList}
              onUpgrade={onUpgrade}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-slate-400 text-sm italic">No lands discovered in your portfolio yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function LandCard({ busy, land, lastClaim, onCancelListing, onList, onUpgrade }) {
  const meta = rarityMeta[land.rarity] || rarityMeta.Common;
  const effectiveIncome = getEffectiveIncome(land);
  const multiplier = getLevelMultiplier(land.level);
  const pendingIncome = getPendingLandIncome(land, lastClaim);
  const productionWidth = Math.min(100, Math.max(8, (effectiveIncome / 60) * 100));

  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.06] hover:shadow-lg">
      {/* Rarity Accent Glow */}
      <div 
        className="absolute left-0 top-0 h-full w-[4px] opacity-70"
        style={{ background: meta.color, boxShadow: `2px 0 10px ${meta.color}44` }} 
      />

      <div className="flex flex-col gap-4">
        {/* Top Row: Rarity & Coordinates */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: `${meta.color}33`, color: meta.color, border: `1px solid ${meta.color}44` }}
            >
              {land.rarity}
            </span>
            <span className="text-[10px] font-medium text-slate-500">LVL {land.level}</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">
            LOC: {land.x}, {land.y}
          </span>
        </div>

        {/* Main Stats Area */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{effectiveIncome}</span>
              <span className="text-xs font-bold text-emerald-400">COINS / HR</span>
            </div>
            {/* Progress Bar */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000"
                style={{ width: `${productionWidth}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-black/20 rounded-lg p-2 px-3 border border-white/5">
             <div className="text-center">
                <p className="text-[9px] uppercase text-slate-500 font-bold">Multiplier</p>
                <p className="text-xs font-mono text-slate-200">x{multiplier.toFixed(1)}</p>
             </div>
             <div className="h-6 w-[1px] bg-white/10" />
             <div className="text-right">
                <p className="text-[9px] uppercase text-slate-500 font-bold">Unclaimed</p>
                <p className="text-xs font-mono text-amber-200">{formatCoins(pendingIncome)}</p>
             </div>
          </div>
        </div>

        {/* Sales Status / Actions */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex-1">
            {land.for_sale ? (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                <span className="text-xs font-bold text-amber-200/80">Listed: {land.sale_price} Coins</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold uppercase text-slate-600">Active Production</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={() => onUpgrade(land.id)}
              className="rounded-md bg-white/10 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-white/20 active:scale-95 disabled:opacity-30"
            >
              Upgrade
            </button>
            
            {land.for_sale ? (
              <button
                disabled={busy}
                onClick={() => onCancelListing(land.id)}
                className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-30"
              >
                Cancel
              </button>
            ) : (
              <button
                disabled={busy}
                onClick={() => onList(land.id)}
                className="rounded-md border border-white/10 bg-transparent px-4 py-1.5 text-xs font-bold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-30"
              >
                Sell
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}