import { Locator, Page, expect, test } from '@playwright/test';
import { Season } from '../../src/app/models/season.model';
import { Selectors } from '../models/selectors.model';
import { CreateCalendarDialog } from './create-calendar-dialog';
import { MenuComponent } from './menu-component';

export class CalendarPage {
  readonly page: Page;

  private readonly calendarTitle: Locator;
  private readonly seasonTab: Locator;
  private readonly dayCell: Locator;
  // private readonly gameEvents: Locator

  private readonly createCalendarDialog: CreateCalendarDialog;
  private readonly menuComponent: MenuComponent;

  constructor(page: Page) {
    this.page = page;

    this.calendarTitle = page.getByRole('heading');
    this.seasonTab = page.getByRole('tab');
    this.dayCell = page.locator(Selectors.EVENT_COMPONENT);
    // this.gameEvents = page.locator('app-event').filter({ hasText: '18' }).locator('section').nth(1)

    this.createCalendarDialog = new CreateCalendarDialog(page);
    this.menuComponent = new MenuComponent(page);
  }

  async verifySeasonIsSelected(season: Season) {
    await test.step('Verify season is selected', async () => {
      const tabToBeChecked = this.seasonTab.filter({ hasText: season });
      await expect(tabToBeChecked).toHaveAttribute('aria-selected', 'true');
    });
  }

  async verifyCorrectTitle(name: string) {
    await test.step('Verify title holds calendar name and first year', async () => {
      const yearReference = 'year 1';
      await expect(this.calendarTitle).toContainText(name);
      await expect(this.calendarTitle).toContainText(yearReference);
    });
  }

  async verifyEvent(
    day: number,
    season: Season,
    eventName: string,
    toBeVisible: boolean,
  ) {
    await test.step('Verify calendar has event in the correct date square', async () => {
      const selectedSeasonTab = this.seasonTab.filter({ hasText: season });
      await selectedSeasonTab.click();
      const selectedDate = this.dayCell
        .filter({ hasText: `${day}` })
        .locator('section')
        .nth(1);
      const displayedEvent = selectedDate.locator(`img[title="${eventName}"]`);
      toBeVisible
        ? await expect(displayedEvent).toBeVisible()
        : await expect(displayedEvent).not.toBeVisible();
    });
  }
}
