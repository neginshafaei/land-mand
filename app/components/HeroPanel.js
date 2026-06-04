import { formatCoins } from "./uiData";

export default function HeroPanel({ userData, hourlyIncome }) {
  return (
    <section className="relative grid gap-5 overflow-hidden rounded-lg border border-white/10 bg-[#1f232c]/95 p-6 shadow-2xl md:grid-cols-[1fr_minmax(240px,320px)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(32,183,232,0.18),transparent_42%),linear-gradient(310deg,rgba(82,210,115,0.16),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(90deg,transparent,black_42%,transparent)]" />

      <div className="relative z-10">
        <span className="text-xs font-black uppercase text-emerald-300">
          Land Mand Economy
        </span>
        <h1 className="mt-2 max-w-3xl text-[34px] font-black leading-none text-stone-50 md:text-[58px]">
          Build a land empire that can survive inflation.
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-7 text-stone-300">
          Discover scarce plots, claim hourly income, upgrade strong lands, and
          trade through a marketplace with a burn fee.
        </p>
      </div>

      <div className="relative z-10 grid content-center gap-2 rounded-lg border border-white/10 bg-black/30 p-5">
        <span className="text-xs font-black uppercase text-emerald-300">
          Balance
        </span>
        <strong className="text-3xl font-black text-amber-200">
          {formatCoins(userData?.balance)} Coins
        </strong>
        <small className="text-slate-400">{hourlyIncome}/h production</small>
      </div>
    </section>
  );
}
