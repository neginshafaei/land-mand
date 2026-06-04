export default function StatusBanner({ error, message }) {
  if (!error && !message) return null;

  return (
    <>
      {error ? (
        <p className="mb-4 rounded-lg border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-rose-100">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mb-4 rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-emerald-100">
          {message}
        </p>
      ) : null}
    </>
  );
}
