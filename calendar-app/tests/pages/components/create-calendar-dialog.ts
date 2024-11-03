import { Locator, Page, expect, test } from '@playwright/test';
import { CalendarForm } from '../../models/calendar-form.model';

export class CreateCalendarDialog {
  readonly page: Page;

  private readonly nameForm: Locator;
  private readonly descriptionForm: Locator;
  private readonly includeBirthdaysToggle: Locator;
  private readonly includeFestivalsToggle: Locator;
  private readonly includeCropsToggle: Locator;
  private readonly createButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameForm = page.getByPlaceholder('My First Calendar');
    this.descriptionForm = page.getByText('Description');
    this.includeBirthdaysToggle = page.getByLabel('Include Birthdays');
    this.includeFestivalsToggle = page.getByLabel('Include Festivals');
    this.includeCropsToggle = page.getByLabel('Include Crops');
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async verifyCreateButtonStatus(isEnabled: boolean) {
    await test.step('Verify Create Button is in Correct State', async () => {
      if (isEnabled) {
        return await expect(this.createButton).toBeEnabled();
      }
      await expect(this.createButton).toBeDisabled();
    });
  }

  async verifyErrorState(
    calendar: CalendarForm,
    errorMessage: string,
    isVisible: boolean,
  ) {
    await test.step('Verify Error State Appears Correctly', async () => {
      const messageLocator = this.page.getByText(errorMessage);

      await this.fillForm(calendar);
      if (isVisible) {
        await this.verifyCreateButtonStatus(false);
        await expect(messageLocator).toBeVisible();
        await this.clickCancelButton();
        return;
      }
      await this.verifyCreateButtonStatus(true);
      await expect(messageLocator).not.toBeVisible();
      await this.clickCancelButton();
    });
  }

  async fillForm(calendarForm: CalendarForm) {
    await test.step('Create Mock Calendar', async () => {
      await this.nameForm.fill(calendarForm.name);
      await this.descriptionForm.fill(calendarForm.description);
      await this.includeBirthdaysToggle.setChecked(
        calendarForm.includeBirthdays,
      );
      await this.includeFestivalsToggle.setChecked(
        calendarForm.includeFestivals,
      );
      await this.includeCropsToggle.setChecked(calendarForm.includeCrops);
    });
  }

  async clickCreateButton() {
    await test.step('Click Create Button', async () => {
      await this.createButton.click();
    });
  }

  async clickCancelButton() {
    await test.step('Click Cancel Button', async () => {
      await this.cancelButton.click();
    });
  }

  async createCalendar(calendarForm: CalendarForm) {
    await test.step('Create Calendar', async () => {
      await this.fillForm(calendarForm);
      await this.clickCreateButton();
    });
  }
}
