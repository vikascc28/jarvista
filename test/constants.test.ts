import { describe, expect, it } from 'vitest';
import { AI_GUARDRAILS, PLAN_LIMITS } from '@/lib/constants';

describe('constants', () => {
  it('keeps pro plan credits higher than free plan', () => {
    expect(PLAN_LIMITS.proCredits).toBeGreaterThan(PLAN_LIMITS.freeCredits);
  });

  it('has a non-zero prompt guardrail', () => {
    expect(AI_GUARDRAILS.maxPromptChars).toBeGreaterThan(0);
  });
});
