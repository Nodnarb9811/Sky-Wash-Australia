/** Sky Wash mark — stylised quad drone + water droplet. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Sky Wash Australia logo">
      <g fill="none" stroke="var(--c-cyan)" strokeWidth="2" strokeLinecap="round">
        <line x1="9" y1="9" x2="23" y2="23" />
        <line x1="23" y1="9" x2="9" y2="23" />
        <circle cx="9" cy="9" r="2.2" />
        <circle cx="23" cy="9" r="2.2" />
        <circle cx="9" cy="23" r="2.2" />
        <circle cx="23" cy="23" r="2.2" />
      </g>
      <path d="M16 13c2.2 2.6 3.4 4.4 3.4 6a3.4 3.4 0 1 1-6.8 0c0-1.6 1.2-3.4 3.4-6z" fill="var(--c-paper)" />
    </svg>
  );
}
