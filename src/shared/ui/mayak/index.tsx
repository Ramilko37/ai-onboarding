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
  page: "relative min-h-screen text-foreground",
  shell: "mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8",
  panel:
    "rounded-3xl border border-border bg-card/80 backdrop-blur-sm shadow-[var(--shadow-card)]",
  interactive:
    "transition hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
  deep:
    "rounded-3xl border border-deep-border bg-[radial-gradient(70%_90%_at_0%_0%,color-mix(in_oklch,var(--primary)_32%,transparent),transparent_60%),var(--deep)] text-deep-foreground shadow-[var(--shadow-soft)]",
} as const;

export const mayakTypography = {
  eyebrow: "font-mono text-[11px] font-medium uppercase tracking-wider",
  h1: "text-pretty text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl",
  h2: "text-base font-semibold tracking-tight text-foreground",
  body: "text-pretty leading-relaxed text-muted-foreground",
  caption: "text-xs leading-relaxed text-muted-foreground",
} as const;

export const mayakInputClassName =
  "min-h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/50";

const badgeTone: Record<MayakTone, string> = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  muted: "bg-muted text-muted-foreground",
  success: "bg-[color-mix(in_oklch,oklch(0.7_0.12_160)_22%,transparent)] text-[oklch(0.45_0.1_160)]",
  danger: "bg-[color-mix(in_oklch,oklch(0.7_0.13_35)_22%,transparent)] text-[oklch(0.5_0.13_32)]",
};

const iconTone: Record<MayakTone, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  muted: "bg-muted text-muted-foreground",
  success: "bg-[color-mix(in_oklch,oklch(0.7_0.12_160)_22%,transparent)] text-[oklch(0.45_0.1_160)]",
  danger: "bg-[color-mix(in_oklch,oklch(0.7_0.13_35)_22%,transparent)] text-[oklch(0.5_0.13_32)]",
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
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 0)",
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
        "sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              {icon}
            </span>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">{brand}</p>
            {subtitle && (
              <p className="truncate font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {meta && (
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
              {meta}
            </span>
          )}
          {userName && (
            <div className="flex items-center gap-2.5 rounded-full border border-border bg-card/80 py-1 pr-3 pl-1">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
                aria-hidden="true"
              >
                {initials}
              </span>
              <span className="hidden text-sm font-medium text-foreground sm:inline">{userName}</span>
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
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "card" | "deep" | "soft";
  ariaLabel?: string;
};

const panelPadding = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-7",
  lg: "p-6 sm:p-8",
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
    <div className={cn("mb-6 space-y-3", className)}>
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
    <div className={cn("mb-5 flex items-center justify-between gap-3", className)}>
      <div className="flex min-w-0 items-center gap-2.5">
        {icon}
        <div className="min-w-0">
          <h2 className={mayakTypography.h2}>{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
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
        "inline-flex min-h-7 items-center rounded-full px-3 text-xs font-medium leading-none",
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
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45 disabled:pointer-events-none disabled:opacity-40";

  if (variant === "secondary") {
    return cn(base, "bg-secondary text-secondary-foreground hover:bg-secondary/80");
  }

  if (variant === "ghost") {
    return cn(base, "border border-border bg-card text-foreground hover:border-primary/40 hover:text-primary");
  }

  return cn(base, "bg-primary text-primary-foreground shadow-sm hover:opacity-90");
}

export function MayakActionBar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-6 flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

type MayakFieldProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export function MayakField({ label, children, className }: MayakFieldProps) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
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
        "min-h-28 rounded-2xl border bg-card p-4 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring/45",
        selected
          ? "border-primary/60 bg-primary/5 ring-1 ring-primary/40 shadow-[var(--shadow-card)]"
          : "border-border hover:border-primary/40 hover:bg-primary/5",
        className,
      )}
    >
      <span className="block text-sm font-semibold text-foreground">{title}</span>
      {description && (
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      )}
      {meta && <span className="mt-3 block text-xs text-muted-foreground">{meta}</span>}
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
    <div className={cn("rounded-2xl border border-border bg-card p-4", className)}>
      <span className="block text-3xl font-semibold tracking-tight text-primary">{value}</span>
      {label && <p className="mt-1 text-sm font-medium text-foreground">{label}</p>}
      {description && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>}
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
      <div className="h-3 overflow-hidden rounded-full border border-border bg-secondary">
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
  size = 128,
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
        <span className="text-2xl font-semibold tracking-tight text-foreground">{safeValue}%</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
