import { Locator, Page, expect, test } from '@playwright/test';
import { UnsavedGameEvent } from '../../src/app/models/game-event.model';
import { Season } from '../../src/app/models/season.model';
import { CalendarForm } from '../models/calendar-form.model';
import { EventForm } from '../models/event-form.model';
import { Selectors } from '../models/selectors.model';
import { CreateCalendarDialog } from './components/create-calendar-dialog';
import { DeleteCalendarDialog } from './components/delete-calendar-dialog';
import { DrawerComponent } from './components/drawer-component';
import { EditCalendarDialog } from './components/edit-calendar-dialog';
import { MenuComponent } from './components/menu-component';
import { SelectCalendarDialog } from './components/select-calendar-dialog';

export class CalendarPage {
  readonly page: Page;

  private readonly calendarTitle: Locator;
  private readonly seasonTab: Locator;
  private readonly dayCell: Locator;

  private readonly menuComponent: MenuComponent;
  private readonly drawerComponent: DrawerComponent;
  private readonly editCalendarDialog: EditCalendarDialog;
  private readonly createCalendarDialog: CreateCalendarDialog;
  private readonly selectCalendarDialog: SelectCalendarDialog;
  private readonly deleteCalendarDialog: DeleteCalendarDialog;

  constructor(page: Page) {
    this.page = page;

    this.calendarTitle = page.locator('h1.navbar--heading');
    this.seasonTab = page.getByRole('tab');
    this.dayCell = page.locator(Selectors.EVENT_COMPONENT);

    this.menuComponent = new MenuComponent(page);
    this.drawerComponent = new DrawerComponent(page);
    this.editCalendarDialog = new EditCalendarDialog(page);
    this.createCalendarDialog = new CreateCalendarDialog(page);
    this.selectCalendarDialog = new SelectCalendarDialog(page);
    this.deleteCalendarDialog = new DeleteCalendarDialog(page);
  }

  async verifySeasonIsSelected(season: Season) {
    await test.step('Verify season is selected', async () => {
      const tabToBeChecked = this.seasonTab.filter({ hasText: season });
      await expect(tabToBeChecked).toHaveAttribute('aria-selected', 'true');
    });
  }

  async verifyCorrectTitle(name: string, year?: number) {
    await test.step('Verify title holds calendar name and first year', async () => {
      const yearReference = `year ${year}`;
      await expect(this.calendarTitle).toContainText(name);
      if (year) {
        await expect(this.calendarTitle).toContainText(yearReference);
      }
    });
  }

  async verifyEventOnCalendar(
    day: number,
    season: Season,
    eventTitle: string,
    toBeVisible: boolean,
  ) {
    await test.step('Verify calendar has event in the correct date square', async () => {
      const selectedSeasonTab = this.seasonTab.filter({ hasText: season });
      await selectedSeasonTab.click();
      const selectedDate = this.dayCell
        .filter({ hasText: `${day}` })
        .locator('section')
        .nth(1);
      const displayedEvent = selectedDate.locator(`img[title="${eventTitle}"]`);
      toBeVisible
        ? await expect(displayedEvent).toBeVisible()
        : await expect(displayedEvent).not.toBeVisible();
    });
  }

  async selectDateForEvents(day: number, season: Season) {
    await test.step('Select date and season', async () => {
      const selectedSeasonTab = this.seasonTab.filter({ hasText: season });
      await selectedSeasonTab.click();
      await this.dayCell
        .filter({ hasText: `${day}` })
        .locator('div.event')
        .nth(0)
        .click();
    });
  }

  async deleteCalendar() {
    await test.step('Delete Calendar', async () => {
      await this.menuComponent.deleteCalendar();
      await this.deleteCalendarDialog.confirmDelete();
    });
  }

  async openMenu() {
    await test.step('Open Menu', async () => {
      await this.menuComponent.openMenu();
    });
  }

  async openAndDeleteCalendar(name: string) {
    await test.step('Select Calendar from Menu and Delete', async () => {
      await this.menuComponent.openMenu();
      await this.menuComponent.selectSelectCalendar();
      await this.selectCalendarDialog.selectCalendar(name);
      await this.verifyCorrectTitle(name);
      await this.deleteCalendar();
    });
  }

  async updateYear(updatedYear: number) {
    await test.step('Update Year', async () => {
      await this.menuComponent.selectEditCalendar();
      await this.editCalendarDialog.updateYearForm(updatedYear);
      await this.editCalendarDialog.clickEditButton();
    });
  }

  async verifyCalendarDetailsInEditDialog(calendar: CalendarForm) {
    await test.step('Verify Calendar Details are Correctly Displayed in Edit Dialog', async () => {
      await this.menuComponent.selectEditCalendar();
      await this.editCalendarDialog.verifyInput(calendar);
      await this.editCalendarDialog.clickCancelButton();
    });
  }

  async verifyCanOpenCreateDialog() {
    await test.step('Verify Menu Can Open Create Dialog', async () => {
      await this.menuComponent.selectCreateCalendar();
      await this.createCalendarDialog.clickCancelButton();
    });
  }

  async verifyActiveCalendarIsMarkedAsSelected(calendarName: string) {
    await test.step('Verify Calendar is Marked as Selected in Select Calendar Dialog', async () => {
      await this.menuComponent.selectSelectCalendar();
      await this.selectCalendarDialog.verifySelectedCalendar(calendarName);
      await this.selectCalendarDialog.clickCancelButton();
    });
  }

  async verifyTitleUpdatesOnEdit(updatedName: string, updatedYear: number) {
    await test.step('Verify Title On Page Updates On Edit', async () => {
      await this.menuComponent.selectEditCalendar();
      await this.editCalendarDialog.updateNameForm(updatedName);
      await this.editCalendarDialog.updateYearForm(updatedYear);
      await this.editCalendarDialog.clickEditButton();
      await this.verifyCorrectTitle(updatedName, updatedYear);
    });
  }

  async verifyDayFormDrawerIsOpenWithDate(day: number, season: Season) {
    await test.step('Validate Day Form Drawer Is Open', async () => {
      await this.selectDateForEvents(day, season);
      await this.drawerComponent.verifyIsVisibleWithDate(day, season);
    });
  }

  async verifyEventOnDayFormDrawer(
    day: number,
    season: Season,
    eventTitle: string,
    toBeVisible: boolean,
  ) {
    await test.step('Verify day form drawer has event', async () => {
      await this.selectDateForEvents(day, season);
      await this.drawerComponent.verifyEventOnDayFormDrawer(
        eventTitle,
        toBeVisible,
      );
    });
  }

  async deleteEvent(day: number, season: Season, eventTitle: string) {
    await test.step('Delete Event', async () => {
      await this.selectDateForEvents(day, season);
      await this.drawerComponent.deleteEvent(eventTitle);
    });
  }

  async downloadAndVerifyCalendar(fileName: string) {
    await test.step('Download active calendar as a txt file', async () => {
      const downloadPromise = this.page.waitForEvent('download');
      await this.menuComponent.selectDownloadCalendar();
      const download = await downloadPromise;
      await download.saveAs(
        './calendar-app/test-results/' + download.suggestedFilename(),
      );

      expect(download.suggestedFilename()).toBe(fileName);
    });
  }

  async loadCalendar(filePath: string) {
    await test.step('Load Calendar', async () => {
      await this.openMenu();
      const handle = this.page.locator('input[type="file"]');
      await handle.setInputFiles(filePath);
      await this.page.keyboard.press('Escape');
    });
  }

  async toggleSystemSettings(
    includeBirthdaysToggle: boolean,
    includeFestivalsToggle: boolean,
    includeCropsToggle: boolean,
  ) {
    await test.step('Set Calendar to Show Birthdays', async () => {
      await this.menuComponent.selectEditCalendar();
      await this.editCalendarDialog.updateIncludeBirthdaysCheckbox(
        includeBirthdaysToggle,
      );
      await this.editCalendarDialog.updateIncludeCropsCheckbox(
        includeCropsToggle,
      );
      await this.editCalendarDialog.updateIncludeFestivalsCheckbox(
        includeFestivalsToggle,
      );
      await this.editCalendarDialog.clickEditButton();
    });
  }

  async createGameEvent(day: number, season: Season, eventForm: EventForm) {
    await test.step('Create Game Event', async () => {
      await this.selectDateForEvents(day, season);
      await this.drawerComponent.createGameEvent(eventForm);
    });
  }

  async verifyEventDetailsInEditDialog(
    day: number,
    season: Season,
    eventForm: EventForm,
  ) {
    await test.step('Verify Event Details are Correctly Displayed in Edit Dialog', async () => {
      await this.selectDateForEvents(day, season);
      await this.drawerComponent.verifyEventDetailsInEditDialog(eventForm);
    });
  }

  async verifyEventNameAndTagAreUnique(eventForm: EventForm) {
    await test.step('Verify Even Name and Tag are Unique', async () => {
      await this.drawerComponent.verifyEventNameAndTagAreUnique(eventForm);
    });
  }

  async verifyEventsOnCalendar(events: UnsavedGameEvent[]) {
    await test.step('Verify Events are on Calendar', async () => {
      for (let i = 0; i < events.length; i++) {
        const mockEvent = events[i];
        await this.verifyEventOnCalendar(
          mockEvent.gameDate.day,
          mockEvent.gameDate.season,
          mockEvent.title,
          true,
        );
      }
    });
  }
}
