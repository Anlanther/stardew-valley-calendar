import { Locator, Page } from '@playwright/test';

export class MenuComponent {
  readonly page: Page;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.getByRole('button');
  }
}
