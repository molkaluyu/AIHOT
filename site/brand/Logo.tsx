// 站点字标：货箱加一截缆绳，强调色跟主题的航标琥珀走。页面上的站名是 FreightWire。
// size 是高度，单位像素。有自己的图形时保持 Wordmark 的参数不变。RingMark 是加载用的圆环。
const WORDMARK = "FreightWire";

export function Wordmark({ size = 24, className = "", title = WORDMARK }: { size?: number; className?: string; title?: string }) {
  return (
    <span className={`inline-flex items-center font-black leading-none tracking-[-0.04em] ${className}`} style={{ fontSize: Math.round(size * 0.92) }} aria-label={title} role="img">
      <svg viewBox="0 0 28 24" className="mr-[0.28em] h-[0.78em] w-[0.92em] shrink-0" aria-hidden="true">
        <rect x="0.5" y="1" width="15" height="22" rx="1.6" className="fill-current" />
        <rect x="12.25" y="9.25" width="15.25" height="5.5" rx="1.1" className="fill-accent" />
      </svg>
      <span aria-hidden="true">{WORDMARK}</span>
    </span>
  );
}

/** A ring with a dot; spinning, it is the loader. */
export function RingMark({ className = "", spinning = false }: { className?: string; spinning?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g style={spinning ? { transformOrigin: "12px 12px", animation: "spin-slow 1.1s linear infinite" } : undefined}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="42 15" />
      </g>
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </svg>
  );
}
