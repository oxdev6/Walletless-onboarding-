export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#09040C]">
      <div className="mx-auto max-w-container px-4 py-4">
        <nav className="rounded-2xl border border-white/10 px-4 py-3 flex items-center justify-between bg-black/40 backdrop-blur">
          {/* left - logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary shadow-glow-secondary" />
            <span className="font-semibold tracking-wide">Any Chain, Any App, All Users. One Push Chain.</span>
          </div>

          {/* center - menus */}
          <ul className="hidden md:flex items-center gap-7 text-sm text-white/90">
            <li>
              <a href="#testnet" className="hover:text-white">Testnet ▾</a>
            </li>
            <li>
              <a href="#developers" className="hover:text-white">Developers ▾</a>
            </li>
            <li>
              <a href="#community" className="hover:text-white">Community ▾</a>
            </li>
            <li>
              <a href="#resources" className="hover:text-white">Resources ▾</a>
            </li>
          </ul>

          {/* right - lang + portal */}
          <div className="flex items-center gap-3">
            <button aria-label="Language" className="text-white/80 hover:text-white">🌐</button>
            <a
              className="gradient-primary text-white px-4 py-2 rounded-xl font-medium shadow-glow-primary border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              href="#"
            >
              Push Portal
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}


