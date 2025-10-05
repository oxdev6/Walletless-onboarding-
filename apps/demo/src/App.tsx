import React, { useEffect, useState } from 'react'
import Banner from './components/Banner'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CookieCard from './components/CookieCard'
import { OnboardProvider, OnboardKit } from '@pushlabs/onboardkit'
import { ActivityFeed } from './components/ActivityFeed'

const rpcUrl = import.meta.env.VITE_PUSH_RPC || 'https://rpc.pushchain.example/donut'
const relayerUrl = (import.meta as any).env?.VITE_RELAYER_URL 
  || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8787` : 'http://localhost:8787')

export default function App() {
  const [activities, setActivities] = useState<any[]>([])
  const [userEmail, setUserEmail] = useState<string>("")

  const handleActionComplete = (action: any, result: any) => {
    setActivities(prev => [{
      id: Date.now(),
      action: action.label,
      hash: result.hash,
      timestamp: Date.now(),
      status: 'completed'
    }, ...prev])
  }

  useEffect(() => {
    const stored = localStorage.getItem('onboard_session_user')
    if (stored) setUserEmail(stored)
    const interval = setInterval(async () => {
      if (!userEmail) return
      try {
        const res = await fetch(`${relayerUrl}/activity/${encodeURIComponent(userEmail)}`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data.activities)) setActivities(data.activities)
        }
      } catch {}
    }, 3000)
    return () => clearInterval(interval)
  }, [userEmail])

  return (
    <OnboardProvider rpcUrl={rpcUrl} relayerUrl={relayerUrl}>
      <div className="min-h-screen bg-[#09040C] text-white">
        <Banner />
        <Navbar />
        <main className="relative">
          <Hero />

          {/* Universal Actions section (walletless onboarding) */}
          <section id="actions" className="mx-auto max-w-container px-4 py-16 grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Universal Actions</h2>
              <div className="rounded-2xl p-4 border border-stroke-subtle glass">
                <OnboardKit
                  actions={[
                    { id: 'mint', label: 'Mint Demo NFT', chain: 'push', method: 'nft.mint', params: { name: 'Universal NFT', symbol: 'UNI' } },
                    { id: 'tip', label: 'Tip Creator', chain: 'other', method: 'payments.send', params: { amount: '1', token: 'USDC' } },
                    { id: 'message', label: 'Send Message', chain: 'push', method: 'msg.send', params: { text: 'Hello from Universal Onboarding!' } }
                  ]}
                  onActionComplete={handleActionComplete}
                />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-6">Live Activity</h2>
              <ActivityFeed activities={activities} />
            </div>
          </section>

          {/* Anchor sections for navbar */}
          <section id="testnet" className="mx-auto max-w-container px-4 py-16 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full gradient-primary shadow-glow-primary">Donut Testnet</span>
              <h2 className="text-2xl font-semibold">Testnet</h2>
            </div>
            <p className="text-white/90 max-w-3xl mb-6">Use the Donut testnet and faucet to try universal actions. Your session is sponsored by the relayer, so no gas or RPC setup is needed.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <a className="rounded-2xl p-5 bg-black/40 border border-white/10 hover:bg-black/50 transition-colors block" href="https://faucet.push.org/" target="_blank" rel="noopener noreferrer">
                <div className="text-sm opacity-80">Faucet</div>
                <div className="text-lg font-semibold">faucet.push.org →</div>
              </a>
              <a className="rounded-2xl p-5 bg-black/40 border border-white/10 hover:bg-black/50 transition-colors block" href="https://donut.push.network/" target="_blank" rel="noopener noreferrer">
                <div className="text-sm opacity-80">Explorer</div>
                <div className="text-lg font-semibold">donut.push.network →</div>
              </a>
            </div>
          </section>

          <section id="developers" className="mx-auto max-w-container px-4 py-16 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20">Build</span>
              <h2 className="text-2xl font-semibold">Developers</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-white/90">
              <a className="rounded-2xl p-5 bg-black/40 border border-white/10 hover:bg-black/50 transition-colors block" href="https://pushchain.github.io/push-chain-website/pr-preview/pr-1067/docs/" target="_blank" rel="noopener noreferrer">
                <div className="text-sm opacity-80">Docs</div>
                <div className="text-lg font-semibold">Push Chain Documentation →</div>
              </a>
              <div className="rounded-2xl p-5 bg-black/40 border border-white/10">
                <div className="text-sm opacity-80 mb-2">SDKs</div>
                <div className="space-y-2">
                  <a className="underline block" href="https://www.npmjs.com/package/@pushchain/core" target="_blank" rel="noopener noreferrer">@pushchain/core</a>
                  <a className="underline block" href="https://www.npmjs.com/package/@pushchain/ui-kit" target="_blank" rel="noopener noreferrer">@pushchain/ui-kit</a>
                </div>
              </div>
            </div>
          </section>

          <section id="community" className="mx-auto max-w-container px-4 py-16 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20">Join</span>
              <h2 className="text-2xl font-semibold">Community</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-white/90">
              <a className="rounded-2xl p-5 bg-black/40 border border-white/10 hover:bg-black/50 transition-colors block" href="https://push.org/" target="_blank" rel="noopener noreferrer">Website →</a>
              <a className="rounded-2xl p-5 bg-black/40 border border-white/10 hover:bg-black/50 transition-colors block" href="#resources">Knowledge Base →</a>
            </div>
          </section>

          <section id="resources" className="mx-auto max-w-container px-4 py-16 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20">Learn</span>
              <h2 className="text-2xl font-semibold">Resources</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-white/90">
              <div className="rounded-2xl p-5 bg-black/40 border border-white/10">
                <div className="text-sm opacity-80 mb-2">Start Here</div>
                <div className="space-y-2">
                  <a className="underline block" href="https://push.org/" target="_blank" rel="noopener noreferrer">Push.org</a>
                  <a className="underline block" href="https://donut.push.network/" target="_blank" rel="noopener noreferrer">Push Donut Explorer</a>
                  <a className="underline block" href="https://faucet.push.org/" target="_blank" rel="noopener noreferrer">Faucet</a>
                </div>
              </div>
              <div className="rounded-2xl p-5 bg-black/40 border border-white/10">
                <div className="text-sm opacity-80 mb-2">Developer Guides</div>
                <div className="space-y-2">
                  <a className="underline block" href="https://pushchain.github.io/push-chain-website/pr-preview/pr-1067/docs/" target="_blank" rel="noopener noreferrer">Build & Wallet Setup</a>
                  <a className="underline block" href="#actions">Universal Actions (live demo)</a>
                </div>
              </div>
            </div>
          </section>
        </main>
        <CookieCard />
      </div>
    </OnboardProvider>
  )
}
