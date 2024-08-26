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

  async verifyCreateButtonState(disabled: boolean) {
    await test.step('Verify Create Button', async () => {
      disabled
        ? await expect(this.createButton).toBeDisabled()
        : await expect(this.createButton).toBeEnabled();
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
      const menuItemToHover = DISPLAYED_CATEGORY[tagCategory];
      await this.titleForm.fill(title);
      await this.tagMenu.click();
      await this.page.getByRole('menuitem', { name: menuItemToHover }).hover();
      await this.page.getByRole('menuitem', { name: tag }).click();
      await this.descriptionForm.fill(description);
      await this.recurringToggle.setChecked(isRecurring);
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
