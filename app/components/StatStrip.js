function StatCard({ label, value }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/6 p-4 shadow-2xl">
      <span className="text-xs font-black uppercase text-emerald-300">
        {label}
      </span>
      <strong className="mt-2 block text-3xl font-black text-stone-50">
        {value}
      </strong>
    </article>
  );
}

export default function StatStrip({ ownedCount, availableCount, listingCount }) {
  return (
    <section className="mb-4 grid gap-3 md:grid-cols-4">
      <StatCard label="Owned" value={ownedCount} />
      <StatCard label="Open plots" value={availableCount} />
      <StatCard label="Listings" value={listingCount} />
      <StatCard label="Burn fee" value="5%" />
    </section>
  );
}
