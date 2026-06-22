export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
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
