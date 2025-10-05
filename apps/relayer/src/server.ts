import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";
import "dotenv/config";

const app = express();
app.use(cors({ origin: true, methods: ["GET","POST","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"] }));
app.options("*", cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

// Configuration
const RPC_URL = process.env.VITE_PUSH_RPC || "https://rpc.pushchain.example/donut";
const RELAYER_PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
const AUTH_SECRET = process.env.AUTH_SECRET || "demo-secret-key";

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);
const DERIVE_SECRET = process.env.RELAYER_DERIVE_SECRET || "demo-derive-secret";

function getSessionWallet(userKey: string): ethers.Wallet {
  const seed = ethers.keccak256(ethers.toUtf8Bytes(`${DERIVE_SECRET}:${userKey}`));
  return new ethers.Wallet(seed, provider);
}

console.log(`[relayer] Initialized with address: ${wallet.address}`);

// Health check
app.get("/health", (_, res) => {
  res.json({ 
    ok: true, 
    address: wallet.address,
    network: RPC_URL,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (_, res) => {
  res.type('text/plain').send('Relayer is running');
});

// Verify JWT token
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Persistence (demo)
const DATA_DIR = path.join(process.cwd(), "apps/relayer/data");
const QUOTAS_FILE = path.join(DATA_DIR, "quotas.json");
const ACTIVITY_FILE = path.join(DATA_DIR, "activity.json");
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
if (!fs.existsSync(QUOTAS_FILE)) fs.writeFileSync(QUOTAS_FILE, JSON.stringify({}), "utf8");
if (!fs.existsSync(ACTIVITY_FILE)) fs.writeFileSync(ACTIVITY_FILE, JSON.stringify({}), "utf8");

function readJSON(file: string): any { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return {}; } }
function writeJSON(file: string, data: any) { try { fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8"); } catch {} }

// Sponsored transaction endpoint
// Quotas with persistence (demo)
const sessionCount: Record<string, number> = readJSON(QUOTAS_FILE);
const MAX_TX_PER_SESSION = Number(process.env.MAX_TX_PER_SESSION || 25);
const MAX_TX_PER_DAY = Number(process.env.MAX_TX_PER_DAY || 100);
function getDayKey() { const d = new Date(); return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`; }

app.post("/relay", async (req, res) => {
  try {
    const { token, payload } = req.body;
    
    // Verify user session (optional in demo)
    let user: any = null;
    if (token) {
      user = await verifyToken(token);
    }
    
    // Validate payload
    if (!payload || !payload.method) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    
    // Quotas (session + daily)
    const key = String((user && (user.email || user.sessionId)) || req.ip || "anon");
    const dayKey = getDayKey();
    sessionCount[key] = sessionCount[key] || 0;
    const dayCounts: Record<string, number> = (sessionCount as any).__days || ((sessionCount as any).__days = {});
    const perDayKey = `${key}:${dayKey}`;
    dayCounts[perDayKey] = dayCounts[perDayKey] || 0;
    if (sessionCount[key] >= MAX_TX_PER_SESSION) return res.status(429).json({ error: "Quota exceeded (session)" });
    if (dayCounts[perDayKey] >= MAX_TX_PER_DAY) return res.status(429).json({ error: "Quota exceeded (daily)" });
    sessionCount[key] += 1;
    dayCounts[perDayKey] += 1;
    writeJSON(QUOTAS_FILE, sessionCount);

    // Derive a per-session wallet and sign; optional real send
    const sessionWallet = getSessionWallet(key);
    const payloadToSign = { method: payload.method, params: payload.params, ts: Date.now(), user: key, from: sessionWallet.address };
    const message = JSON.stringify(payloadToSign);
    const signature = await sessionWallet.signMessage(message);
    const txHash = ethers.keccak256(ethers.toUtf8Bytes(signature));
    
    // Log and persist activity
    const userKey = String((user && (user.email || user.sessionId)) || key);
    console.log(`[relay] User ${userKey} executed ${payload.method}: ${txHash}`);
    addActivity(userKey, {
      id: Date.now(),
      action: String(payload.method),
      hash: txHash,
      timestamp: Date.now(),
      status: 'pending'
    });
    writeJSON(ACTIVITY_FILE, activitiesByUser);
    
    res.json({ 
      hash: txHash,
      status: "pending",
      user: (user && (user as any).email) || userKey,
      method: payload.method,
      from: sessionWallet.address
    });
    
  } catch (error) {
    console.error("[relay] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Confirmation timers that update persisted activity
setInterval(() => {
  // randomly flip some pending to confirmed for demo
  let changed = false;
  for (const key of Object.keys(activitiesByUser)) {
    const list = activitiesByUser[key] || [];
    for (const item of list) {
      if (item.status === 'pending' && Math.random() < 0.2) {
        item.status = 'confirmed';
        changed = true;
      }
    }
  }
  if (changed) writeJSON(ACTIVITY_FILE, activitiesByUser);
}, 2000);

// Get transaction status
app.get("/tx/:hash", async (req, res) => {
  const { hash } = req.params;
  
  // In a real implementation, query the blockchain for transaction status
  // For demo, return mock status
  const statuses = ['pending', 'confirmed', 'failed'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  res.json({ 
    hash, 
    status,
    blockNumber: Math.floor(Math.random() * 1000) + 1000,
    timestamp: Date.now()
  });
});

// Get user activity
// Simple in-memory activity log (demo)
type Activity = { id: number; action: string; hash: string; timestamp: number; status: 'pending' | 'confirmed' | 'failed' };
const activitiesByUser: Record<string, Activity[]> = {};

function addActivity(userKey: string, activity: Activity) {
  if (!activitiesByUser[userKey]) activitiesByUser[userKey] = [];
  activitiesByUser[userKey].unshift(activity);
  activitiesByUser[userKey] = activitiesByUser[userKey].slice(0, 100);
}

app.get("/activity/:user", async (req, res) => {
  const { user } = req.params;
  res.json({ activities: activitiesByUser[user] || [] });
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`[relayer] Server running on port ${port}`);
  console.log(`[relayer] Health check: http://localhost:${port}/health`);
});
