const Icons = {
  Owned: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Open: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
  Listings: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  Burn: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.99 7.99 0 01-2.343 5.657z" /></svg>
};

function StatCard({ label, value, colorClass, icon: Icon }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 p-4 transition-all hover:bg-slate-900/60">
      {/* Decorative background glow */}
      <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10 blur-2xl ${colorClass}`} />
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ${colorClass.replace('bg-', 'text-')}`}>
          <Icon />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <strong className="text-2xl font-black tracking-tight text-white">
          {value}
        </strong>
      </div>
      
      {/* Subtle bottom accent line */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-current transition-all duration-500 group-hover:w-full opacity-50 ${colorClass.replace('bg-', 'text-')}`} />
    </article>
  );
}

export default function StatStrip({ ownedCount, availableCount, listingCount }) {
  return (
    <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard 
        label="Owned" 
        value={ownedCount} 
        icon={Icons.Owned} 
        colorClass="bg-blue-400" 
      />
      <StatCard 
        label="Available" 
        value={availableCount} 
        icon={Icons.Open} 
        colorClass="bg-slate-400" 
      />
      <StatCard 
        label="Listings" 
        value={listingCount} 
        icon={Icons.Listings} 
        colorClass="bg-emerald-400" 
      />
      <StatCard 
        label="Burn Fee" 
        value="5%" 
        icon={Icons.Burn} 
        colorClass="bg-amber-500" 
      />
    </section>
  );
}