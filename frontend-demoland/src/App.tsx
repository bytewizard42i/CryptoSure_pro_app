import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ProvidersProvider } from './providers/context';
import { CSLayout } from './layouts/cs-layout';
import { AuthGuard } from './components/AuthGuard';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { Dashboard } from './pages/dashboard';
import { OnboardingPage } from './pages/onboarding';
import { PoliciesPage } from './pages/policies';
import { ClaimsPage } from './pages/claims';
import { EduPage } from './pages/edu';
import { PoolPage } from './pages/pool';
import { AIAssistantPage } from './pages/ai-assistant';

function App() {
  return (
    <ProvidersProvider>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<AuthGuard><CSLayout /></AuthGuard>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
            <Route path="/edu" element={<EduPage />} />
            <Route path="/pool" element={<PoolPage />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProvidersProvider>
  );
}

export default App;
