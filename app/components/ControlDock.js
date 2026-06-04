const dockButton =
  "grid min-h-16 justify-items-start gap-0.5 rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-left font-black text-white transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55";

import { formatCoins } from "./uiData";

export default function ControlDock({
  busy,
  pendingIncome,
  userData,
  onDiscover,
  onClaim,
}) {
  return (
    <section
      className="my-4 grid gap-2.5 rounded-lg border border-white/10 bg-black/35 p-2.5 md:grid-cols-3"
      aria-label="Economy actions"
    >
      <button
        className={dockButton}
        disabled={busy || !userData}
        onClick={() => onDiscover(100)}
      >
        <span className="text-xs text-slate-400">Discover</span>
        <strong className="text-lg">100</strong>
      </button>
      <button
        className={`${dockButton} bg-[linear-gradient(135deg,rgba(245,165,36,0.18),rgba(185,112,255,0.14))]`}
        disabled={busy || !userData}
        onClick={() => onDiscover(500)}
      >
        <span className="text-xs text-slate-400">Premium</span>
        <strong className="text-lg">500</strong>
      </button>
      <button className={dockButton} disabled={busy || !userData} onClick={onClaim}>
        <span className="text-xs text-slate-400">Claim</span>
        <strong className="text-lg">{formatCoins(pendingIncome)} Coins</strong>
      </button>
    </section>
  );
}
