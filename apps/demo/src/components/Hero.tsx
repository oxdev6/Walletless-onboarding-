function FloatingBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={
        "relative w-24 h-24 rounded-xl bg-black/60 " +
        "border border-stroke-subtle shadow-[0_0_40px_rgba(167,83,238,0.15)] " + className
      }
      style={{ animation: 'float 10s ease-in-out infinite' }}
    >
      <div className="absolute inset-0 rounded-xl pointer-events-none"
           style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }} />
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* radial backdrop */}
      <div className="absolute inset-0 bg-hero z-0" />

      {/* floating decorative blocks */}
      <FloatingBlock className="absolute left-16 top-80 -rotate-6" />
      <FloatingBlock className="absolute left-64 top-[28rem] rotate-3" />
      <FloatingBlock className="absolute right-36 top-96" />
      <FloatingBlock className="absolute right-24 top-[34rem] -rotate-2" />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-28 text-center">
        <h1 className="text-white text-[48px] md:text-[64px] leading-tight font-semibold">
          Any Chain, Any App, All Users.<br/>One Push Chain.
        </h1>

        <p className="mt-6 text-white text-lg max-w-2xl mx-auto">
          The first Layer 1 built for Universal Apps. Build &amp; Deploy once, onboard users from any chain.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#actions"
            className="relative px-7 py-4 rounded-2xl font-semibold text-white
                       gradient-primary shadow-glow-primary border border-white/10"
          >
            Start Building →
          </a>

          <a
            href="#resources"
            className="px-7 py-4 rounded-2xl font-medium text-white/90
                       bg-black/50 border border-stroke-subtle/80 shadow-inner-soft"
          >
            Explore Knowledge Base
          </a>
        </div>
      </div>
    </section>
  )
}


