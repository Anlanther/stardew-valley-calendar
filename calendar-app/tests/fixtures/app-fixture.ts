import { test as base } from '@playwright/test';
import { WelcomePage } from '../pages/welcome-page';

type AppFixtures = {
  welcomePage: WelcomePage;
};

export const test = base.extend<AppFixtures>({
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },
});
export const beforeEach = test.beforeEach;
