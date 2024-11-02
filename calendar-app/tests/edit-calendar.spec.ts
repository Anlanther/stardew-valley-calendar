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

test('Edited calendar name displays correctly on select calendar dialog', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar1 = getMockCalendarForm({
    name: 'Mock Calendar',
  });
  const plainCalendar2 = getMockCalendarForm({
    name: 'Another Mock Calendar',
  });
  const newPlainCalendar1Name = 'Calendar Name Changed';
  const newPlainCalendar2Name = 'Updated Mock Calendar';

  await welcomePage.selectOrCreateCalendar(plainCalendar1);
  await calendarPage.createCalendar(plainCalendar2);
  await calendarPage.updateCalendarName(newPlainCalendar2Name);
  await calendarPage.verifyCalendarInSelectDialog(newPlainCalendar2Name, true);
  await calendarPage.openExistingCalendar(plainCalendar1.name);
  await calendarPage.verifyCalendarInSelectDialog(newPlainCalendar2Name, true);
  await calendarPage.updateCalendarName(newPlainCalendar1Name);
  await calendarPage.verifyCalendarInSelectDialog(newPlainCalendar2Name, true);
  await calendarPage.verifyCalendarInSelectDialog(newPlainCalendar1Name, true);

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(newPlainCalendar2Name);
  await calendarPage.deleteCalendar();
});

test('Select calendar dialog no longer shows calendar name when it is deleted', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar1 = getMockCalendarForm({
    name: 'Mock Calendar',
  });
  const plainCalendar2 = getMockCalendarForm({
    name: 'Another Mock Calendar',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar1);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.createCalendar(plainCalendar2);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar2.name, true);
  await calendarPage.deleteCalendar();
  await welcomePage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await welcomePage.verifyCalendarInSelectDialog(plainCalendar2.name, false);

  await welcomePage.openExistingCalendar(plainCalendar1.name);
  await calendarPage.deleteCalendar();
  await welcomePage.verifyNoExistingCalendarsMessage();
});
