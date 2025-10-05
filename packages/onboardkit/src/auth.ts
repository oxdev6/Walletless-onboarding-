import { SignJWT, jwtVerify } from 'jose';
import type { UserSession } from './types';

// Avoid process.env in browser; prefer Vite env or fallback
const AUTH_SECRET: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_AUTH_SECRET) ||
  (typeof process !== 'undefined' && (process as any).env?.AUTH_SECRET) ||
  'demo-secret-key';
const secret = new TextEncoder().encode(AUTH_SECRET);

export async function createSession(email: string): Promise<{ session: UserSession; token: string }> {
  const sessionId = crypto.randomUUID();
  const sessionKey = crypto.randomUUID();
  
  const token = await new SignJWT({ 
    email, 
    sessionId, 
    sessionKey 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  const session: UserSession = {
    id: sessionId,
    email,
    sessionKey,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  };

  return { session, token };
}

export async function verifySession(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.sessionId as string,
      email: payload.email as string,
      sessionKey: payload.sessionKey as string,
      expiresAt: payload.exp! * 1000
    };
  } catch {
    return null;
  }
}

export function generateMagicLink(email: string, baseUrl: string): string {
  const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));
  return `${baseUrl}/auth/callback?token=${token}`;
}

export function validateMagicLink(token: string): { email: string; valid: boolean } {
  try {
    const data = JSON.parse(atob(token));
    const isValid = Date.now() - data.timestamp < 10 * 60 * 1000; // 10 minutes
    return { email: data.email, valid: isValid };
  } catch {
    return { email: '', valid: false };
  }
}
