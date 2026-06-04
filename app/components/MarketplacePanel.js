import SectionTitle from "./SectionTitle";
import { formatCoins, rarityMeta } from "./uiData";

export default function MarketplacePanel({ activeUserId, busy, lands, onBuy }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <SectionTitle
          eyebrow="Marketplace"
          title="Live Listings"
        />
        <div className="rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
            <span className="text-[10px] font-bold uppercase tracking-tight text-emerald-400">95% seller payout</span>
        </div>
      </div>

      <div className="grid gap-2">
        {lands.length > 0 ? (
          lands.slice(0, 10).map((land) => (
            <MarketRow
              activeUserId={activeUserId}
              busy={busy}
              key={land.id}
              land={land}
              onBuy={onBuy}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-white/10">
            <p className="text-slate-500 text-sm">The market is currently quiet...</p>
          </div>
        )}
      </div>
    </section>
  );
}

function MarketRow({ activeUserId, busy, land, onBuy }) {
  const meta = rarityMeta[land.rarity] || rarityMeta.Common;
  const isMine = String(land.owner_id) === String(activeUserId);

  return (
    <article className="group grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:bg-white/[0.05] hover:border-white/10 max-sm:grid-cols-[auto_1fr_auto]">
      
      {/* 1. Visual Indicator (Rarity Icon) */}
      <div 
        className="flex h-10 w-10 items-center justify-center rounded-lg border shadow-inner"
        style={{ 
            backgroundColor: `${meta.color}15`, 
            borderColor: `${meta.color}33`,
            color: meta.color 
        }}
      >
        <span className="text-xs font-black uppercase tracking-tighter">
            {land.rarity[0]}
        </span>
      </div>

      {/* 2. Land Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{land.rarity}</span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] uppercase text-slate-400">
                Lvl {land.level}
            </span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400/80">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
            <span className="text-xs font-mono">{land.income_per_hour}/h</span>
        </div>
      </div>

      {/* 3. Price */}
      <div className="flex flex-col items-end px-2">
        <span className="text-[10px] font-bold uppercase text-slate-500">Price</span>
        <span className="font-mono text-sm font-bold text-amber-200">
            {formatCoins(land.sale_price)}
        </span>
      </div>

      {/* 4. Action */}
      <div className="max-sm:col-span-full max-sm:mt-2">
        {isMine ? (
          <div className="flex min-h-9 items-center justify-center rounded-lg bg-white/5 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Owned
          </div>
        ) : (
          <button
            disabled={busy}
            onClick={() => onBuy(land.id)}
            className="flex min-h-9 items-center justify-center rounded-lg bg-emerald-500 px-5 text-sm font-black text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 disabled:opacity-30 max-sm:w-full"
          >
            Buy
          </button>
        )}
      </div>
    </article>
  );
}