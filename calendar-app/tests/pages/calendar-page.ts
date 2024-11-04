import { Locator, Page, expect, test } from '@playwright/test';
import { UnsavedGameEvent } from '../../src/app/models/game-event.model';
import { Season } from '../../src/app/models/season.model';
import { CalendarForm } from '../models/calendar-form.model';
import { EventForm } from '../models/event-form.model';
import { Selectors } from '../models/selectors.model';
import { CreateCalendarDialog } from './components/create-calendar-dialog';
import { DayDrawerComponent } from './components/day-drawer-component';
import { DeleteCalendarDialog } from './components/delete-calendar-dialog';
import { EditCalendarDialog } from './components/edit-calendar-dialog';
import { MenuComponent } from './components/menu-component';
import { SeasonDrawerComponent } from './components/season-drawer-component';
import { SelectCalendarDialog } from './components/select-calendar-dialog';

export class CalendarPage {
  readonly page: Page;

  private readonly calendarTitle: Locator;
  private readonly seasonTab: Locator;
  private readonly dayCell: Locator;

  private readonly seasonGoalTriggerButton: Locator;

  private readonly menuComponent: MenuComponent;
  private readonly dayDrawerComponent: DayDrawerComponent;
  private readonly seasonDrawerComponent: SeasonDrawerComponent;
  private readonly editCalendarDialog: EditCalendarDialog;
  private readonly createCalendarDialog: CreateCalendarDialog;
  private readonly selectCalendarDialog: SelectCalendarDialog;
  private readonly deleteCalendarDialog: DeleteCalendarDialog;

  constructor(page: Page) {
    this.page = page;

    this.calendarTitle = page.locator('h1.navbar--heading');
    this.seasonTab = page.getByRole('tab');
    this.dayCell = page.locator(Selectors.EVENT_COMPONENT);

    this.seasonGoalTriggerButton = page.getByRole('button', { name: 'Goals' });

    this.menuComponent = new MenuComponent(page);
    this.dayDrawerComponent = new DayDrawerComponent(page);
    this.seasonDrawerComponent = new SeasonDrawerComponent(page);
    this.editCalendarDialog = new EditCalendarDialog(page);
    this.createCalendarDialog = new CreateCalendarDialog(page);
    this.selectCalendarDialog = new SelectCalendarDialog(page);
    this.deleteCalendarDialog = new DeleteCalendarDialog(page);
  }

  async openSeasonDrawer() {
    await test.step('Open Season Goals Drawer', async () => {
      await this.seasonGoalTriggerButton.click();
    });
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

  async selectSeason(season: Season) {
    await test.step('Select season', async () => {
      const selectedSeasonTab = this.seasonTab.filter({ hasText: season });
      await selectedSeasonTab.click();
    });
  }

  async deleteCalendar() {
    await test.step('Delete Calendar', async () => {
      await this.menuComponent.deleteCalendar();
      await this.deleteCalendarDialog.confirmDelete();
    });
  }

  async openExistingCalendar(name: string) {
    await test.step('Open Existing Calendar', async () => {
      await this.menuComponent.selectSelectCalendar();
      await this.selectCalendarDialog.selectCalendar(name);
    });
  }

  async openAndDeleteCalendar(name: string) {
    await test.step('Select Calendar from Menu and Delete', async () => {
      await this.menuComponent.open();
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

  async createCalendar(calendar: CalendarForm) {
    await test.step('Create New Calendar', async () => {
      await this.menuComponent.selectCreateCalendar();
      await this.createCalendarDialog.fillForm(calendar);
      await this.createCalendarDialog.clickCreateButton();
    });
  }

  async updateCalendarName(updatedName: string, updatedYear?: number) {
    await test.step('Update Calendar Calendar Name', async () => {
      await this.menuComponent.selectEditCalendar();
      await this.editCalendarDialog.updateNameForm(updatedName);

      if (updatedYear) {
        await this.editCalendarDialog.updateYearForm(updatedYear);
      }
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

  async verifyCalendarInSelectDialog(
    calendarName: string,
    expectVisible: boolean,
  ) {
    await test.step('Verify Calendar is Selectable in the Select Dialog', async () => {
      await this.menuComponent.selectSelectCalendar();
      await this.selectCalendarDialog.verifyCalendarIsAnOption(
        calendarName,
        expectVisible,
      );
      await this.selectCalendarDialog.escapeSelector();
      await this.selectCalendarDialog.clickCancelButton();
    });
  }

  async verifyEventOnDayDrawer(
    day: number,
    season: Season,
    eventTitle: string,
    toBeVisible: boolean,
  ) {
    await test.step('Verify day form drawer has event', async () => {
      await this.selectDateForEvents(day, season);
      await this.dayDrawerComponent.verifyEventOnDayFormDrawer(
        eventTitle,
        toBeVisible,
      );
    });
  }

  async verifyGoalOnSeasonDrawer(
    season: Season,
    eventTitle: string,
    toBeVisible: boolean,
  ) {
    await test.step('Verify season form drawer has event', async () => {
      await this.selectSeason(season);
      await this.seasonDrawerComponent.verifyGoalOnSeasonDrawer(
        eventTitle,
        toBeVisible,
      );
    });
  }

  async deleteEvent(day: number, season: Season, eventTitle: string) {
    await test.step('Delete Event', async () => {
      await this.selectDateForEvents(day, season);
      await this.dayDrawerComponent.deleteEvent(eventTitle);
    });
  }

  async deleteGoal(season: Season, eventTitle: string) {
    await test.step('Delete Goal', async () => {
      await this.selectSeason(season);
      await this.seasonDrawerComponent.deleteGoal(eventTitle);
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
      await this.menuComponent.open();
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
      await this.dayDrawerComponent.createGameEvent(eventForm);
    });
  }

  async createSeasonGoal(season: Season, eventForm: EventForm) {
    await test.step('Create Goal', async () => {
      await this.selectSeason(season);
      await this.openSeasonDrawer();
      await this.seasonDrawerComponent.createGoal(eventForm);
    });
  }

  async verifyEventDetailsInEditDialog(
    day: number,
    season: Season,
    eventForm: EventForm,
  ) {
    await test.step('Verify Event Details are Correctly Displayed in Edit Dialog', async () => {
      await this.selectDateForEvents(day, season);
      await this.dayDrawerComponent.verifyEventDetailsInEditDialog(eventForm);
    });
  }

  async verifyGoalDetailsInEditDialog(season: Season, eventForm: EventForm) {
    await test.step('Verify Goal Details are Correctly Displayed in Edit Dialog', async () => {
      await this.selectSeason(season);
      await this.openSeasonDrawer();
      await this.seasonDrawerComponent.verifyGoalDetailsInEditDialog(eventForm);
    });
  }

  async verifyFormNameAndTagAreUnique(
    eventForm: EventForm,
    drawer: 'day' | 'season',
  ) {
    await test.step('Verify Form Name and Tag are Unique', async () => {
      if (drawer === 'day') {
        await this.dayDrawerComponent.verifyEventNameAndTagAreUnique(eventForm);
        return;
      }
      await this.openSeasonDrawer();
      await this.seasonDrawerComponent.verifyGoalNameAndTagAreUnique(eventForm);
    });
  }

  async verifyGoalNameAndTagAreUnique(eventForm: EventForm) {
    await test.step('Verify Goal Name and Tag are Unique', async () => {
      await this.dayDrawerComponent.verifyEventNameAndTagAreUnique(eventForm);
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
