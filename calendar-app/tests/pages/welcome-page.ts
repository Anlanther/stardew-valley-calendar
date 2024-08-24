import { Locator, Page, expect, test } from '@playwright/test';
import { UnsavedCalendar } from '../../src/app/models/calendar.model';
import { URL } from '../models/url.model';
import { CreateCalendarDialog } from './create-calendar-dialog';
import { SelectCalendarDialog } from './select-calendar-dialog';

export class WelcomePage {
  readonly page: Page;

  private readonly apiConnectionFailedMessage: Locator;
  private readonly noExistingCalendarsMessage: Locator;
  private readonly selectOrCreateCalendarMessage: Locator;
  private readonly createCalendarButton: Locator;
  private readonly selectCalendarButton: Locator;

  private readonly createCalendarDialog: CreateCalendarDialog;
  private readonly selectCalendarDialog: SelectCalendarDialog;

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
      name: 'Select Calendar',
    });

    this.createCalendarDialog = new CreateCalendarDialog(page);
    this.selectCalendarDialog = new SelectCalendarDialog(page);
  }

  async openPage() {
    await test.step('Open Welcome Page', async () => {
      await this.page.goto(URL.LOCAL_APP);
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

  async clickCreateCalendar() {
    await test.step('Click Create Calendar', async () => {
      await expect(this.apiConnectionFailedMessage).not.toBeVisible();
      await expect(this.createCalendarButton).toBeVisible();

      await this.createCalendarButton.click();
    });
  }

  async clickSelectCalendar() {
    await test.step('Click Select Calendar', async () => {
      await expect(this.apiConnectionFailedMessage).not.toBeVisible();
      await expect(this.selectCalendarButton).toBeVisible();

      await this.selectCalendarButton.click();
    });
  }

  async openAndCreateCalendar(calendar: UnsavedCalendar) {
    await test.step('Create Calendar', async () => {
      await this.openPage();
      await this.clickCreateCalendar();
      await this.createCalendarDialog.fillForm(
        calendar.name,
        calendar.description,
        calendar.systemConfig.includeBirthdays,
        calendar.systemConfig.includeFestivals,
        calendar.systemConfig.includeCrops,
      );
      await this.createCalendarDialog.clickCreateButton();
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async openExistingCalendar(name: string) {
    await test.step('Open Existing Calendar', async () => {
      await this.openPage();
      await this.selectCalendarButton.click();
      await this.selectCalendarDialog.selectCalendar(name);
    });
  }
}
