import { useState } from 'react'

export default function CookieCard() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <aside className="fixed right-6 bottom-6 z-50">
      <div className="w-[360px] rounded-2xl bg-bg-deep/90 border border-stroke-subtle p-4 shadow-2xl backdrop-blur">
        <p className="text-sm text-text-secondary">
          We use cookies to personalize your experience. Learn more in our <a href="#" className="underline">Privacy Policy</a>.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setDismissed(true)}
            className="gradient-primary text-white px-5 py-2.5 rounded-xl font-medium shadow-glow-primary"
          >
            Accept
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-4 py-2.5 rounded-xl text-white/80 hover:text-white"
          >
            Opt-out
          </button>
        </div>
      </div>
    </aside>
  )
}


