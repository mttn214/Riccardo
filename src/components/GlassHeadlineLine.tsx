export function GlassHeadlineLine({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span
      className={`glass-brand-text relative block w-fit max-w-full ${className}`}
      onPointerMove={(event) => {
        const line = event.currentTarget;
        const bounds = line.getBoundingClientRect();
        line.style.setProperty('--brand-x', `${event.clientX - bounds.left}px`);
        line.style.setProperty('--brand-y', `${event.clientY - bounds.top}px`);
      }}
    >
      {children}
      <span aria-hidden="true" className="glass-brand-highlight pointer-events-none absolute inset-0">
        <span>{children}</span>
      </span>
    </span>
  );
}
