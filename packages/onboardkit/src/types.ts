export type UniversalAction = {
  id: string;
  label: string;
  chain: "push" | "other";
  method: string; // e.g. "nft.mint" or "payments.send"
  params?: Record<string, unknown>;
};

export type TxResponse = { 
  hash: string;
  status?: 'pending' | 'confirmed' | 'failed';
};

export type UserSession = {
  id: string;
  email: string;
  sessionKey: string;
  expiresAt: number;
};

export type PushClient = {
  init: (rpcUrl: string) => Promise<void>;
  fetchLatestBlocks: (n?: number) => Promise<any[]>;
  sendTx: (payload: unknown, opts?: { relayerUrl?: string; token?: string }) => Promise<TxResponse>;
  onTx: (hash: string, cb: (status: string) => void) => () => void;
  subscribe: (callback: (data: any) => void) => () => void;
};
