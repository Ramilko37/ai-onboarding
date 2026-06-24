import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";

export type MayakTone = "primary" | "secondary" | "accent" | "muted" | "success" | "danger";
export type MayakButtonVariant = "primary" | "secondary" | "ghost";

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

export const mayakSurface = {
  page: "relative h-screen overflow-hidden text-foreground",
  shell: "mx-auto flex h-[calc(100dvh-4rem)] max-w-6xl flex-col overflow-hidden px-4 py-3 sm:px-6 sm:py-4",
  panel:
    "overflow-hidden rounded-3xl border border-border bg-card/80 backdrop-blur-sm shadow-[var(--shadow-card)]",
  interactive:
    "transition hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
  deep:
    "overflow-hidden rounded-3xl border border-deep-border bg-[radial-gradient(70%_90%_at_0%_0%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_60%),var(--deep)] text-deep-foreground shadow-[var(--shadow-soft)]",
} as const;

export const mayakTypography = {
  eyebrow: "font-mono text-[10px] font-semibold uppercase tracking-wider",
  h1: "font-display text-pretty text-2xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-3xl",
  h2: "font-display text-sm font-bold tracking-tight text-foreground",
  body: "text-pretty text-sm font-medium leading-relaxed text-muted-foreground",
  caption: "text-xs font-medium leading-relaxed text-muted-foreground",
} as const;

export const mayakInputClassName =
  "min-h-10 w-full rounded-2xl border border-border bg-card px-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/50";

const badgeTone: Record<MayakTone, string> = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  muted: "bg-muted text-muted-foreground",
  success:
    "bg-[color-mix(in_oklch,oklch(0.62_0.075_130)_22%,transparent)] text-[oklch(0.36_0.065_125)]",
  danger:
    "bg-[color-mix(in_oklch,oklch(0.64_0.13_33)_20%,transparent)] text-[oklch(0.42_0.11_32)]",
};

const iconTone: Record<MayakTone, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  muted: "bg-muted text-muted-foreground",
  success:
    "bg-[color-mix(in_oklch,oklch(0.62_0.075_130)_22%,transparent)] text-[oklch(0.36_0.065_125)]",
  danger:
    "bg-[color-mix(in_oklch,oklch(0.64_0.13_33)_20%,transparent)] text-[oklch(0.42_0.11_32)]",
};

type MayakAmbientBackgroundProps = {
  className?: string;
};

export function MayakAmbientBackground({ className }: MayakAmbientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-background" />
      <div className="animate-aurora absolute -top-32 -left-24 h-[32rem] w-[32rem] rounded-full bg-aurora-1 opacity-60 blur-3xl" />
      <div
        className="animate-aurora absolute top-1/3 -right-24 h-[30rem] w-[30rem] rounded-full bg-aurora-2 opacity-50 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-aurora absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-aurora-3 opacity-40 blur-3xl"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

type MayakShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  topBar?: ReactNode;
};

export function MayakShell({ children, className, contentClassName, topBar }: MayakShellProps) {
  return (
    <div className={cn(mayakSurface.page, className)}>
      <MayakAmbientBackground />
      {topBar}
      <main className={cn(mayakSurface.shell, contentClassName)}>{children}</main>
    </div>
  );
}

type MayakTopBarProps = {
  brand?: string;
  subtitle?: string;
  meta?: ReactNode;
  userName?: string;
  icon?: ReactNode;
  className?: string;
};

export function MayakTopBar({
  brand = "Маяк",
  subtitle,
  meta,
  userName,
  icon,
  className,
}: MayakTopBarProps) {
  const initials = userName?.trim().charAt(0).toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-20 h-16 shrink-0 border-b border-border/70 bg-background/82 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              {icon}
            </span>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-extrabold tracking-tight text-foreground">
              {brand}
            </p>
            {subtitle && (
              <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {meta && (
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground sm:inline-flex">
              {meta}
            </span>
          )}
          {userName && (
            <div className="flex items-center gap-2.5 rounded-full border border-border bg-card/80 py-1 pr-3 pl-1">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground"
                aria-hidden="true"
              >
                {initials}
              </span>
              <span className="hidden text-sm font-bold text-foreground sm:inline">{userName}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

type MayakPanelProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "xs" | "sm" | "md" | "lg";
  variant?: "card" | "deep" | "soft";
  ariaLabel?: string;
};

const panelPadding = {
  none: "",
  xs: "p-3",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-5 sm:p-7",
} as const;

export function MayakPanel({
  children,
  className,
  padding = "md",
  variant = "card",
  ariaLabel,
}: MayakPanelProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        variant === "deep" ? mayakSurface.deep : mayakSurface.panel,
        variant === "soft" && "shadow-none",
        panelPadding[padding],
        className,
      )}
    >
      {children}
    </section>
  );
}

type MayakSectionHeaderProps = {
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function MayakSectionHeader({
  kicker,
  title,
  description,
  className,
  titleClassName,
}: MayakSectionHeaderProps) {
  return (
    <div className={cn("mb-4 space-y-2", className)}>
      {kicker && <MayakKicker>{kicker}</MayakKicker>}
      <h1 className={cn(mayakTypography.h1, titleClassName)}>{title}</h1>
      {description && <p className={cn("max-w-2xl", mayakTypography.body)}>{description}</p>}
    </div>
  );
}

export function MayakKicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-secondary-foreground",
        mayakTypography.eyebrow,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function MayakIconBadge({
  children,
  tone = "secondary",
  className,
}: {
  children: ReactNode;
  tone?: MayakTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
        iconTone[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type MayakSectionTitleProps = {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function MayakSectionTitle({
  icon,
  title,
  description,
  action,
  className,
}: MayakSectionTitleProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        {icon}
        <div className="min-w-0">
          <h2 className={mayakTypography.h2}>{title}</h2>
          {description && <p className="truncate text-xs font-medium text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function MayakBadge({
  children,
  tone = "secondary",
  className,
}: {
  children: ReactNode;
  tone?: MayakTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full px-2.5 text-[11px] font-bold leading-none",
        badgeTone[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type MayakButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: MayakButtonVariant;
};

export function MayakButton({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: MayakButtonProps) {
  return (
    <button className={cn(buttonClassName(variant), className)} type={type} {...props}>
      {children}
    </button>
  );
}

type MayakLinkButtonProps = LinkProps & {
  children: ReactNode;
  className?: string;
  variant?: MayakButtonVariant;
};

export function MayakLinkButton({
  children,
  className,
  variant = "primary",
  ...props
}: MayakLinkButtonProps) {
  return (
    <Link className={cn(buttonClassName(variant), className)} {...props}>
      {children}
    </Link>
  );
}

function buttonClassName(variant: MayakButtonVariant) {
  const base =
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45 disabled:pointer-events-none disabled:opacity-40";

  if (variant === "secondary") {
    return cn(base, "bg-secondary text-secondary-foreground hover:bg-secondary/80");
  }

  if (variant === "ghost") {
    return cn(base, "border border-border bg-card text-foreground hover:border-primary/40 hover:text-primary");
  }

  return cn(base, "bg-primary text-primary-foreground shadow-sm hover:opacity-90");
}

export function MayakActionBar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-4 flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

type MayakFieldProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export function MayakField({ label, children, className }: MayakFieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-bold text-foreground">{label}</span>
      {children}
    </label>
  );
}

export function MayakInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(mayakInputClassName, className)} {...props} />;
}

type MayakOptionCardProps = {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function MayakOptionCard({
  title,
  description,
  meta,
  selected,
  onClick,
  className,
}: MayakOptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-20 rounded-2xl border bg-card p-3 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
        selected
          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/40 shadow-[var(--shadow-card)]"
          : "border-border hover:border-primary/40 hover:bg-primary/5",
        className,
      )}
    >
      <span className="block font-display text-sm font-bold text-foreground">{title}</span>
      {description && (
        <span className="mt-1 block text-xs font-medium leading-relaxed text-muted-foreground">
          {description}
        </span>
      )}
      {meta && <span className="mt-2 block text-xs font-medium text-muted-foreground">{meta}</span>}
    </button>
  );
}

export function MayakStatCard({
  value,
  label,
  description,
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-3", className)}>
      <span className="block truncate font-display text-2xl font-extrabold tracking-tight text-primary">
        {value}
      </span>
      {label && <p className="mt-0.5 truncate text-xs font-bold text-foreground">{label}</p>}
      {description && <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}

export function MayakProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={className} aria-label={label ?? `Прогресс ${safeValue}%`}>
      <div className="h-2 overflow-hidden rounded-full border border-border bg-secondary">
        <span
          className="block h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

export function MayakProgressRing({
  value,
  label = "путь",
  size = 112,
  className,
}: {
  value: number;
  label?: ReactNode;
  size?: number;
  className?: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.max(0, Math.min(100, value));
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ height: size, width: size }}>
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 120 120"
        role="img"
        aria-label={`Прогресс адаптации ${safeValue} процентов`}
      >
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-secondary" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-xl font-extrabold tracking-tight text-foreground">{safeValue}%</span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
