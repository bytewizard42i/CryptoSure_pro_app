import type { Providers } from '../types';
import { MockAuthProvider } from './mock-auth';
import { MockCreditScoreProvider } from './mock-credit-score';
import { MockPolicyProvider } from './mock-policy';
import { MockClaimProvider } from './mock-claim';
import { MockEduProvider } from './mock-edu';
import { MockPoolProvider } from './mock-pool';
import { MockDidzProvider } from './mock-didz';
import { MockAgenticDIDProvider } from './mock-agenticdid';
import { MockAIAssistantProvider } from './mock-ai';

export function createDemoProviders(): Providers {
  return {
    auth: new MockAuthProvider(),
    creditScore: new MockCreditScoreProvider(),
    policies: new MockPolicyProvider(),
    claims: new MockClaimProvider(),
    edu: new MockEduProvider(),
    pool: new MockPoolProvider(),
    didz: new MockDidzProvider(),
    agenticDID: new MockAgenticDIDProvider(),
    ai: new MockAIAssistantProvider(),
  };
}
