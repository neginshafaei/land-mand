import SectionTitle from "./SectionTitle";
import {
  formatCoins,
  formatIncomePerSecond,
  getEffectiveIncome,
  rarityMeta,
} from "./uiData";

export default function LandMap({ lands, activeUserId }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/6 p-4 shadow-2xl">
      <SectionTitle
        eyebrow="World Map"
        title="Territory view"
        meta={`${lands.length || 0} plots`}
      />
      <div
        className="grid grid-cols-5 gap-2 rounded-lg border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(82,210,115,0.12),transparent_28%),radial-gradient(circle_at_78%_60%,rgba(245,165,36,0.12),transparent_32%),rgba(5,8,10,0.64)] p-3 sm:grid-cols-8 lg:grid-cols-10"
        aria-label="Land map preview"
      >
        {lands.slice(0, 100).map((land) => {
          const mine = String(land.owner_id) === String(activeUserId);
          const meta = rarityMeta[land.rarity] || rarityMeta.Common;
          const effectiveIncome = getEffectiveIncome(land);

          return (
            <LandTile
              effectiveIncome={effectiveIncome}
              key={land.id || `${land.x}-${land.y}`}
              land={land}
              meta={meta}
              mine={mine}
            />
          );
        })}
      </div>
    </section>
  );
}

function LandTile({ effectiveIncome, land, meta, mine }) {
  const tileClass = getTileClass({ mine, forSale: land.for_sale });

  return (
    <article
      className={tileClass}
      style={{
        "--tile-color": meta.color,
        "--tile-glow": meta.glow,
      }}
      title={`${land.rarity} (${land.x}, ${land.y})`}
    >
      <span className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full bg-(--tile-color) shadow-[0_0_12px_var(--tile-color)]" />
      <span className="absolute right-1.5 top-1.5 font-mono text-[9px] font-black text-white/45">
        {land.x},{land.y}
      </span>

      {mine ? (
        <>
          <span className="coinPulse" />
          <span className="absolute bottom-1.5 left-1.5 right-1.5 rounded bg-black/50 px-1 py-1 text-center text-[9px] text-amber-100 shadow-sm">
            +{formatIncomePerSecond(effectiveIncome)}
          </span>
        </>
      ) : null}

      {land.for_sale && !mine ? (
        <span className="absolute bottom-1.5 left-1.5 right-1.5 rounded bg-amber-300/90 px-1 py-0.5 text-center text-[9px] font-black text-black">
          {formatCoins(land.sale_price)}
        </span>
      ) : null}
    </article>
  );
}

function getTileClass({ mine, forSale }) {
  const base =
    "relative aspect-square min-h-14 overflow-hidden rounded-lg border shadow-[0_0_14px_var(--tile-glow)] transition hover:-translate-y-0.5 hover:brightness-110 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--tile-color),#f4f0e8_24%),color-mix(in_srgb,var(--tile-color),#111_72%))] border-[color-mix(in_srgb,var(--tile-color),transparent_42%)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.24),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)] before:content-['']";

  if (mine) return `${base} ring-2 ring-emerald-300/60`;
  if (forSale) return `${base} outline outline-2 -outline-offset-2 outline-amber-400`;

  return "relative aspect-square min-h-14 overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] transition hover:-translate-y-0.5 hover:bg-white/10";
}
