import { expect, Locator, Page, test } from '@playwright/test';
import { EventForm } from '../../models/event-form.model';
import { Selectors } from '../../models/selectors.model';
import { CreateEventDialog } from './create-event-dialog';
import { EditEventDialog } from './edit-event-dialog';

export class SeasonDrawerComponent {
  readonly page: Page;

  private readonly seasonDrawer: Locator;
  private readonly createGoalButton: Locator;
  private readonly closeDrawerButton: Locator;

  private readonly createGoalDialog: CreateEventDialog;
  private readonly editGoalDialog: EditEventDialog;

  constructor(page: Page) {
    this.page = page;

    this.seasonDrawer = page.locator(Selectors.SEASON_FORM_COMPONENT);
    this.createGoalButton = page.getByRole('button', { name: 'Create Goal' });
    this.closeDrawerButton = page
      .locator('app-season-form button')
      .filter({ hasText: 'close' });

    this.createGoalDialog = new CreateEventDialog(page);
    this.editGoalDialog = new EditEventDialog(page);
  }

  async verifyIsVisible() {
    await test.step('Open Season Nav is Visible', async () => {
      await expect(this.seasonDrawer).toBeVisible();
      await this.closeDrawerButton.click();
    });
  }

  async close() {
    await test.step('Close Season Drawer', async () => {
      await this.closeDrawerButton.click();
    });
  }

  async openGoalSettingsMenu(goalTitle: string) {
    await test.step('Open Event Edit Menu', async () => {
      await this.page
        .getByRole('button', { name: new RegExp(`${goalTitle}$`) })
        .click();
      await this.page.getByLabel(goalTitle).getByRole('button').click();
      const editMenuButton = this.page.getByRole('menuitem', { name: 'Edit' });
      const deleteMenuButton = this.page.getByRole('menuitem', {
        name: 'Delete',
      });
      await expect(editMenuButton).toBeVisible();
      await expect(deleteMenuButton).toBeVisible();
    });
  }

  async openGoalEditDialog(goalTitle: string) {
    await test.step('Open Event Goal Dialog', async () => {
      await this.openGoalSettingsMenu(goalTitle);
      const editMenuButton = this.page.getByRole('menuitem', { name: 'Edit' });
      await editMenuButton.click();
    });
  }

  async verifyGoalDetailsInEditDialog(goalForm: EventForm) {
    await test.step('Verify Goal Details are Correctly Displayed in Edit Dialog', async () => {
      await this.openGoalEditDialog(goalForm.title);
      await this.editGoalDialog.verifyInput(goalForm);
      await this.editGoalDialog.clickCancelButton();
    });
  }

  async clickCreateGoalButton() {
    await test.step('Create Goal', async () => {
      await expect(this.seasonDrawer).toBeVisible();
      await this.createGoalButton.click();
    });
  }

  async createGoal(goalForm: EventForm) {
    await test.step('Create Goal', async () => {
      await this.clickCreateGoalButton();
      await this.createGoalDialog.createEvent(goalForm);
    });
  }

  async deleteGoal(goalTitle: string) {
    await test.step('Delete Goal', async () => {
      await this.openGoalSettingsMenu(goalTitle);
      await this.page.getByRole('menuitem', { name: 'Delete' }).click();
      await this.page.getByRole('button', { name: 'Delete' }).click();
    });
  }

  async verifyGoalOnSeasonDrawer(goalTitle: string, toBeVisible: boolean) {
    await test.step('Verify season form drawer has goal', async () => {
      const createdEvent = this.page.getByRole('button', {
        name: new RegExp(`${goalTitle}$`),
      });
      toBeVisible
        ? await expect(createdEvent).toBeVisible()
        : await expect(createdEvent).not.toBeVisible();
    });
  }

  async verifyGoalNameAndTagAreUnique(goalForm: EventForm) {
    await test.step('Verify Even Name and Tag are Unique', async () => {
      await this.clickCreateGoalButton();
      await this.createGoalDialog.fillTitleForm(goalForm.title);
      await this.createGoalDialog.verifyCreateButtonState(false);

      await this.clickCreateGoalButton();
      await this.createGoalDialog.selectTag(goalForm.tagCategory, goalForm.tag);
      await this.createGoalDialog.verifyCreateButtonState(false);

      await this.clickCreateGoalButton();
      await this.createGoalDialog.fillTitleForm(goalForm.title);
      await this.createGoalDialog.selectTag(goalForm.tagCategory, goalForm.tag);
      await this.createGoalDialog.verifyCreateButtonState(true);
    });
  }
}
