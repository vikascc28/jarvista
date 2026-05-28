import { test, expect } from '@playwright/test';

test('home page renders launch call-to-action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /launch jarvista/i })).toBeVisible();
});
