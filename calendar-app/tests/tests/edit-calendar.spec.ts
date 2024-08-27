import { test } from '../fixtures/app-fixture';
import { MOCK_BIRTHDAY_EVENTS } from '../mocks/birthday-events.mock';
import { MOCK_CALENDAR_FORM } from '../mocks/calendar-form';
import { MOCK_CROP_EVENTS } from '../mocks/crop-events.mock';
import { MOCK_FESTIVAL_EVENTS } from '../mocks/festival-events.mock';

test('Name in title updates', async ({ welcomePage, calendarPage }) => {
  const updatedName = 'Updated Plain Mock';
  const updatedYear = 2;

  await welcomePage.selectOrCreateCalendar(MOCK_CALENDAR_FORM);
  await calendarPage.verifyTitleUpdatesOnEdit(updatedName, updatedYear);
  await calendarPage.deleteCalendar();
});

test('Calendar toggles birthdays on', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(MOCK_CALENDAR_FORM);
  await calendarPage.toggleSystemSettings(true, false, false);

  for (let i = 0; i < MOCK_BIRTHDAY_EVENTS.length; i++) {
    const mockBirthday = MOCK_BIRTHDAY_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockBirthday.gameDate.day,
      mockBirthday.gameDate.season,
      mockBirthday.title,
      true,
    );
  }

  await calendarPage.deleteCalendar();
});

test('Calendar toggles crops on', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(MOCK_CALENDAR_FORM);
  await calendarPage.toggleSystemSettings(false, false, true);

  for (let i = 0; i < MOCK_CROP_EVENTS.length; i++) {
    const mockCrop = MOCK_CROP_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockCrop.gameDate.day,
      mockCrop.gameDate.season,
      mockCrop.title,
      true,
    );
  }

  await calendarPage.deleteCalendar();
});

test('Calendar toggles festivals on', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(MOCK_CALENDAR_FORM);
  await calendarPage.toggleSystemSettings(false, true, false);

  for (let i = 0; i < MOCK_FESTIVAL_EVENTS.length; i++) {
    const mockFestival = MOCK_FESTIVAL_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockFestival.gameDate.day,
      mockFestival.gameDate.season,
      mockFestival.title,
      true,
    );
  }

  await calendarPage.deleteCalendar();
});
