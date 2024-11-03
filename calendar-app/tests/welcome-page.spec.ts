import { test } from './fixtures/app-fixture';
import {
  dBNotAvailableResponse,
  getMockCalendarDataObject,
  loadExistingCalendarsAndSystemEvents,
} from './utils/util-functions';

test('API not available', async ({ welcomePage }) => {
  await dBNotAvailableResponse(welcomePage.page);

  await welcomePage.open();
  await welcomePage.verifyApiConnectionFailedMessage();
});

test('Offline Mode button activates page to create calendars', async ({
  welcomePage,
}) => {
  await dBNotAvailableResponse(welcomePage.page);

  await welcomePage.open();
  await welcomePage.clickOfflineMode();
  await welcomePage.verifyNoExistingCalendarsMessage();
});

test('Page message ith existing calendars available and system events loaded', async ({
  welcomePage,
}) => {
  await loadExistingCalendarsAndSystemEvents(
    welcomePage.page,
    getMockCalendarDataObject(),
  );

  await welcomePage.open();
  await welcomePage.verifySelectOrCreateCalendarMessage();
});

test('Page message with no existing calendars available', async ({
  welcomePage,
}) => {
  await loadExistingCalendarsAndSystemEvents(
    welcomePage.page,
    getMockCalendarDataObject([]),
  );

  await welcomePage.open();
  await welcomePage.verifyNoExistingCalendarsMessage();
});
