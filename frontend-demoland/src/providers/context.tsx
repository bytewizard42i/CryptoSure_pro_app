import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  Providers,
  CSMode,
  AuthSession,
  SignUpData,
  SignUpMethod,
} from './types';
import { createDemoProviders } from './demoland';
import { createRealProviders } from './realdeal';

// --- Provider Context ---

const ProvidersContext = createContext<Providers | null>(null);

export function useProviders(): Providers {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error('useProviders must be used within a ProvidersProvider');
  return ctx;
}

// --- Auth Context ---

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (method: SignUpMethod, email?: string, password?: string) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within a ProvidersProvider');
  return ctx;
}

// --- Mode Context ---

const ModeContext = createContext<CSMode>('demoland');

export function useMode(): CSMode {
  return useContext(ModeContext);
}

// --- Combined Provider ---

function createProviders(mode: CSMode): Providers {
  if (mode === 'demoland') {
    return createDemoProviders();
  }
  return createRealProviders();
}

function resolveConfiguredMode(configuredMode: string | undefined): CSMode {
  if (configuredMode === 'realdeal') {
    return 'realdeal';
  }

  // Missing, misspelled, or unexpected configuration always falls back to
  // DemoLand. RealDeal may call approved external test services, so it must
  // only be enabled by the exact reviewed configuration value.
  return 'demoland';
}

interface ProvidersProviderProps {
  children: ReactNode;
}

export function ProvidersProvider({ children }: ProvidersProviderProps) {
  const mode = resolveConfiguredMode(import.meta.env.VITE_CS_MODE);
  const [providers] = useState(() => createProviders(mode));
  const [session, setSession] = useState<AuthSession | null>(null);

  const login = useCallback(
    async (method: SignUpMethod, email?: string, password?: string) => {
      const result = await providers.auth.login(method, email, password);
      setSession(result);
    },
    [providers],
  );

  const signup = useCallback(
    async (data: SignUpData) => {
      const result = await providers.auth.signup(data);
      setSession(result);
    },
    [providers],
  );

  const logout = useCallback(async () => {
    await providers.auth.logout();
    setSession(null);
  }, [providers]);

  const authValue: AuthContextValue = {
    session,
    isAuthenticated: session !== null,
    login,
    signup,
    logout,
  };

  return (
    <ModeContext.Provider value={mode}>
      <ProvidersContext.Provider value={providers}>
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      </ProvidersContext.Provider>
    </ModeContext.Provider>
  );
}
