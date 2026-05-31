export function KickerLabel({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-3 font-display text-kicker uppercase text-cyan">
      <span className="h-px w-8 bg-cyan/60" aria-hidden />
      {children}
    </span>
  );
}
