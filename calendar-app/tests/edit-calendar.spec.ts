import { test } from './fixtures/app-fixture';
import { MOCK_BIRTHDAY_EVENTS } from './utils/mocks/birthday-events.mock';
import { MOCK_CROP_EVENTS } from './utils/mocks/crop-events.mock';
import { MOCK_FESTIVAL_EVENTS } from './utils/mocks/festival-events.mock';
import { getMockCalendarForm } from './utils/util-functions';

test('Name in title updates', async ({ welcomePage, calendarPage }) => {
  const updatedNameCalendar = getMockCalendarForm({
    name: 'Edit Calendar T1 - Updated Plain Mock',
  });
  const updatedYear = 2;

  await welcomePage.selectOrCreateCalendar(
    getMockCalendarForm({ name: 'Edit Calendar T1 - Update Name' }),
  );
  await calendarPage.updateCalendarName(updatedNameCalendar.name, updatedYear);
  await calendarPage.verifyCorrectTitle(updatedNameCalendar.name, updatedYear);

  await calendarPage.deleteCalendar();
});

test('Calendar toggles birthdays on', async ({ welcomePage, calendarPage }) => {
  const plainCalendar = getMockCalendarForm({
    name: 'Edit Calendar T2',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await calendarPage.toggleSystemSettings(true, false, false);
  await calendarPage.verifyEventsOnCalendar(MOCK_BIRTHDAY_EVENTS);

  await calendarPage.deleteCalendar();
});

test('Calendar toggles crops on', async ({ welcomePage, calendarPage }) => {
  const plainCalendar = getMockCalendarForm({
    name: 'Edit Calendar T3',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await calendarPage.toggleSystemSettings(false, false, true);
  await calendarPage.verifyEventsOnCalendar(MOCK_CROP_EVENTS);

  await calendarPage.deleteCalendar();
});

test('Calendar toggles festivals on', async ({ welcomePage, calendarPage }) => {
  const plainCalendar = getMockCalendarForm({
    name: 'Edit Calendar T4',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await calendarPage.toggleSystemSettings(false, true, false);
  await calendarPage.verifyEventsOnCalendar(MOCK_FESTIVAL_EVENTS);

  await calendarPage.deleteCalendar();
});
