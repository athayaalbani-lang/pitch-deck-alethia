import React from "react";

export type ProductSection = "dashboard" | "training" | "reports" | "insights" | "profile";

const navigation: Array<{ key: ProductSection; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "training", label: "Training" },
  { key: "reports", label: "Reports" },
  { key: "insights", label: "Insights" },
  { key: "profile", label: "Profile" },
];

export function AlethiaScreen({
  active,
  children,
  footer = "ALETHIA · HUMAN-CENTRED SECURITY PRACTICE",
}: {
  active: ProductSection;
  children: React.ReactNode;
  footer?: string;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#050b14] p-2 @xl:p-5 font-body text-[#e6edf4]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 16% 0%, rgba(166,232,107,.07), transparent 36%), radial-gradient(ellipse at 90% 100%, rgba(48,83,112,.15), transparent 42%)",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1880px] flex-col overflow-hidden border border-[#1b3550] bg-[#091321]/95 shadow-[0_28px_100px_rgba(0,0,0,.48),inset_0_1px_0_rgba(230,237,244,.04)]">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#1b3550] bg-[#091321]/90 px-4 py-2.5 @xl:px-10 @xl:py-5">
          <div className="flex items-center gap-2.5 @xl:gap-4">
            <span aria-hidden="true" className="grid h-8 w-8 @xl:h-12 @xl:w-12 place-items-center border border-[#a6e86b]/50 bg-[#a6e86b]/[.08] font-mono text-xs @xl:text-xl font-bold text-[#a6e86b] shadow-[0_0_22px_rgba(166,232,107,.12)]">A_</span>
            <span className="font-mono text-[10px] @xl:text-base font-bold tracking-[.22em]">ALETHIA</span>
          </div>
          <nav aria-label="Primary navigation" className="hidden items-center gap-1 @xl:flex">
            {navigation.map((item) => (
              <span
                aria-current={active === item.key ? "page" : undefined}
                className={`relative px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[.09em] transition-colors ${active === item.key ? "font-bold text-[#a6e86b]" : "text-[#8da0b4]"}`}
                key={item.key}
              >
                {item.label}
                {active === item.key ? <span className="absolute inset-x-3.5 -bottom-[21px] h-[2px] bg-[#a6e86b] shadow-[0_0_10px_rgba(166,232,107,.5)]" /> : null}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-2.5 @xl:gap-4 font-mono text-[8px] @xl:text-[11px] text-[#9ba8b6]">
            <span className="border border-[#1b3550] bg-[#050b14]/60 px-2 py-1 @xl:px-3 @xl:py-2">EN</span>
            <span className="grid h-6 w-6 @xl:h-9 @xl:w-9 place-items-center rounded-full border border-[#a6e86b]/35 bg-[#12243a] text-[#a6e86b]">U</span>
          </div>
        </header>
        <main className="relative min-h-0 flex-1 overflow-hidden px-4 py-4 @xl:px-12 @xl:py-8">{children}</main>
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#1b3550] bg-[#050b14]/65 px-4 py-2 @xl:px-10 @xl:py-3 font-mono text-[7px] @xl:text-[10px] tracking-[.08em] text-[#71869a]">
          <span>{footer}</span>
          <span className="text-[#a6e86b]/75">WEB PROTOTYPE</span>
        </footer>
      </div>
    </div>
  );
}

export function ProductPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#1b3550] pb-3 @xl:pb-6">
      <div className="border-l-2 border-[#a6e86b] pl-3 @xl:pl-5">
        <h1 className="text-2xl @xl:text-[44px] font-bold tracking-[-.04em] text-[#e6edf4]">{title}</h1>
        {description ? <p className="mt-1.5 @xl:mt-2 max-w-4xl text-[10px] @xl:text-[15px] leading-relaxed text-[#8da0b4]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function ProductPanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-[#1b3550] border-t-[#a6e86b]/25 bg-gradient-to-br from-[#0d1a2b] via-[#091321] to-[#07101c] p-3 @xl:p-5 shadow-[inset_0_1px_0_rgba(230,237,244,.035),0_12px_28px_rgba(0,0,0,.16)] ${className}`}>
      {title ? <h2 className="mb-2.5 @xl:mb-4 font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.14em] text-[#a6e86b]">{title}</h2> : null}
      {children}
    </section>
  );
}

export function ProductPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "signal" | "warning" }) {
  const toneClass = tone === "signal"
      ? "border-[#a6e86b]/45 bg-[#a6e86b]/[.08] text-[#a6e86b]"
      : tone === "warning"
        ? "border-[#edbd67]/40 bg-[#edbd67]/[.07] text-[#edbd67]"
        : "border-[#1b3550] bg-[#050b14]/55 text-[#9aadc0]";
  return <span className={`inline-flex items-center border px-2 py-1 @xl:px-3 @xl:py-1.5 font-mono text-[7px] @xl:text-[10px] uppercase tracking-[.08em] ${toneClass}`}>{children}</span>;
}

export function ProductButton({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex min-h-7 @xl:min-h-10 items-center border border-[#a6e86b]/60 bg-[#a6e86b] px-3 @xl:px-5 font-mono text-[8px] @xl:text-[11px] font-bold uppercase tracking-[.08em] text-[#111a12]">{children}</span>;
}

export function ProductMetric({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="relative min-w-0 overflow-hidden border border-[#1b3550] bg-[#07101c] px-3 py-2.5 @xl:px-5 @xl:py-4 shadow-[inset_0_1px_0_rgba(230,237,244,.035)]">
      <span aria-hidden="true" className="absolute right-0 top-0 h-12 w-12 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#a6e86b]/[.07] blur-xl" />
      <dt className="relative font-mono text-[8px] @xl:text-[11px] uppercase tracking-[.12em] text-[#8da0b4]">{label}</dt>
      <dd className="relative mt-1 font-mono text-lg @xl:text-[28px] font-bold tabular-nums text-[#e6edf4]">{value}</dd>
      {note ? <p className="relative mt-1 font-mono text-[7px] @xl:text-[10px] text-[#74899e]">{note}</p> : null}
    </div>
  );
}
