import { Locator, Page, test } from '@playwright/test';

export class SelectCalendarDialog {
  readonly page: Page;

  private readonly selectButton: Locator;
  private readonly calendarSelector: Locator;

  constructor(page: Page) {
    this.page = page;

    this.selectButton = this.page.getByRole('button', { name: 'Select' });
    this.calendarSelector = this.page.locator('mat-select');
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
}
