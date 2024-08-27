import { Locator, Page, expect, test } from '@playwright/test';
import { TagCategory } from '../../../src/app/models/tag-category.model';
import { Tag } from '../../../src/app/models/tag.model';
import { EventForm } from '../../models/event-form.model';
import { DISPLAYED_CATEGORY } from '../../models/tag-category.model';

export class CreateEventDialog {
  readonly page: Page;

  private readonly titleForm: Locator;
  private readonly tagMenu: Locator;
  private readonly descriptionForm: Locator;
  private readonly recurringToggle: Locator;
  private readonly createButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.titleForm = page.getByPlaceholder('Defeat 5 slimes');
    this.tagMenu = page.getByRole('button', { name: 'Tag*' });
    this.descriptionForm = page.getByText('Description');
    this.recurringToggle = page.getByLabel('Recurring');
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async verifyCreateButtonState(enabled: boolean) {
    await test.step('Verify Create Button', async () => {
      enabled
        ? await expect(this.createButton).toBeEnabled()
        : await expect(this.createButton).toBeDisabled();
      await this.clickCancelButton();
    });
  }

  async clickCancelButton() {
    await test.step('Click Cancel Button', async () => {
      await this.cancelButton.click();
    });
  }

  async fillForm(
    title: string,
    tagCategory: TagCategory,
    tag: Tag,
    description: string,
    isRecurring: boolean,
  ) {
    await test.step('Create Mock Event', async () => {
      await this.fillTitleForm(title);
      await this.selectTag(tagCategory, tag);
      await this.descriptionForm.fill(description);
      await this.recurringToggle.setChecked(isRecurring);
    });
  }

  async fillTitleForm(title: string) {
    await test.step('Fill Title Form', async () => {});
    await this.titleForm.fill(title);
  }

  async selectTag(tagCategory: TagCategory, tag: Tag) {
    await test.step('Select Tag', async () => {
      const menuItemToHover = DISPLAYED_CATEGORY[tagCategory];
      await this.tagMenu.click();
      await this.page.getByRole('menuitem', { name: menuItemToHover }).hover();
      await this.page.getByRole('menuitem', { name: tag }).click();
    });
  }

  async clickCreateButton() {
    await test.step('Click Create Button', async () => {
      await this.createButton.click();
    });
  }

  async createEvent(formDetails: EventForm) {
    await test.step('Create Calendar', async () => {
      await this.fillForm(
        formDetails.title,
        formDetails.tagCategory,
        formDetails.tag,
        formDetails.description,
        formDetails.isRecurring,
      );
      await this.clickCreateButton();
    });
  }
}
