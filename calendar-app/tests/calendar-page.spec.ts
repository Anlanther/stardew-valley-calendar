import { Season } from '../src/app/models/season.model';
import { test } from './fixtures/app-fixture';
import { CalendarForm } from './models/calendar-form.model';
import { getMockCalendarForm } from './utils/util-functions';

const mockCalendarWithAllSystem: CalendarForm = getMockCalendarForm({
  name: `Mock Calendar with All System`,
  includeBirthdays: true,
  includeCrops: true,
  includeFestivals: true,
});

const mockGameDate = {
  day: 3,
  season: Season.FALL,
};

test('Day form drawer opens', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.verifyDayFormDrawerIsOpenWithDate(
    mockGameDate.day,
    mockGameDate.season,
  );
  await calendarPage.deleteCalendar();
});
