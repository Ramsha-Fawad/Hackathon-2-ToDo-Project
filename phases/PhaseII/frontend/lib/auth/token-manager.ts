/**
 * JWT token management utilities (client + server safe)
 */

"use client";

export interface AuthToken {
  token: string;
  userId: string;
  expiresAt: number;
}

class TokenManager {
  private static readonly TOKEN_KEY = "auth_token";

  /* =========================
     Client-side utilities
     ========================= */

  static storeToken(token: string, userId: string, expiresInMs: number): void {
    if (typeof window === "undefined") return;

    const expiresAt = Date.now() + expiresInMs;

    const authToken: AuthToken = {
      token,
      userId,
      expiresAt,
    };

    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(authToken));
  }

  static getToken(): AuthToken | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem(this.TOKEN_KEY);
      if (!raw) return null;

      const parsed: AuthToken = JSON.parse(raw);

      if (!parsed.token || !parsed.expiresAt || !parsed.userId) {
        this.clearToken();
        return null;
      }

      // Expired
      if (Date.now() >= parsed.expiresAt) {
        this.clearToken();
        return null;
      }

      return parsed;
    } catch {
      this.clearToken();
      return null;
    }
  }

  static clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Must be a valid JWT format
    try {
      return token.token.split(".").length === 3;
    } catch {
      return false;
    }
  }

  static isAboutToExpire(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return token.expiresAt - Date.now() < 5 * 60 * 1000; // 5 minutes
  }

  static getUserId(): string | null {
    const token = this.getToken();
    return token ? token.userId : null;
  }

  /* =========================
     JWT helpers
     ========================= */

  static decodeTokenPayload(token: string): any | null {
    try {
      const payload = token.split(".")[1];
      const padded =
        payload + "=".repeat((4 - (payload.length % 4)) % 4);
      const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  static extractUserIdFromJWT(token: string): string | null {
    const payload = this.decodeTokenPayload(token);
    return payload?.user_id ?? null;
  }

  static extractExpiryFromJWT(token: string): number | null {
    const payload = this.decodeTokenPayload(token);
    if (!payload?.exp) return null;
    return payload.exp * 1000; // seconds → ms
  }

  /* =========================
     Server-side helpers
     ========================= */

  static getTokenFromRequest(req: Request): string | null {
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      return auth.slice(7);
    }
    return null;
  }

  static isServerTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
      const payload = this.decodeTokenPayload(token);
      if (!payload?.exp) return false;

      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }
}

/* =========================
   Named exports
   ========================= */

export default TokenManager;

export const tokenManager = {
  storeToken: TokenManager.storeToken,
  getToken: TokenManager.getToken,
  clearToken: TokenManager.clearToken,
  isValid: TokenManager.isValid,
  isAboutToExpire: TokenManager.isAboutToExpire,
  getUserId: TokenManager.getUserId,
  decodeTokenPayload: TokenManager.decodeTokenPayload,
  extractUserIdFromJWT: TokenManager.extractUserIdFromJWT,
  extractExpiryFromJWT: TokenManager.extractExpiryFromJWT,
};
