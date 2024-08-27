import { expect, Locator, Page, test } from '@playwright/test';
import { Season } from '../../../src/app/models/season.model';
import { EventForm } from '../../models/event-form.model';
import { Selectors } from '../../models/selectors.model';
import { CreateEventDialog } from './create-event-dialog';
import { EditEventDialog } from './edit-event-dialog';

export class DrawerComponent {
  readonly page: Page;

  private readonly dayFormDrawer: Locator;
  private readonly createEventButton: Locator;

  private readonly createEventDialog: CreateEventDialog;
  private readonly editEventDialog: EditEventDialog;

  constructor(page: Page) {
    this.page = page;

    this.dayFormDrawer = page.locator(Selectors.DAY_FORM_COMPONENT);
    this.createEventButton = page.getByRole('button', { name: 'Create Event' });

    this.createEventDialog = new CreateEventDialog(page);
    this.editEventDialog = new EditEventDialog(page);
  }

  async verifyIsVisibleWithDate(day: number, season: Season) {
    await test.step('Validate Day Form Drawer Is Open', async () => {
      await expect(this.dayFormDrawer).toBeVisible();
      const selectedDateTitle = new RegExp(
        `${day}(?:st|nd|rd|th)\\s+${season}`,
        'i',
      );
      await expect(this.dayFormDrawer).toHaveText(selectedDateTitle);
    });
  }

  async openEventSettingsMenu(eventTitle: string) {
    await test.step('Open Event Edit Menu', async () => {
      await this.page
        .getByRole('button', { name: new RegExp(`${eventTitle}$`) })
        .click();
      await this.page.getByLabel(eventTitle).getByRole('button').click();
      const editMenuButton = this.page.getByRole('menuitem', { name: 'Edit' });
      const deleteMenuButton = this.page.getByRole('menuitem', {
        name: 'Delete',
      });
      await expect(editMenuButton).toBeVisible();
      await expect(deleteMenuButton).toBeVisible();
    });
  }

  async openEventEditDialog(eventTitle: string) {
    await test.step('Open Event Edit Dialog', async () => {
      await this.openEventSettingsMenu(eventTitle);
      const editMenuButton = this.page.getByRole('menuitem', { name: 'Edit' });
      await editMenuButton.click();
    });
  }

  async verifyEventDetailsInEditDialog(eventForm: EventForm) {
    await test.step('Verify Event Details are Correctly Displayed in Edit Dialog', async () => {
      await this.openEventEditDialog(eventForm.title);
      await this.editEventDialog.verifyInput(eventForm);
      await this.editEventDialog.clickCancelButton();
    });
  }

  async clickCreateEventButton() {
    await test.step('Create Event', async () => {
      await expect(this.dayFormDrawer).toBeVisible();
      await this.createEventButton.click();
    });
  }

  async createGameEvent(eventForm: EventForm) {
    await test.step('Create Game Event', async () => {
      await this.clickCreateEventButton();
      await this.createEventDialog.createEvent(eventForm);
    });
  }

  async deleteEvent(eventTitle: string) {
    await test.step('Delete Event', async () => {
      await this.openEventSettingsMenu(eventTitle);
      await this.page.getByRole('menuitem', { name: 'Delete' }).click();
      await this.page.getByRole('button', { name: 'Delete' }).click();
    });
  }

  async verifyEventOnDayFormDrawer(eventTitle: string, toBeVisible: boolean) {
    await test.step('Verify day form drawer has event', async () => {
      const createdEvent = this.page.getByRole('button', {
        name: new RegExp(`${eventTitle}$`),
      });
      toBeVisible
        ? await expect(createdEvent).toBeVisible()
        : await expect(createdEvent).not.toBeVisible();
    });
  }

  async verifyEventNameAndTagAreUnique(eventForm: EventForm) {
    await test.step('Verify Even Name and Tag are Unique', async () => {
      await this.clickCreateEventButton();
      await this.createEventDialog.fillTitleForm(eventForm.title);
      await this.createEventDialog.verifyCreateButtonState(false);

      await this.clickCreateEventButton();
      await this.createEventDialog.selectTag(
        eventForm.tagCategory,
        eventForm.tag,
      );
      await this.createEventDialog.verifyCreateButtonState(false);

      await this.clickCreateEventButton();
      await this.createEventDialog.fillTitleForm(eventForm.title);
      await this.createEventDialog.selectTag(
        eventForm.tagCategory,
        eventForm.tag,
      );
      await this.createEventDialog.verifyCreateButtonState(true);
    });
  }
}
