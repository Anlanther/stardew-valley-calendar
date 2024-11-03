import { Locator, Page, expect, test } from '@playwright/test';
import { Tag } from 'storybook/internal/types';
import { TagCategory } from '../../../src/app/models/tag-category.model';
import { EventForm } from '../../models/event-form.model';
import { DISPLAYED_CATEGORY } from '../../models/tag-category.model';

export class EditEventDialog {
  readonly page: Page;

  private readonly titleForm: Locator;
  private readonly tagMenu: Locator;
  private readonly descriptionForm: Locator;
  private readonly recurringToggle: Locator;
  private readonly editButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.titleForm = page.getByPlaceholder('Defeat 5 slimes');
    this.tagMenu = page.locator('button.tag-menu--button');
    this.descriptionForm = page.getByText('Description');
    this.recurringToggle = page.getByLabel('Recurring');
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async verifyEditButtonState(disabled: boolean) {
    await test.step('Verify Edit Button', async () => {
      disabled
        ? await expect(this.editButton).toBeDisabled()
        : await expect(this.editButton).toBeEnabled();
    });
  }

  async updateTitleForm(title: string) {
    await test.step('Edit Mock Event Title', async () => {
      await this.titleForm.fill(title);
    });
  }

  async fillForm(eventForm: EventForm) {
    await test.step('Edit Mock Event', async () => {
      await this.updateTitleForm(eventForm.title);
      await this.updateTagMenu(eventForm.tagCategory, eventForm.tag);
      await this.updateDescriptionForm(eventForm.description);
      await this.recurringToggle.setChecked(eventForm.isRecurring);
    });
  }

  async verifyErrorState(
    eventForm: EventForm,
    errorMessage: string,
    isVisible: boolean,
  ) {
    await test.step('Verify Error State Appears Correctly', async () => {
      const messageLocator = this.page.getByText(errorMessage);

      await this.fillForm(eventForm);
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

  async verifyEditButtonStatus(isEnabled: boolean) {
    await test.step('Verify Edit Button is in Correct State', async () => {
      if (isEnabled) {
        return await expect(this.editButton).toBeEnabled();
      }
      await expect(this.editButton).toBeDisabled();
    });
  }

  async updateTagMenu(tagCategory: TagCategory, tag: Tag) {
    await test.step('Edit Mock Event Tag', async () => {
      const menuItemToHover = DISPLAYED_CATEGORY[tagCategory];
      await this.tagMenu.click();
      await this.page.getByRole('menuitem', { name: menuItemToHover }).hover();
      await this.page.getByRole('menuitem', { name: tag }).click();
    });
  }

  async updateDescriptionForm(description: string) {
    await test.step('Edit Mock Event Description', async () => {
      await this.descriptionForm.fill(description);
    });
  }

  async updateRecurringToggle(isRecurring: boolean) {
    await test.step('Edit Mock Event Recurrence', async () => {
      await this.recurringToggle.setChecked(isRecurring);
    });
  }

  async clickEditButton() {
    await test.step('Click Edit Button to Submit', async () => {
      await this.editButton.click();
    });
  }

  async verifyInput(event: EventForm) {
    await test.step('Verify current event settings are set', async () => {
      const selectedTag = this.page.locator('button.tag-menu--button');
      await expect(this.titleForm).toHaveValue(event.title);
      await expect(selectedTag).toHaveText(new RegExp(event.tag, 'i'));
      await expect(this.descriptionForm).toHaveValue(event.description);
      event.isRecurring
        ? await expect(this.recurringToggle).toBeChecked()
        : await expect(this.recurringToggle).not.toBeChecked();
    });
  }

  async clickCancelButton() {
    await test.step('Click Cancel Button to Close', async () => {
      await this.cancelButton.click();
    });
  }
}
