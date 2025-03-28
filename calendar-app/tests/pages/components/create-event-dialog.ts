import { Locator, Page, expect, test } from '@playwright/test';
import { TagCategory } from '../../../src/app/constants/tag-category.constant';
import { Tag } from '../../../src/app/constants/tag.constant';
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
    this.tagMenu = page.locator('button.tag-menu--button');
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

  async verifyErrorState(
    eventForm: EventForm,
    errorMessage: string,
    isVisible: boolean,
  ) {
    await test.step('Verify Error State Appears Correctly', async () => {
      const messageLocator = this.page.getByText(errorMessage);

      await this.fillForm(eventForm);
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

  async verifyCreateButtonStatus(isEnabled: boolean) {
    await test.step('Verify Create Button is in Correct State', async () => {
      if (isEnabled) {
        return await expect(this.createButton).toBeEnabled();
      }
      await expect(this.createButton).toBeDisabled();
    });
  }

  async clickCancelButton() {
    await test.step('Click Cancel Button', async () => {
      await this.cancelButton.click();
    });
  }

  async fillForm(eventForm: EventForm) {
    await test.step('Create Mock Event', async () => {
      await this.fillTitleForm(eventForm.title);
      await this.selectTag(eventForm.tagCategory, eventForm.tag);
      await this.descriptionForm.fill(eventForm.description);
      await this.recurringToggle.setChecked(eventForm.isRecurring);
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
      await this.fillForm(formDetails);
      await this.clickCreateButton();
    });
  }
}
