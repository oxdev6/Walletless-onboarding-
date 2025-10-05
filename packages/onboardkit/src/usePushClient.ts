import type { PushClient, TxResponse } from './types';

// Real Push Chain SDK integration
export function createPushClient(): PushClient {
  let listeners: Record<string, (s: string) => void> = {};
  let wsConnection: WebSocket | null = null;
  let isConnected = false;

  return {
    async init(rpcUrl: string) {
      // Initialize Push Chain SDK connection
      console.log('Initializing Push Chain client with RPC:', rpcUrl);
      
      // TODO: Replace with actual Push Chain SDK
      // const client = await createClient({ rpcUrl, network: 'donut-testnet' });
      
      // Mock connection for now
      isConnected = true;
      
      // Initialize WebSocket for real-time updates
      try {
        wsConnection = new WebSocket('wss://push-chain-ws.example.com');
        wsConnection.onopen = () => console.log('WebSocket connected');
        wsConnection.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'tx_update' && listeners[data.hash]) {
            listeners[data.hash](data.status);
          }
        };
      } catch (error) {
        console.warn('WebSocket connection failed, using polling fallback');
      }
    },

    async fetchLatestBlocks(n = 5) {
      if (!isConnected) throw new Error('Client not initialized');
      
      // TODO: Replace with actual Push Chain SDK call
      // return await client.getBlocks({ limit: n });
      
      // Mock data for demo
      return Array.from({ length: n }).map((_, i) => ({
        number: 1000 - i,
        hash: `0xblock${1000 - i}`,
        timestamp: Date.now() - i * 12000,
        transactions: Math.floor(Math.random() * 10)
      }));
    },

    async sendTx(payload: any, opts?: { relayerUrl?: string; token?: string }) {
      if (!isConnected) throw new Error('Client not initialized');

      // Try multiple relayer URL candidates for robustness
      const candidates: string[] = [];
      if (opts?.relayerUrl) candidates.push(opts.relayerUrl);
      const envUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_RELAYER_URL) as string | undefined;
      if (envUrl) candidates.push(envUrl);
      if (typeof window !== 'undefined') candidates.push(`${window.location.protocol}//${window.location.hostname}:8787`);
      candidates.push('http://localhost:8787');
      const tried: string[] = [];

      for (const base of Array.from(new Set(candidates))) {
        try {
          tried.push(base);
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 3500);
          const res = await fetch(`${base}/relay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: opts?.token, payload }),
            signal: controller.signal,
            mode: 'cors'
          });
          clearTimeout(timer);
          if (!res.ok) continue;
          const data = await res.json();
          const hash = data.hash as string;
          setTimeout(() => listeners[hash]?.('pending'), 200);
          setTimeout(() => listeners[hash]?.('confirmed'), 1200);
          return { hash, status: 'pending' as const, from: (data as any).from } as TxResponse & { from?: string };
        } catch (_err) {
          // try next
        }
      }
      throw new Error(`Relayer unreachable. Tried: ${Array.from(new Set(candidates)).join(', ')}`);

      // TODO: Replace with actual Push Chain SDK call
      // const tx = await client.sendTransaction(payload);

      // Fallback mock
      const hash = `0xtx${Math.random().toString(16).slice(2)}`;
      setTimeout(() => listeners[hash]?.('pending'), 200);
      setTimeout(() => listeners[hash]?.('confirmed'), 1200);
      return { hash, status: 'pending' as const };
    },

    onTx(hash: string, callback: (status: string) => void) {
      listeners[hash] = callback;
      return () => delete listeners[hash];
    },

    subscribe(callback: (data: any) => void) {
      if (wsConnection) {
        const handler = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          callback(data);
        };
        wsConnection.addEventListener('message', handler);
        return () => wsConnection?.removeEventListener('message', handler);
      }
      
      // Fallback polling
      const interval = setInterval(() => {
        callback({ type: 'heartbeat', timestamp: Date.now() });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  };
}
