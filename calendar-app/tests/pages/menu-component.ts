import { expect, Locator, Page, test } from '@playwright/test';
import { DeleteDialog } from './delete-dialog';
import { SelectCalendarDialog } from './select-calendar-dialog';

export class MenuComponent {
  readonly page: Page;

  private readonly menuButton: Locator;
  private readonly deleteOption: Locator;
  private readonly selectCalendarOption: Locator;

  private readonly deleteDialog: DeleteDialog;
  private readonly selectDialog: SelectCalendarDialog;

  constructor(page: Page) {
    this.page = page;

    this.menuButton = page.locator('[data-test="settings-menu"]');
    this.deleteOption = page.getByRole('menuitem', { name: 'Delete' });
    this.selectCalendarOption = page.getByRole('menuitem', {
      name: 'Select Calendar',
    });

    this.deleteDialog = new DeleteDialog(page);
    this.selectDialog = new SelectCalendarDialog(page);
  }

  async deleteCalendar() {
    test.step('Delete Calendar', async () => {
      await this.menuButton.click();
      await this.deleteOption.click();
      await this.deleteDialog.confirmDelete();
    });
  }

  async selectCalendar(name: string) {
    test.step('Select Calendar', async () => {
      await this.menuButton.click();
      await this.selectCalendarOption.click();
      await this.selectDialog.selectCalendar(name);
    });
  }

  async openMenu() {
    test.step('Open Menu', async () => {
      await this.menuButton.click();
      await expect(this.deleteOption).toBeVisible();
      await expect(this.selectCalendarOption).toBeVisible();
    });
  }
}
