import type {
  IAuthProvider, SignUpMethod, AuthSession, SignUpData,
} from '../types';

const STORAGE_KEY = 'cryptosure_demo_users';

const DEMO_USER: AuthSession = {
  userId: 'demo-001',
  displayName: 'Demo User',
  email: 'demo@cryptosure.app',
  avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=6C3FC5&color=fff&size=128',
  isAuthenticated: true,
  authMethod: 'demo',
  didzCommitment: '0xDEMO_didz_commitment_a1b2c3d4',
  creditScoreBand: 'B',
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readStoredUsers(): SignUpData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStoredUsers(users: SignUpData[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export class MockAuthProvider implements IAuthProvider {
  private session: AuthSession | null = null;

  async login(method: SignUpMethod, email?: string, _password?: string): Promise<AuthSession> {
    const delays: Record<string, number> = {
      email: 800, 'pgp-key': 1500, 'did-wallet': 1800, trezor: 2000,
      biometric: 1200, 'chrome-oauth': 1000, 'brave-oauth': 1000,
    };
    await delay(delays[method] || 800);

    if (method === 'email' && email) {
      const stored = readStoredUsers();
      const found = stored.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        this.session = {
          userId: `demo-${found.email}`,
          displayName: `${found.firstName} ${found.lastName}`,
          email: found.email,
          avatarUrl: `https://ui-avatars.com/api/?name=${found.firstName}+${found.lastName}&background=6C3FC5&color=fff&size=128`,
          isAuthenticated: true,
          authMethod: method,
          didzCommitment: `0xDEMO_didz_${found.email.replace(/[@.]/g, '')}`,
          creditScoreBand: 'B',
        };
        return this.session;
      }
    }

    this.session = {
      ...DEMO_USER,
      authMethod: method,
      email: email || 'demo@cryptosure.app',
      authenticatedAt: new Date().toISOString(),
    } as AuthSession;
    return this.session;
  }

  async signup(data: SignUpData): Promise<AuthSession> {
    await delay(800);

    const existing = readStoredUsers();
    const alreadyExists = existing.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase(),
    );
    if (alreadyExists) {
      throw new Error(`An account with email "${data.email}" already exists.`);
    }

    existing.push(data);
    writeStoredUsers(existing);

    this.session = {
      userId: `demo-${data.email}`,
      displayName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      avatarUrl: `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}&background=6C3FC5&color=fff&size=128`,
      isAuthenticated: true,
      authMethod: data.signupMethod,
      didzCommitment: `0xDEMO_didz_${data.email.replace(/[@.]/g, '')}`,
      creditScoreBand: 'unrated',
    };

    console.log(`[demoLand] New user signed up: ${data.firstName} ${data.lastName} (${data.email})`);
    return this.session;
  }

  async logout(): Promise<void> {
    await delay(300);
    this.session = null;
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  isAuthenticated(): boolean {
    return this.session !== null;
  }

  listSignedUpUsers(): SignUpData[] {
    return readStoredUsers();
  }
}
