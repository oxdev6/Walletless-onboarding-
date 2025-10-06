import React from "react";

export function Header() {
  const [dark, setDark] = React.useState(true);
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <header className="bg-black">
      {/* Announcement bar */}
      <div className="brand-gradient text-white text-xs py-2">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1">
            <span>✦</span> Launch on Push Testnet Now — Unlock Rewards for Builders and Early Users.
          </span>
          <a href="#learn" className="underline underline-offset-2">Learn More →</a>
        </div>
      </div>

      {/* Nav */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/src/assets/buidl-logo.svg" alt="BUIDL" className="w-8 h-8 rounded-lg" />
            <span className="text-white font-semibold tracking-tight">Any Chain, Any App, All Users. One Push Chain.</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <a href="#" className="hover:text-white inline-flex items-center gap-1">Testnet <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M5 7l5 5 5-5"/></svg></a>
            <a href="#" className="hover:text-white inline-flex items-center gap-1">Developers <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M5 7l5 5 5-5"/></svg></a>
            <a href="#" className="hover:text-white inline-flex items-center gap-1">Community <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M5 7l5 5 5-5"/></svg></a>
            <a href="#" className="hover:text-white inline-flex items-center gap-1">Resources <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M5 7l5 5 5-5"/></svg></a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200" aria-label="Language">
              {/* globe icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9Z"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9Z"/></svg>
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-200"
              aria-label="Toggle dark mode"
            >
              {dark ? 'Dark' : 'Light'}
            </button>
            <a href="#portal" className="px-4 py-2 rounded-2xl text-white font-medium border border-white/10" style={{backgroundImage:'linear-gradient(135deg, rgba(124,131,255,1) 0%, rgba(236,72,153,1) 100%)'}}>Push Portal</a>
          </div>
        </div>
      </div>
    </header>
  );
}
