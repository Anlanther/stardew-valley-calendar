import { test } from './fixtures/app-fixture';
import { MOCK_BIRTHDAY_EVENTS } from './utils/mocks/birthday-events.mock';
import { MOCK_CROP_EVENTS } from './utils/mocks/crop-events.mock';
import { MOCK_GOAL_EVENTS } from './utils/mocks/goal-events.mock';
import { MOCK_USER_EVENTS } from './utils/mocks/user-events.mock';
import { getMockCalendarForm } from './utils/util-functions';

test('Calendar downloads with the correct name and type', async ({
  welcomePage,
  calendarPage,
}) => {
  const mockDownloadedCalendar = getMockCalendarForm();
  const expectedDownloadFileType = '.txt';
  const expectedDownloadedFileName = `${mockDownloadedCalendar.name}${expectedDownloadFileType}`;

  await welcomePage.selectOrCreateCalendar(mockDownloadedCalendar);
  await calendarPage.downloadAndVerifyCalendar(expectedDownloadedFileName);
  await calendarPage.deleteCalendar();
});

test('Calendar is created correctly from upload', async ({
  welcomePage,
  calendarPage,
  seasonDrawerComponent,
}) => {
  const mockCalendarToLoadPath =
    './calendar-app/tests/utils/mocks/upload-calendar.mock.txt';
  const expectedCalendarTitle = 'Mock Calendar';
  const expectedEventsOnCalendar = [
    ...MOCK_USER_EVENTS,
    ...MOCK_GOAL_EVENTS,
    ...MOCK_BIRTHDAY_EVENTS,
    ...MOCK_CROP_EVENTS,
  ];

  await welcomePage.open();
  await welcomePage.clickOfflineMode();
  await welcomePage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarTitle, 1);

  for (let i = 0; i < expectedEventsOnCalendar.length; i++) {
    const expectedEvent = expectedEventsOnCalendar[i];
    const isGoal = expectedEvent.gameDate.day === 0;
    if (!expectedEvent.gameDate.isRecurring) {
      await calendarPage.updateYear(expectedEvent.gameDate.year);
    }
    if (isGoal) {
      await calendarPage.selectSeason(expectedEvent.gameDate.season);
      await calendarPage.openSeasonDrawer();
      await calendarPage.verifyGoalOnSeasonDrawer(
        expectedEvent.gameDate.season,
        expectedEvent.title,
        true,
      );
      await seasonDrawerComponent.close();
    } else {
      await calendarPage.verifyEventOnCalendar(
        expectedEvent.gameDate.day,
        expectedEvent.gameDate.season,
        expectedEvent.title,
        true,
      );
    }
  }

  await calendarPage.deleteCalendar();
});

test('Calendar is named correctly on upload when duplicates exist', async ({
  welcomePage,
  calendarPage,
}) => {
  const mockCalendarToLoadPath =
    './calendar-app/tests/utils/mocks/upload-calendar.mock.txt';
  const expectedCalendarBaseName = 'Mock Calendar';
  const expectedCalendarNames = [
    `${expectedCalendarBaseName}`,
    `${expectedCalendarBaseName}[1]`,
    `${expectedCalendarBaseName}[2]`,
    `${expectedCalendarBaseName}[3]`,
    `${expectedCalendarBaseName}[4]`,
  ];

  await welcomePage.open();
  await welcomePage.clickOfflineMode();
  await welcomePage.loadCalendar(mockCalendarToLoadPath);

  await calendarPage.verifyCorrectTitle(expectedCalendarNames[0], 1);
  await calendarPage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[1], 1);
  await calendarPage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[2], 1);
  await calendarPage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[3], 1);
  await calendarPage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[4], 1);

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(expectedCalendarNames[0]);
  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(expectedCalendarNames[1]);
  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(expectedCalendarNames[2]);
  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(expectedCalendarNames[3]);
  await calendarPage.deleteCalendar();
});

test('Calendar is named correctly after create calender on subsequent upload of duplicates', async ({
  welcomePage,
  calendarPage,
}) => {
  const mockCalendarToLoadPath =
    './calendar-app/tests/utils/mocks/upload-calendar.mock.txt';
  const expectedCalendarBaseName = 'Mock Calendar';
  const mockCalendar = getMockCalendarForm({ name: expectedCalendarBaseName });
  const expectedCalendarNames = [
    `${expectedCalendarBaseName}`,
    `${expectedCalendarBaseName}[1]`,
    `${expectedCalendarBaseName}[2]`,
    `${expectedCalendarBaseName}[3]`,
    `${expectedCalendarBaseName}[4]`,
  ];

  await welcomePage.selectOrCreateCalendar(mockCalendar);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[0], 1);
  await calendarPage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[1], 1);
  await calendarPage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[2], 1);
  await calendarPage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[3], 1);
  await calendarPage.loadCalendar(mockCalendarToLoadPath);
  await calendarPage.verifyCorrectTitle(expectedCalendarNames[4], 1);

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(expectedCalendarNames[0]);
  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(expectedCalendarNames[1]);
  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(expectedCalendarNames[2]);
  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(expectedCalendarNames[3]);
  await calendarPage.deleteCalendar();
});
