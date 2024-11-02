import { Locator, Page, expect, test } from '@playwright/test';
import { CalendarForm } from '../models/calendar-form.model';
import { URL } from '../models/url.model';
import { MOCK_CALENDAR_FORM } from '../utils/mocks/calendar-form';
import { CreateCalendarDialog } from './components/create-calendar-dialog';
import { SelectCalendarDialog } from './components/select-calendar-dialog';

export class WelcomePage {
  readonly page: Page;

  private readonly apiConnectionFailedMessage: Locator;
  private readonly noExistingCalendarsMessage: Locator;
  private readonly selectOrCreateCalendarMessage: Locator;
  private readonly createCalendarButton: Locator;
  private readonly selectCalendarButton: Locator;
  private readonly offlineModeButton: Locator;
  private readonly loadCalendarButton: Locator;

  private readonly createCalendarDialog: CreateCalendarDialog;
  private readonly selectCalendarDialog: SelectCalendarDialog;

  constructor(page: Page) {
    this.page = page;
    this.apiConnectionFailedMessage = page.locator('section.fail-message');
    this.noExistingCalendarsMessage = page.locator('p.no-existing-message');
    this.selectOrCreateCalendarMessage = page.locator(
      'p.with-existing-message',
    );
    this.createCalendarButton = page.getByRole('button', {
      name: 'Create New',
    });
    this.selectCalendarButton = page.getByRole('button', {
      name: 'Select Calendar',
    });
    this.offlineModeButton = page.getByRole('button', {
      name: 'Offline Mode',
    });
    this.loadCalendarButton = page.getByRole('button', {
      name: 'Load Calendar',
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
      const offlineModeButtonIsVisible =
        await this.offlineModeButton.isVisible();

      if (offlineModeButtonIsVisible) {
        await this.offlineModeButton.click();
      }

      await expect(this.createCalendarButton).toBeVisible();
    });
  }

  async clickOfflineMode() {
    await test.step('Click Offline Mode', async () => {
      await this.offlineModeButton.click();
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

  async clickLoadCalendar() {
    await test.step('Click Load Calendar', async () => {
      await expect(this.apiConnectionFailedMessage).not.toBeVisible();
      await expect(this.loadCalendarButton).toBeVisible();

      await this.loadCalendarButton.click();
    });
  }

  async loadCalendar(filePath: string) {
    await test.step('Load Calendar', async () => {
      const handle = this.page.locator('input[type="file"]');
      await handle.setInputFiles(filePath);
    });
  }

  async openExistingCalendar(name: string) {
    await test.step('Open Existing Calendar', async () => {
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

  async verifyCreateActionIsDisabledByDefault() {
    await test.step('Verify Create Calendar Action is Disabled by Default', async () => {
      await this.clickCreateCalendar();
      await this.createCalendarDialog.verifyCreateButtonIsDisabled();
      await this.createCalendarDialog.clickCancelButton();
    });
  }

  async verifyCreateActionRequiresName() {
    await test.step('Verify Create Calendar Action is Disabled Unless Name is Provided', async () => {
      const mockCalendarNoName: CalendarForm = {
        ...MOCK_CALENDAR_FORM,
        name: '',
      };

      await this.clickCreateCalendar();
      await this.createCalendarDialog.fillForm(mockCalendarNoName);
      await this.createCalendarDialog.verifyCreateButtonIsDisabled();
      await this.createCalendarDialog.clickCancelButton();
    });
  }

  async verifyTestCalendarsDeleted(calendarName: string) {
    await this.openCalendarReadyPage();
    const hasExistingCalendars = await this.selectCalendarButton.isVisible();

    if (hasExistingCalendars) {
      await this.selectCalendarButton.click();
      await this.selectCalendarDialog.verifyCalendarIsNotVisible(calendarName);
      return;
    }
    await this.verifyNoExistingCalendarsMessage();
    return;
  }

  async verifyCalendarInSelectDialog(
    calendarName: string,
    expectVisible: boolean,
  ) {
    await test.step('Verify Calendar is Selectable in the Select Dialog', async () => {
      await this.clickSelectCalendar();
      await this.selectCalendarDialog.verifyCalendarIsAnOption(
        calendarName,
        expectVisible,
      );
      await this.selectCalendarDialog.escapeSelector();
      await this.selectCalendarDialog.clickCancelButton();
    });
  }
}
