import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ProvidersProvider } from './providers/context';
import { CSLayout } from './layouts/cs-layout';
import { AuthGuard } from './components/AuthGuard';

// Each route is loaded only when the visitor opens it. This keeps the first
// download focused on the application shell while preserving exactly the same
// routes and page components in both evidence environments.
const LoginPage = lazy(() =>
  import('./pages/login').then((pageModule) => ({
    default: pageModule.LoginPage,
  })),
);
const SignupPage = lazy(() =>
  import('./pages/signup').then((pageModule) => ({
    default: pageModule.SignupPage,
  })),
);
const TourPage = lazy(() =>
  import('./pages/tour').then((pageModule) => ({
    default: pageModule.TourPage,
  })),
);
const Dashboard = lazy(() =>
  import('./pages/dashboard').then((pageModule) => ({
    default: pageModule.Dashboard,
  })),
);
const OnboardingPage = lazy(() =>
  import('./pages/onboarding').then((pageModule) => ({
    default: pageModule.OnboardingPage,
  })),
);
const PoliciesPage = lazy(() =>
  import('./pages/policies').then((pageModule) => ({
    default: pageModule.PoliciesPage,
  })),
);
const ClaimsPage = lazy(() =>
  import('./pages/claims').then((pageModule) => ({
    default: pageModule.ClaimsPage,
  })),
);
const EduPage = lazy(() =>
  import('./pages/edu').then((pageModule) => ({
    default: pageModule.EduPage,
  })),
);
const PoolPage = lazy(() =>
  import('./pages/pool').then((pageModule) => ({
    default: pageModule.PoolPage,
  })),
);
const InsuranceLabPage = lazy(() =>
  import('./pages/lab').then((pageModule) => ({
    default: pageModule.InsuranceLabPage,
  })),
);
const AIAssistantPage = lazy(() =>
  import('./pages/ai-assistant').then((pageModule) => ({
    default: pageModule.AIAssistantPage,
  })),
);

function PageLoadingFallback() {
  return (
    <main
      className="cs-loading-screen flex min-h-screen items-center justify-center px-6 text-slate-200"
      role="status"
    >
      <div className="text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600"
        />
        <p className="text-sm font-medium">Loading CryptoSure…</p>
      </div>
    </main>
  );
}

function App() {
  return (
    <ProvidersProvider>
      <BrowserRouter basename="/">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/tour" element={<TourPage />} />
            <Route element={<AuthGuard><CSLayout /></AuthGuard>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/claims" element={<ClaimsPage />} />
              <Route path="/edu" element={<EduPage />} />
              <Route path="/pool" element={<PoolPage />} />
              <Route path="/lab" element={<InsuranceLabPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ProvidersProvider>
  );
}

export default App;
