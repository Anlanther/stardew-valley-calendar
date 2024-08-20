import { Locator, Page, expect, test } from '@playwright/test';
import { URLS } from '../constants/urls.constant';

export class WelcomePage {
  readonly page: Page;
  readonly apiConnectionFailedMessage: Locator;
  readonly noExistingCalendarsMessage: Locator;
  readonly selectOrCreateCalendarMessage: Locator;
  readonly createCalendarButton: Locator;
  readonly selectCalendarButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.apiConnectionFailedMessage = page.getByText(
      'Please start up the Strapi',
    );
    this.noExistingCalendarsMessage = page.getByText(
      'Please create a calendar to start.',
    );
    this.selectOrCreateCalendarMessage = page.getByText(
      'Please select a calendar or create one to start.',
    );
    this.createCalendarButton = page.getByRole('button', {
      name: 'Create New',
    });
    this.selectCalendarButton = page.getByRole('button', {
      name: 'Open Calendar',
    });
  }

  async openPage() {
    await test.step('Open Welcome Page', async () => {
      await this.page.goto(URLS.LOCAL_APP);
    });
  }

  async verifyApiConnectionFailedMessage() {
    await test.step('Verify API Connection Failed message', async () => {
      await expect(this.apiConnectionFailedMessage).toBeVisible();
    });
  }

  async verifyNoExistingCalendarsMessage() {
    await test.step('Verify API Connection Failed message', async () => {
      await expect(this.noExistingCalendarsMessage).toBeVisible();
      await expect(this.createCalendarButton).toBeVisible();
    });
  }

  async verifySelectOrCreateCalendarMessage() {
    await test.step('Verify API Connection Failed message', async () => {
      await expect(this.selectOrCreateCalendarMessage).toBeVisible();
      await expect(this.createCalendarButton).toBeVisible();
      await expect(this.selectCalendarButton).toBeVisible();
    });
  }
}
