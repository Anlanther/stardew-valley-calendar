import { expect, Locator, Page, test } from '@playwright/test';

export class SelectCalendarDialog {
  readonly page: Page;

  private readonly selectButton: Locator;
  private readonly calendarSelector: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.selectButton = page.getByRole('button', { name: 'Select' });
    this.calendarSelector = page.locator('mat-select');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async confirmSelect() {
    await test.step('Confirm Select', async () => {
      await this.selectButton.click();
    });
  }

  async selectCalendar(name: string) {
    await test.step('Select Calendar', async () => {
      await this.calendarSelector.click();
      await this.page.getByRole('option', { name, exact: true }).click();
      await this.selectButton.click();
    });
  }

  async clickCancel() {
    await test.step('Click Cancel', async () => {
      await this.cancelButton.click();
    });
  }

  async clickOnSelector() {
    await test.step('Click On Selector', async () => {
      await this.calendarSelector.click();
    });
  }

  async escapeSelector() {
    await test.step('Escape Selector', async () => {
      await this.page.keyboard.down('Escape');
    });
  }

  async verifySelectedCalendar(name: string) {
    await test.step('Verify Selected Calendar', async () => {
      const nameDisplayed = this.page.getByText(name, { exact: true });
      await expect(nameDisplayed).toBeVisible();
    });
  }
}
