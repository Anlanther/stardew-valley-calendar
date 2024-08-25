import { Locator, Page, expect, test } from '@playwright/test';
import { UnsavedCalendar } from '../../src/app/models/calendar.model';

export class EditCalendarDialog {
  readonly page: Page;

  private readonly nameForm: Locator;
  private readonly descriptionForm: Locator;
  private readonly includeBirthdaysToggle: Locator;
  private readonly includeFestivalsToggle: Locator;
  private readonly includeCropsToggle: Locator;
  private readonly editButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameForm = page.getByPlaceholder('My First Calendar');
    this.descriptionForm = page.getByText('Description');
    this.includeBirthdaysToggle = page.getByLabel('Include Birthdays');
    this.includeFestivalsToggle = page.getByLabel('Include Festivals');
    this.includeCropsToggle = page.getByLabel('Include Crops');
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async verifyEditButtonIsDisabled() {
    await test.step('Verify Edit Button is Disabled', async () => {
      await expect(this.editButton).toBeDisabled();
    });
  }

  async fillForm(
    name: string,
    description: string,
    includeBirthdays: boolean,
    includeFestivals: boolean,
    includeCrops: boolean,
  ) {
    await test.step('Edit Mock Calendar', async () => {
      await this.nameForm.fill(name);
      await this.descriptionForm.fill(description);
      await this.includeBirthdaysToggle.setChecked(includeBirthdays);
      await this.includeFestivalsToggle.setChecked(includeFestivals);
      await this.includeCropsToggle.setChecked(includeCrops);
    });
  }

  async clickCreateButton() {
    await test.step('Click Create Button', async () => {
      await this.editButton.click();
    });
  }

  async verifyInput(calendar: UnsavedCalendar) {
    await test.step('Verify current calendar settings are set', async () => {
      await expect(this.nameForm).toHaveValue(calendar.name);
      await expect(this.descriptionForm).toHaveValue(calendar.description);
      calendar.systemConfig.includeBirthdays
        ? await expect(this.includeBirthdaysToggle).toBeChecked()
        : await expect(this.includeBirthdaysToggle).not.toBeChecked();
      calendar.systemConfig.includeCrops
        ? await expect(this.includeCropsToggle).toBeChecked()
        : await expect(this.includeCropsToggle).not.toBeChecked();
      calendar.systemConfig.includeFestivals
        ? await expect(this.includeFestivalsToggle).toBeChecked()
        : await expect(this.includeFestivalsToggle).not.toBeChecked();
    });
  }
}
