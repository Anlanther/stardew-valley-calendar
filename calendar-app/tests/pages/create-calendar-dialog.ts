import { Locator, Page, expect, test } from '@playwright/test';
import { UnsavedCalendar } from '../../src/app/models/calendar.model';

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

  async verifyCreateButtonIsDisabled() {
    await test.step('Verify Create Button is Disabled', async () => {
      await expect(this.createButton).toBeDisabled();
    });
  }

  async verifyCreateButtonIsEnabled() {
    await test.step('Verify Create Button is Enabled', async () => {
      await expect(this.createButton).toBeEnabled();
    });
  }

  async fillForm(
    name: string,
    description: string,
    includeBirthdays: boolean,
    includeFestivals: boolean,
    includeCrops: boolean,
  ) {
    await test.step('Create Mock Calendar', async () => {
      await this.nameForm.fill(name);
      await this.descriptionForm.fill(description);
      await this.includeBirthdaysToggle.setChecked(includeBirthdays);
      await this.includeFestivalsToggle.setChecked(includeFestivals);
      await this.includeCropsToggle.setChecked(includeCrops);
    });
  }

  async clickCreateButton() {
    await test.step('Click Create Button', async () => {
      await this.createButton.click();
    });
  }

  async createCalendar(calendar: UnsavedCalendar) {
    await test.step('Create Calendar', async () => {
      await this.fillForm(
        calendar.name,
        calendar.description,
        calendar.systemConfig.includeBirthdays,
        calendar.systemConfig.includeFestivals,
        calendar.systemConfig.includeCrops,
      );
      await this.clickCreateButton();
    });
  }
}
