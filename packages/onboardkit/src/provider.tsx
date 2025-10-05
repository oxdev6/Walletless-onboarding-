import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createPushClient } from "./usePushClient";
import { createSession, verifySession, type UserSession } from "./auth";

interface OnboardContextType {
  client: ReturnType<typeof createPushClient>;
  ready: boolean;
  user: UserSession | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  token: string | null;
  relayerUrl?: string;
}

const OnboardCtx = createContext<OnboardContextType | null>(null);

export function OnboardProvider({ 
  children, 
  rpcUrl,
  relayerUrl: relayerUrlProp
}: { 
  children: React.ReactNode; 
  rpcUrl: string;
  relayerUrl?: string;
}) {
  const client = useMemo(() => createPushClient(), []);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Push Chain client
    client.init(rpcUrl).then(() => setReady(true));
    
    // Check for existing session
    const stored = localStorage.getItem('onboard_session');
    if (stored) {
      setToken(stored);
      verifySession(stored).then(session => {
        if (session && session.expiresAt > Date.now()) {
          setUser(session);
          try { localStorage.setItem('onboard_session_user', session.email); } catch {}
        } else {
          localStorage.removeItem('onboard_session');
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [client, rpcUrl]);

  const login = async (email: string) => {
    setLoading(true);
    try {
      const { session, token } = await createSession(email);
      localStorage.setItem('onboard_session', token);
      setToken(token);
      setUser(session);
      try { localStorage.setItem('onboard_session_user', session.email); } catch {}
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('onboard_session');
    setUser(null);
    setToken(null);
  };

  const relayerUrl = relayerUrlProp 
    || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_RELAYER_URL : undefined)
    || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8787` : 'http://localhost:8787');

  return (
    <OnboardCtx.Provider value={{ 
      client, 
      ready, 
      user, 
      login, 
      logout, 
      loading,
      token,
      relayerUrl
    }}>
      {children}
    </OnboardCtx.Provider>
  );
}

export function useOnboard() {
  const ctx = useContext(OnboardCtx);
  if (!ctx) throw new Error("useOnboard must be used inside OnboardProvider");
  return ctx;
}
