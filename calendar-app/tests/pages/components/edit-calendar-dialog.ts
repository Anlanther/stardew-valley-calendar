import { Locator, Page, expect, test } from '@playwright/test';
import { CalendarForm } from '../../models/calendar-form.model';

export class EditCalendarDialog {
  readonly page: Page;

  private readonly nameForm: Locator;
  private readonly descriptionForm: Locator;
  private readonly includeBirthdaysToggle: Locator;
  private readonly includeFestivalsToggle: Locator;
  private readonly includeCropsToggle: Locator;
  private readonly yearForm: Locator;
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
    this.yearForm = page.getByPlaceholder('1');
  }

  async verifyEditButtonStatus(isEnabled: boolean) {
    await test.step('Verify Edit Button is in Correct State', async () => {
      if (isEnabled) {
        await expect(this.editButton).toBeEnabled();
      }
      await expect(this.editButton).toBeDisabled();
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
        await this.verifyEditButtonStatus(false);
        await expect(messageLocator).toBeVisible();
        await this.clickCancelButton();
        return;
      }
      await this.verifyEditButtonStatus(true);
      await expect(messageLocator).not.toBeVisible();
      await this.clickCancelButton();
    });
  }

  async fillForm(calendarForm: CalendarForm) {
    await test.step('Edit Mock Calendar', async () => {
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

  async updateNameForm(name: string) {
    await test.step('Edit Mock Calendar Name', async () => {
      await this.nameForm.fill(name);
    });
  }

  async updateDescriptionForm(description: string) {
    await test.step('Edit Mock Calendar Description', async () => {
      await this.descriptionForm.fill(description);
    });
  }

  async updateIncludeBirthdaysCheckbox(includeBirthdays: boolean) {
    await test.step('Edit Mock Calendar includeBirthdays', async () => {
      await this.includeBirthdaysToggle.setChecked(includeBirthdays);
    });
  }

  async updateYearForm(year: number) {
    await test.step('Edit Mock Calendar yearForm', async () => {
      await this.yearForm.fill(`${year}`);
    });
  }

  async updateIncludeCropsCheckbox(includeCrops: boolean) {
    await test.step('Edit Mock Calendar includeCrops', async () => {
      await this.includeCropsToggle.setChecked(includeCrops);
    });
  }

  async updateIncludeFestivalsCheckbox(includeFestivals: boolean) {
    await test.step('Edit Mock Calendar includeFestivals', async () => {
      await this.includeFestivalsToggle.setChecked(includeFestivals);
    });
  }

  async clickEditButton() {
    await test.step('Click Edit Button', async () => {
      await this.editButton.click();
    });
  }

  async clickCancelButton() {
    await test.step('Click Cancel Button', async () => {
      await this.cancelButton.click();
    });
  }

  async verifyInput(calendarForm: CalendarForm) {
    await test.step('Verify current calendar settings are set', async () => {
      await expect(this.nameForm).toHaveValue(calendarForm.name);
      await expect(this.descriptionForm).toHaveValue(calendarForm.description);
      calendarForm.includeBirthdays
        ? await expect(this.includeBirthdaysToggle).toBeChecked()
        : await expect(this.includeBirthdaysToggle).not.toBeChecked();
      calendarForm.includeCrops
        ? await expect(this.includeCropsToggle).toBeChecked()
        : await expect(this.includeCropsToggle).not.toBeChecked();
      calendarForm.includeFestivals
        ? await expect(this.includeFestivalsToggle).toBeChecked()
        : await expect(this.includeFestivalsToggle).not.toBeChecked();
    });
  }
}
