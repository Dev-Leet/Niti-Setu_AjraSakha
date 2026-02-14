import { test, expect } from '@playwright/test';

test.describe('Eligibility Check', () => {
  test('completes eligibility check flow', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Get Started');
    
    await page.fill('input[name="fullName"]', 'Test Farmer');
    await page.fill('input[name="state"]', 'Maharashtra');
    await page.fill('input[name="landholding.totalArea"]', '5');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Checking eligibility')).toBeVisible();
    await expect(page.locator('text=Eligible Schemes')).toBeVisible({ timeout: 10000 });
  });
});