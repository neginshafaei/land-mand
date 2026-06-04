import SectionTitle from "./SectionTitle";
import {
  formatCoins,
  formatIncomePerSecond,
  getEffectiveIncome,
  rarityMeta,
} from "./uiData";

export default function LandMap({ lands, activeUserId }) {
  const ownedLands = lands.filter(
    (land) => String(land.owner_id) === String(activeUserId)
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-md">
      <SectionTitle
        eyebrow="Geography"
        title="Territory Map"
        meta={`${ownedLands.length || 0} Plots Owned`}
      />
      
      {/* Grid Container with a subtle "Radar" background effect */}
      <div
        className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-white/5 bg-black/40 p-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      >
        {ownedLands.length > 0 ? (
          ownedLands.map((land) => {
            const meta = rarityMeta[land.rarity] || rarityMeta.Common;
            const effectiveIncome = getEffectiveIncome(land);

            return (
              <LandTile
                effectiveIncome={effectiveIncome}
                key={land.id || `${land.x}-${land.y}`}
                land={land}
                meta={meta}
              />
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="mb-2 h-12 w-12 rounded-full border-2 border-dashed border-white/10" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">No Territory</p>
          </div>
        )}
      </div>
    </section>
  );
}

function LandTile({ effectiveIncome, land, meta }) {
  return (
    <article
      className={`group relative aspect-square overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl 
        ${land.for_sale 
          ? "border-amber-500/50 ring-2 ring-amber-500/20" 
          : "border-white/10 hover:border-white/30"}`}
      style={{
        background: `linear-gradient(135deg, ${meta.color}22 0%, #0f172a 100%)`,
      }}
    >
      {/* Coordinate Tag - Top Right */}
      <div className="absolute right-1.5 top-1.5 z-10 font-mono text-[8px] font-bold text-slate-500 transition-colors group-hover:text-white">
        {land.x}:{land.y}
      </div>

      {/* Rarity Indicator Dot - Top Left */}
      <div 
        className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentcolor]"
        style={{ color: meta.color, backgroundColor: 'currentColor' }}
      />

      {/* Main Content Area */}
      <div className="flex h-full flex-col items-center justify-center pt-2">
        <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 group-hover:text-white/80">
          {land.rarity}
        </span>
        
        {/* The "Value" bubble */}
        <div className="mt-1 flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
          <span className="text-[10px] font-mono font-bold text-emerald-400">
            +{formatIncomePerSecond(effectiveIncome)}
          </span>
        </div>
      </div>

      {/* Sale Overlay (Footer style) */}
      {land.for_sale && (
        <div className="absolute bottom-0 w-full bg-amber-500 py-1 text-center">
          <p className="text-[8px] font-black uppercase text-amber-950">
            {land.sale_price}
          </p>
        </div>
      )}

      {/* Subtle "Glass" Shine effect */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100" />
    </article>
  );
}