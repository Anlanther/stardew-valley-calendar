import { expect, Locator, Page, test } from '@playwright/test';

export class DevMenuComponent {
  readonly page: Page;

  private readonly menuButton: Locator;
  private readonly setTokenOption: Locator;
  private readonly updateSystemOption: Locator;
  private readonly disableSamplesOption: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuButton = page.locator('button').filter({ hasText: 'more_vert' });
    this.setTokenOption = page.getByRole('menuitem', { name: 'Set Token' });
    this.updateSystemOption = page.getByRole('menuitem', {
      name: 'Update System',
    });
    this.disableSamplesOption = page.getByRole('menuitem', {
      name: 'Disable Samples',
    });
  }

  async selectDisableSamples() {
    await test.step('Disable Samples', async () => {
      await this.menuButton.click();
      await this.disableSamplesOption.click();
    });
  }

  async open() {
    await test.step('Open Menu', async () => {
      await this.menuButton.click();
      await expect(this.setTokenOption).toBeVisible();
      await expect(this.updateSystemOption).toBeVisible();
      await expect(this.disableSamplesOption).toBeVisible();
    });
  }
}
