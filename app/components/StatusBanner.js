"use client";
import { useEffect, useState } from "react";

export default function StatusBanner({ error, message }) {
  const content = error || message;
  const isError = !!error;

  // If there's no content, don't even mount the Toast
  if (!content) return null;

  // We use key={content} so that every time a new message appears,
  // the Toast component remounts and restarts its internal logic.
  return <Toast key={content} content={content} isError={isError} />;
}

function Toast({ content, isError }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1. Trigger the "Slide In" animation slightly after mount
    // to avoid the "cascading render" warning.
    const entryTimer = setTimeout(() => setVisible(true), 10);

    // 2. Trigger the "Slide Out" animation before the component is cleared
    const exitTimer = setTimeout(() => setVisible(false), 3700);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div
      className={`fixed top-6 left-1/2 z-100 w-[90%] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl p-4 shadow-2xl ${
          isError
            ? "border-red-500/50 bg-red-950/80 text-red-200"
            : "border-emerald-500/50 bg-emerald-950/80 text-emerald-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isError ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {isError ? "✕" : "✓"}
          </div>
          <p className="text-sm font-bold leading-tight">{content}</p>
        </div>

        {/* Progress Bar Container */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/5">
          {/* Moving Progress Bar */}
          <div 
            className={`h-full transition-all duration-4000 ease-linear ${
              isError ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: visible ? '100%' : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}