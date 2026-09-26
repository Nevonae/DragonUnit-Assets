export default function Loading() {
  return (
    <main
      className="grid min-h-[60vh] flex-1 place-items-center px-6 py-16"
      role="status"
      aria-live="polite"
      aria-label="Loading DragonUnit Assets"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid size-16 place-items-center">
          <span className="loading-ring absolute inset-0 rounded-full border-2 border-[#8B5CF6]/20 border-t-[#A78BFA]" />
          <span className="loading-core grid size-10 place-items-center rounded-xl border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-sm font-bold text-[#C4B5FD]">
            DU
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#F5F7FA]">
            DRAGONUNIT
          </p>
          <p className="mt-1 text-xs text-[#9AA1AE]">Loading assets...</p>
        </div>
      </div>
    </main>
  );
}
