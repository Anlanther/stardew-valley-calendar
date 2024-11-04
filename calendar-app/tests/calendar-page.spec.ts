import { Season } from '../src/app/models/season.model';
import { test } from './fixtures/app-fixture';
import { CalendarForm } from './models/calendar-form.model';
import { getMockCalendarForm } from './utils/util-functions';

const mockCalendar: CalendarForm = getMockCalendarForm();

const mockGameDate = {
  day: 3,
  season: Season.FALL,
};

test('Day form drawer opens', async ({
  welcomePage,
  calendarPage,
  dayDrawerComponent: dayNavComponent,
}) => {
  await welcomePage.selectOrCreateCalendar(mockCalendar);
  await calendarPage.selectDateForEvents(mockGameDate.day, mockGameDate.season);
  await dayNavComponent.verifyIsVisibleWithDate(
    mockGameDate.day,
    mockGameDate.season,
  );
  await calendarPage.deleteCalendar();
});

test('Season form drawer opens', async ({
  welcomePage,
  calendarPage,
  seasonDrawerComponent: seasonNavComponent,
}) => {
  await welcomePage.selectOrCreateCalendar(mockCalendar);
  await calendarPage.openSeasonDrawer();
  await seasonNavComponent.verifyIsVisible();
  await calendarPage.deleteCalendar();
});
