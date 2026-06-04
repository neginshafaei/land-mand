export default function SectionTitle({ eyebrow, title, meta }) {
  return (
    <div className="mb-3.5 flex items-end justify-between gap-3">
      <div>
        <span className="text-xs font-black uppercase text-emerald-300">
          {eyebrow}
        </span>
        <h2 className="mt-0.5 text-[22px] font-black text-stone-50">{title}</h2>
      </div>
      {meta ? <small className="text-slate-400">{meta}</small> : null}
    </div>
  );
}
