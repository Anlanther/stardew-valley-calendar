import { Locator, Page, expect, test } from '@playwright/test';
import { CalendarForm } from '../models/calendar-form.model';
import { URL } from '../models/url.model';
import { CreateCalendarDialog } from './components/create-calendar-dialog';
import { SelectCalendarDialog } from './components/select-calendar-dialog';

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

  async openCalendarReadyPage() {
    await test.step('Open Welcome Page with API Ready and Calendars Loaded', async () => {
      await this.page.goto(URL.LOCAL_APP);
      await this.page.waitForSelector('section.welcome__actions');
      await expect(this.createCalendarButton).toBeVisible();
    });
  }

  async verifyApiConnectionFailedMessage() {
    await test.step('Verify API Connection Failed message', async () => {
      await expect(this.apiConnectionFailedMessage).toBeVisible();
    });
  }

  async verifyNoExistingCalendarsMessage() {
    await test.step('Verify Welcome Page with No Existing Calendar Message and Create Calendar Option', async () => {
      await expect(this.noExistingCalendarsMessage).toBeVisible();
      await expect(this.createCalendarButton).toBeVisible();
    });
  }

  async verifySelectOrCreateCalendarMessage() {
    await test.step('Verify Welcome Page with Existing Calendars to Select or Create Calendar Option', async () => {
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

  async openExistingCalendar(name: string) {
    await test.step('Open Existing Calendar', async () => {
      await this.openCalendarReadyPage();
      await this.selectCalendarButton.click();
      await this.selectCalendarDialog.selectCalendar(name);
    });
  }

  async selectOrCreateCalendar(calendarForm: CalendarForm) {
    await test.step('Open Existing Calendar', async () => {
      await this.openCalendarReadyPage();
      await expect(this.apiConnectionFailedMessage).not.toBeVisible();
      const createButtonIsVisible = await this.selectCalendarButton.isVisible();
      if (!createButtonIsVisible) {
        await this.clickCreateCalendar();
        return await this.createCalendarDialog.createCalendar(calendarForm);
      }

      await this.selectCalendarButton.click();
      await this.selectCalendarDialog.clickOnSelector();
      const calendarOptionExists = await this.page
        .getByRole('option', { name: calendarForm.name, exact: true })
        .isVisible();
      await this.selectCalendarDialog.escapeSelector();
      if (!calendarOptionExists) {
        await this.selectCalendarDialog.clickCancelButton();
        await this.clickCreateCalendar();
        return await this.createCalendarDialog.createCalendar(calendarForm);
      }

      await this.selectCalendarDialog.selectCalendar(calendarForm.name);
    });
  }

  async verifyCreateActionIsDisabled() {
    await test.step('Verify Create Calendar Action is Disabled by Default', async () => {
      await this.clickCreateCalendar();
      await this.createCalendarDialog.verifyCreateButtonIsDisabled();
      await this.createCalendarDialog.clickCancelButton();
    });
  }

  async verifyCreateActionRequiresName(calendarForm: CalendarForm) {
    await test.step('Verify Create Calendar Action is Disabled Unless Name is Provided', async () => {
      await this.clickCreateCalendar();
      await this.createCalendarDialog.fillForm(calendarForm);
      await this.createCalendarDialog.verifyCreateButtonIsDisabled();
      await this.createCalendarDialog.clickCancelButton();
    });
  }
}
