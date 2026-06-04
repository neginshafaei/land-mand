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
    <section className="rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-2xl">
      <SectionTitle eyebrow="Portfolio" title="Your lands" meta={`${hourlyIncome}/h`} />
      <div className="grid gap-3">
        {lands.slice(0, 8).map((land) => (
          <LandCard
            busy={busy}
            key={land.id}
            land={land}
            lastClaim={lastClaim}
            onCancelListing={onCancelListing}
            onList={onList}
            onUpgrade={onUpgrade}
          />
        ))}
        {lands.length === 0 ? (
          <p className="m-0 rounded-lg border border-dashed border-white/15 p-4 text-slate-400">
            No owned lands yet.
          </p>
        ) : null}
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
    <article className="grid grid-cols-[5px_1fr] gap-3 overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-3">
      <div className="rounded-full" style={{ background: meta.color }} />
      <div>
        <div className="flex items-center justify-between gap-3">
          <strong className="text-stone-50">{land.rarity}</strong>
          <span className="font-mono text-xs text-slate-400">
            {land.x}, {land.y}
          </span>
        </div>
        <div className="my-3 rounded-lg border border-emerald-300/15 bg-black/20 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase text-emerald-300">
              Coin production
            </span>
            <strong className="text-lg text-amber-200">
              +{effectiveIncome}/h
            </strong>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-300"
              style={{ width: `${productionWidth}%` }}
            />
          </div>
          <div className="mt-2 grid gap-1 text-xs text-slate-300 sm:grid-cols-3">
            <span>Base: {land.income_per_hour}/h</span>
            <span>Level: x{multiplier.toFixed(1)}</span>
            <span>Unclaimed: {formatCoins(pendingIncome)}</span>
          </div>
        </div>
        {land.for_sale ? (
          <p className="mb-2 mt-0 rounded border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-sm font-bold text-amber-100">
            Listed for {land.sale_price} Coins
          </p>
        ) : null}
        <div className="flex items-center gap-2.5">
          <button
            className="min-h-8 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-55"
            disabled={busy}
            onClick={() => onUpgrade(land.id)}
          >
            Upgrade
          </button>
          {land.for_sale ? (
            <button
              className="min-h-8 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-55"
              disabled={busy}
              onClick={() => onCancelListing(land.id)}
            >
              Cancel
            </button>
          ) : (
            <button
              className="min-h-8 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-55"
              disabled={busy}
              onClick={() => onList(land.id)}
            >
              Sell
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
