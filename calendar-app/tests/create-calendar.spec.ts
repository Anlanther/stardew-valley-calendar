import { test } from './fixtures/app-fixture';
import { CalendarForm } from './models/calendar-form.model';
import { MOCK_BIRTHDAY_EVENTS } from './utils/mocks/birthday-events.mock';
import { MOCK_CALENDAR_FORM } from './utils/mocks/calendar-form';
import { MOCK_CROP_EVENTS } from './utils/mocks/crop-events.mock';
import { MOCK_FESTIVAL_EVENTS } from './utils/mocks/festival-events.mock';

const mockCalendarWithBirthdays: CalendarForm = {
  ...MOCK_CALENDAR_FORM,
  name: `${MOCK_CALENDAR_FORM.name} with Birthdays`,
  includeBirthdays: true,
};
const mockCalendarWithCrops: CalendarForm = {
  ...MOCK_CALENDAR_FORM,
  name: `${MOCK_CALENDAR_FORM.name} with Crops`,
  includeCrops: true,
};
const mockCalendarWithFestivals: CalendarForm = {
  ...MOCK_CALENDAR_FORM,
  name: `${MOCK_CALENDAR_FORM.name} with Festivals`,
  includeFestivals: true,
};

test('App heading to have calendar name and default to year 1 Spring', async ({
  welcomePage,
  calendarPage,
}) => {
  await welcomePage.selectOrCreateCalendar(MOCK_CALENDAR_FORM);
  await calendarPage.verifyCorrectTitle(MOCK_CALENDAR_FORM.name, 1);
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

test('Verify Calendar Settings', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(MOCK_CALENDAR_FORM);
  await calendarPage.verifyCalendarDetailsInEditDialog(MOCK_CALENDAR_FORM);
  await calendarPage.verifyCanOpenCreateDialog();
  await calendarPage.verifyActiveCalendarIsMarkedAsSelected(
    MOCK_CALENDAR_FORM.name,
  );
  await calendarPage.deleteCalendar();
});
