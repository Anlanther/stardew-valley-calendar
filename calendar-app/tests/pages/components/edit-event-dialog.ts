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
    this.tagMenu = page.getByRole('button', { name: 'Tag*' });
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
