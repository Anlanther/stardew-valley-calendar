import { Locator, Page, expect, test } from '@playwright/test';
import { Season } from '../../src/app/models/season.model';
import { Selectors } from '../models/selectors.model';

export class CalendarPage {
  readonly page: Page;

  private readonly calendarTitle: Locator;
  private readonly seasonTab: Locator;
  private readonly dayCell: Locator;

  constructor(page: Page) {
    this.page = page;

    this.calendarTitle = page.getByRole('heading');
    this.seasonTab = page.getByRole('tab');
    this.dayCell = page.locator(Selectors.EVENT_COMPONENT);
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
