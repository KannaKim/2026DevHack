// In-memory store for access tokens (replaces MongoDB for temp doc access codes)

export interface StoredAccess {
  token: string;
  patientId: string;
  expiresAt: Date;
  revoked?: boolean;
}

const store = new Map<string, StoredAccess>();

export function saveAccess(access: StoredAccess) {
  store.set(access.token, access);
}

export function findAccessByToken(token: string): StoredAccess | undefined {
  return store.get(token);
}

export function revokeAccess(token: string) {
  const existing = store.get(token);
  if (existing) {
    store.set(token, { ...existing, revoked: true });
  }
}
