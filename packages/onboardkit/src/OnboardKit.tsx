import React, { useState } from "react";
import { useOnboard } from "./provider";
import type { UniversalAction } from "./types";

interface OnboardKitProps {
  actions: UniversalAction[];
  onActionComplete?: (action: UniversalAction, result: any) => void;
}

export function OnboardKit({ actions, onActionComplete }: OnboardKitProps) {
  const { client, ready, user, login, logout, loading, token, relayerUrl } = useOnboard();
  const [status, setStatus] = useState<string>("");
  const [lastHash, setLastHash] = useState<string>("");
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(!user);
  // Keep login panel visibility in sync with auth state
  React.useEffect(() => {
    setShowLogin(!user);
  }, [user]);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [lastFrom, setLastFrom] = useState<string>("");
  const [toast, setToast] = useState<string>("");
  const [tab, setTab] = useState<'All'|'Transactions'|'Messaging'>("All");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await login(email);
      setShowLogin(false);
    }
  };

  const runAction = async (action: UniversalAction) => {
    if (!ready || !user) return;
    
    setStatus("sending...");
    setSendingId(action.id);
    try {
      const result = await client.sendTx({ 
        method: action.method, 
        params: action.params, 
        chain: action.chain 
      }, { relayerUrl, token });
      
      setLastHash((result as any).hash);
      if ((result as any).from) setLastFrom((result as any).from);
      setStatus(`tx ${result.hash} pending`);
      
      const unsubscribe = client.onTx(result.hash, (status) => {
        setStatus(`tx ${result.hash} ${status}`);
        if (status === 'confirmed') {
          onActionComplete?.(action, result);
          setToast(`${action.label} confirmed`);
          setTimeout(() => setToast(""), 1800);
        }
      });
      
      // Cleanup after 10 seconds
      setTimeout(unsubscribe, 10000);
    } catch (error) {
      setStatus(`Error: ${error}`);
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-6 shadow bg-white dark:bg-zinc-900">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="rounded-2xl p-6 shadow bg-white dark:bg-zinc-900">
        <div className="text-center max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2">Universal Onboarding</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-5">
            Sign in with your email to start using cross‑chain actions. No wallet popups, no RPC switching.
          </p>
          <form onSubmit={handleLogin} className="space-y-3 text-left" aria-label="Email sign in">
            <label htmlFor="onboard-email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-200">Email</label>
            <input
              id="onboard-email"
              aria-label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-push-600"
              required
            />
            <button
              type="submit"
              className="btn-primary w-full"
              aria-label="Sign in"
            >
              Continue
            </button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              By continuing you agree to the terms. We only use your email to create a session.
            </p>
          </form>
        </div>
      </div>
    );
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setStatus("Copied session address"); setTimeout(() => setStatus(""), 1200); } catch {}
  }

  return (
    <div className="rounded-2xl p-6 bg-black/40 border border-white/10 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20">Walletless</span>
            <h3 className="text-xl font-semibold">Universal Actions</h3>
          </div>
          <p className="text-sm text-white/90">
            Signed in as <span className="font-medium">{user?.email}</span>
          </p>
          {lastFrom && (
            <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
              <span className="opacity-80">Session address:</span>
              <span className="font-mono break-all">{lastFrom}</span>
              <button onClick={() => copy(lastFrom)} className="px-2 py-0.5 rounded bg-white/10 border border-white/20 hover:bg-white/15">Copy</button>
            </div>
          )}
          <p className="mt-1 text-xs text-white/70">Sponsored by Relayer • Your session address will be used on-chain</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded ${
            ready ? "bg-green-500/20 text-green-200 border border-green-400/40" : "bg-white/10 text-white/70 border border-white/20"
          }`}>
            {ready ? "Connected" : "Connecting..."}
          </span>
          <button
            onClick={() => { logout(); setShowLogin(true); }}
            className="text-xs text-white/70 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex items-center gap-2 text-xs">
        {(['All','Transactions','Messaging'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-full border ${tab===t ? 'bg-white/15 border-white/30' : 'bg-white/5 border-white/15 hover:bg-white/10'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Progress bar while sending */}
      {sendingId && (
        <div className="mb-3 h-1 w-full rounded bg-white/10 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#4427EC] to-[#A753EE] animate-pulse"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(actions.filter((a) => tab==='All' ? true : tab==='Messaging' ? a.method.startsWith('msg') : !a.method.startsWith('msg'))).map((action) => (
          <button
            key={action.id}
            onClick={() => runAction(action)}
            disabled={!ready || !!sendingId}
            className="px-4 py-4 rounded-xl border border-white/10 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-black/30 text-left hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                {action.method.startsWith('nft') ? '🪙' : action.method.startsWith('msg') ? '✉️' : '💸'}
              </div>
              <div>
                <div className="text-sm font-semibold">{action.label}</div>
                <div className="text-xs opacity-80 mt-0.5">
                  {action.chain} • {action.method}
                </div>
              </div>
            </div>
            {sendingId === action.id && (
              <svg className="animate-spin h-4 w-4 text-push-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
          </button>
        ))}
      </div>
      
      {status && (
        <div className="mt-4 p-4 rounded-2xl border border-white/20 bg-black/50 text-white">
          <div className="text-sm">{status}</div>
          {lastHash && (
            <div className="text-xs mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono break-all">{lastHash}</span>
                <a className="underline" href={`https://donut.push.network/tx/${lastHash}`} target="_blank" rel="noopener noreferrer">View on Explorer</a>
              </div>
              {/* show per-session address if returned */}
              {lastFrom && (
                <div className="opacity-80">From (session): <span className="font-mono break-all">{lastFrom}</span></div>
              )}
            </div>
          )}
        </div>
      )}

      {toast && (
        <div className="mt-3 text-xs px-3 py-2 rounded bg-white/10 border border-white/20 inline-block">
          {toast}
        </div>
      )}
    </div>
  );
}
