import { test } from './fixtures/app-fixture';
import {
  dBNotAvailableResponse,
  getMockCalendarDataObject,
  loadExistingCalendarsAndSystemEvents,
} from './utils/util-functions';

test('API not available', async ({ welcomePage }) => {
  await dBNotAvailableResponse(welcomePage.page);

  await welcomePage.openPage();
  await welcomePage.verifyApiConnectionFailedMessage();
});

test('Offline Mode button activates page to create calendars', async ({
  welcomePage,
}) => {
  await dBNotAvailableResponse(welcomePage.page);

  await welcomePage.openPage();
  await welcomePage.clickOfflineMode();
  await welcomePage.verifyNoExistingCalendarsMessage();
});

test('With existing calendars available and system events loaded', async ({
  welcomePage,
}) => {
  await loadExistingCalendarsAndSystemEvents(
    welcomePage.page,
    getMockCalendarDataObject(),
  );

  await welcomePage.openPage();
  await welcomePage.verifySelectOrCreateCalendarMessage();
});

test('With no existing calendars available', async ({ welcomePage }) => {
  await loadExistingCalendarsAndSystemEvents(
    welcomePage.page,
    getMockCalendarDataObject([]),
  );

  await welcomePage.openPage();
  await welcomePage.verifyNoExistingCalendarsMessage();
});

test('Create Dialog works correctly', async ({ welcomePage }) => {
  await loadExistingCalendarsAndSystemEvents(
    welcomePage.page,
    getMockCalendarDataObject(),
  );

  await welcomePage.openCalendarReadyPage();
  await welcomePage.verifyCreateActionIsDisabledByDefault();
  await welcomePage.verifyCreateActionRequiresName();
});
