import { Locator, Page, test } from '@playwright/test';

export class DeleteCalendarDialog {
  readonly page: Page;

  private readonly deleteButton: Locator;
  private readonly message: Locator;

  constructor(page: Page) {
    this.page = page;

    this.deleteButton = this.page.getByRole('button', { name: 'Delete' });
    this.message = this.page.getByText(/Are you sure you want to/);
  }

  async confirmDelete() {
    await test.step('Delete', async () => {
      await this.deleteButton.click();
    });
  }
}
