import { test } from './fixtures/app-fixture';
import { CalendarForm } from './models/calendar-form.model';
import { MOCK_BIRTHDAY_EVENTS } from './utils/mocks/birthday-events.mock';
import { MOCK_CROP_EVENTS } from './utils/mocks/crop-events.mock';
import { MOCK_FESTIVAL_EVENTS } from './utils/mocks/festival-events.mock';
import { getMockCalendarForm } from './utils/util-functions';

const mockCalendarWithBirthdays: CalendarForm = getMockCalendarForm({
  name: `Mock Calendar with Birthdays`,
  includeBirthdays: true,
});
const mockCalendarWithCrops: CalendarForm = getMockCalendarForm({
  name: `Mock Calendar with Crops`,
  includeCrops: true,
});
const mockCalendarWithFestivals: CalendarForm = getMockCalendarForm({
  name: `Mock Calendar with Festivals`,
  includeFestivals: true,
});

test('App heading to have calendar name and default to year 1 Spring', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar = getMockCalendarForm({});

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await calendarPage.verifyCorrectTitle(plainCalendar.name, 1);
  await calendarPage.deleteCalendar();
});

test('Only birthdays are included', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithBirthdays);

  for (let i = 0; i < MOCK_BIRTHDAY_EVENTS.length; i++) {
    const mockBirthday = MOCK_BIRTHDAY_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockBirthday.gameDate.day,
      mockBirthday.gameDate.season,
      mockBirthday.title,
      true,
    );
  }
  for (let i = 0; i < MOCK_CROP_EVENTS.length; i++) {
    const mockCrop = MOCK_CROP_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockCrop.gameDate.day,
      mockCrop.gameDate.season,
      mockCrop.title,
      false,
    );
  }
  for (let i = 0; i < MOCK_FESTIVAL_EVENTS.length; i++) {
    const mockFestival = MOCK_FESTIVAL_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockFestival.gameDate.day,
      mockFestival.gameDate.season,
      mockFestival.title,
      false,
    );
  }
  await calendarPage.deleteCalendar();
});

test('Only crops are included', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithCrops);

  for (let i = 0; i < MOCK_BIRTHDAY_EVENTS.length; i++) {
    const mockBirthday = MOCK_BIRTHDAY_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockBirthday.gameDate.day,
      mockBirthday.gameDate.season,
      mockBirthday.title,
      false,
    );
  }
  for (let i = 0; i < MOCK_CROP_EVENTS.length; i++) {
    const mockCrop = MOCK_CROP_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockCrop.gameDate.day,
      mockCrop.gameDate.season,
      mockCrop.title,
      true,
    );
  }
  for (let i = 0; i < MOCK_FESTIVAL_EVENTS.length; i++) {
    const mockFestival = MOCK_FESTIVAL_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockFestival.gameDate.day,
      mockFestival.gameDate.season,
      mockFestival.title,
      false,
    );
  }
  await calendarPage.deleteCalendar();
});

test('Only festivals are included', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithFestivals);

  for (let i = 0; i < MOCK_BIRTHDAY_EVENTS.length; i++) {
    const mockBirthday = MOCK_BIRTHDAY_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockBirthday.gameDate.day,
      mockBirthday.gameDate.season,
      mockBirthday.title,
      false,
    );
  }
  for (let i = 0; i < MOCK_CROP_EVENTS.length; i++) {
    const mockCrop = MOCK_CROP_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockCrop.gameDate.day,
      mockCrop.gameDate.season,
      mockCrop.title,
      false,
    );
  }
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

test('Verify calendar settings reflect state of the calendar', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar = getMockCalendarForm({});

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await calendarPage.verifyCalendarDetailsInEditDialog(plainCalendar);
  await calendarPage.verifyCanOpenCreateDialog();
  await calendarPage.verifyActiveCalendarIsMarkedAsSelected(plainCalendar.name);
  await calendarPage.deleteCalendar();
});

test('Select calendar displays list of all existing calendar names correctly', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar1 = getMockCalendarForm({
    name: 'Mock Calendar Select T1',
  });
  const plainCalendar2 = getMockCalendarForm({
    name: 'Mock Calendar Select T2',
  });
  const plainCalendar3 = getMockCalendarForm({
    name: 'Mock Calendar Select T3',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar1);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.createCalendar(plainCalendar2);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar2.name, true);
  await calendarPage.createCalendar(plainCalendar3);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar2.name, true);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar3.name, true);

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(plainCalendar2.name);
  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(plainCalendar1.name);
  await calendarPage.deleteCalendar();
});
