import SectionTitle from "./SectionTitle";
import { formatCoins, rarityMeta } from "./uiData";

export default function MarketplacePanel({ activeUserId, busy, lands, onBuy }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/6 p-4 shadow-2xl">
      <SectionTitle
        eyebrow="Marketplace"
        title="Live listings"
        meta="95% seller payout"
      />
      <div className="grid gap-3">
        {lands.slice(0, 6).map((land) => (
          <MarketRow
            activeUserId={activeUserId}
            busy={busy}
            key={land.id}
            land={land}
            onBuy={onBuy}
          />
        ))}
        {lands.length === 0 ? (
          <p className="m-0 rounded-lg border border-dashed border-white/15 p-4 text-slate-400">
            No marketplace listings.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function MarketRow({ activeUserId, busy, land, onBuy }) {
  const meta = rarityMeta[land.rarity] || rarityMeta.Common;
  const isMine = String(land.owner_id) === String(activeUserId);

  return (
    <article className="grid items-center gap-2.5 rounded-lg border border-white/10 bg-white/5.5 p-3 grid-cols-[10px_1fr_auto_auto] max-sm:grid-cols-[10px_1fr_auto]">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: meta.color }}
      />
      <div className="grid gap-0.5">
        <strong className="text-stone-50">{land.rarity}</strong>
        <small className="text-slate-400">
          L{land.level} | {land.income_per_hour}/h
        </small>
      </div>
      <span className="font-black text-stone-50">{formatCoins(land.sale_price)}</span>
      <button
        className="min-h-8 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-55 max-sm:col-span-2 max-sm:col-start-2"
        disabled={busy || isMine}
        onClick={() => onBuy(land.id)}
      >
        {isMine ? "Yours" : "Buy"}
      </button>
    </article>
  );
}
