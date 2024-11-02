import { expect, Locator, Page, test } from '@playwright/test';

export class MenuComponent {
  readonly page: Page;

  private readonly menuButton: Locator;
  private readonly deleteOption: Locator;
  private readonly editOption: Locator;
  private readonly selectOption: Locator;
  private readonly createOption: Locator;
  private readonly downloadOption: Locator;

  constructor(page: Page) {
    this.page = page;

    this.menuButton = page
      .locator('div.navbar--menu')
      .getByRole('button')
      .filter({ hasText: 'more_vert' });
    this.deleteOption = page.getByRole('menuitem', { name: 'Delete' });
    this.editOption = page.getByRole('menuitem', { name: 'Edit Calendar' });
    this.selectOption = page.getByRole('menuitem', {
      name: 'Select Calendar',
    });
    this.createOption = page.getByRole('menuitem', {
      name: 'Create New',
    });
    this.downloadOption = page.getByRole('menuitem', {
      name: 'Download',
    });
  }

  async deleteCalendar() {
    await test.step('Delete Calendar', async () => {
      await this.menuButton.click();
      await this.deleteOption.click();
    });
  }

  async selectEditCalendar() {
    await test.step('Edit Calendar', async () => {
      await this.menuButton.click();
      await this.editOption.click();
    });
  }

  async selectSelectCalendar() {
    await test.step('Select Calendar', async () => {
      await this.menuButton.click();
      await this.selectOption.click();
    });
  }

  async selectCreateCalendar() {
    await test.step('Create Calendar', async () => {
      await this.menuButton.click();
      await this.createOption.click();
    });
  }

  async selectDownloadCalendar() {
    await test.step('Download Calendar', async () => {
      await this.menuButton.click();
      await this.downloadOption.click();
    });
  }

  async openMenu() {
    await test.step('Open Menu', async () => {
      await this.menuButton.click();
      await expect(this.deleteOption).toBeVisible();
      await expect(this.selectOption).toBeVisible();
      await expect(this.editOption).toBeVisible();
      await expect(this.createOption).toBeVisible();
    });
  }
}
