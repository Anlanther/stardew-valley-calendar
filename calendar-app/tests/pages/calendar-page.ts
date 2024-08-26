import { Locator, Page, expect, test } from '@playwright/test';
import { Season } from '../../src/app/models/season.model';
import { Selectors } from '../models/selectors.model';

export class CalendarPage {
  readonly page: Page;

  private readonly calendarTitle: Locator;
  private readonly seasonTab: Locator;
  private readonly dayCell: Locator;
  private readonly dayFormDrawer: Locator;
  private readonly createEventButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.calendarTitle = page.getByRole('heading');
    this.seasonTab = page.getByRole('tab');
    this.dayCell = page.locator(Selectors.EVENT_COMPONENT);
    this.dayFormDrawer = page.locator(Selectors.DAY_FORM_COMPONENT);
    this.createEventButton = page.getByRole('button', { name: 'Create Event' });
  }

  async verifySeasonIsSelected(season: Season) {
    await test.step('Verify season is selected', async () => {
      const tabToBeChecked = this.seasonTab.filter({ hasText: season });
      await expect(tabToBeChecked).toHaveAttribute('aria-selected', 'true');
    });
  }

  async verifyCorrectTitle(name: string, year: number) {
    await test.step('Verify title holds calendar name and first year', async () => {
      const yearReference = `year ${year}`;
      await expect(this.calendarTitle).toContainText(name);
      await expect(this.calendarTitle).toContainText(yearReference);
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

  async verifyEventOnDayFormDrawer(
    day: number,
    season: Season,
    eventTitle: string,
    toBeVisible: boolean,
  ) {
    await test.step('Verify day form drawer has event', async () => {
      await this.selectDate(day, season);
      const createdEvent = this.page.getByRole('button', {
        name: new RegExp(`${eventTitle}$`),
      });
      toBeVisible
        ? await expect(createdEvent).toBeVisible()
        : await expect(createdEvent).not.toBeVisible();
    });
  }

  async selectDate(day: number, season: Season) {
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

  async validateDayFormDrawerIsOpenWithDate(day: number, season: Season) {
    await test.step('Validate Day Form Drawer Is Open', async () => {
      await expect(this.dayFormDrawer).toBeVisible();
      const selectedDateTitle = new RegExp(
        `${day}(?:st|nd|rd|th)\\s+${season}`,
        'i',
      );
      await expect(this.dayFormDrawer).toHaveText(selectedDateTitle);
    });
  }

  async clickCreateEventButton() {
    await test.step('Create Event', async () => {
      await expect(this.dayFormDrawer).toBeVisible();
      await this.createEventButton.click();
    });
  }

  async openEventSettingsMenu(day: number, season: Season, eventTitle: string) {
    await test.step('Open Event Edit Menu', async () => {
      await this.selectDate(day, season);
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

  async openEventEditDialog(day: number, season: Season, eventTitle: string) {
    await test.step('Open Event Edit Dialog', async () => {
      await this.openEventSettingsMenu(day, season, eventTitle);
      const editMenuButton = this.page.getByRole('menuitem', { name: 'Edit' });
      await editMenuButton.click();
    });
  }

  async deleteEvent(day: number, season: Season, eventTitle: string) {
    await test.step('Delete Event', async () => {
      await this.openEventSettingsMenu(day, season, eventTitle);
      await this.page.getByRole('menuitem', { name: 'Delete' }).click();
      await this.page.getByRole('button', { name: 'Delete' }).click();
      await this.verifyEventOnDayFormDrawer(day, season, eventTitle, false);
    });
  }
}
