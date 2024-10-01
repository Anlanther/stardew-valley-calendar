import { test } from './fixtures/app-fixture';
import { CalendarForm } from './models/calendar-form.model';
import { MOCK_CALENDAR_FORM } from './utils/mocks/calendar-form';
import {
  dBNotAvailableResponse,
  getMockCalendarDataObject,
} from './utils/util-functions';

test('API not available', async ({ welcomePage }) => {
  await dBNotAvailableResponse(welcomePage.page);

  await welcomePage.openPage();
  await welcomePage.verifyApiConnectionFailedMessage();
});

test('With existing calendars available and system events loaded', async ({
  welcomePage,
}) => {
  await welcomePage.loadExistingCalendarsAndSystemEvents(
    getMockCalendarDataObject(),
  );

  await welcomePage.openPage();
  await welcomePage.verifySelectOrCreateCalendarMessage();
});

test('With no existing calendars available', async ({ welcomePage }) => {
  await welcomePage.loadExistingCalendarsAndSystemEvents(
    getMockCalendarDataObject([]),
  );

  await welcomePage.openPage();
  await welcomePage.verifyNoExistingCalendarsMessage();
});

test('Dialogs work correctly', async ({ welcomePage }) => {
  const mockCalendarNoName: CalendarForm = {
    ...MOCK_CALENDAR_FORM,
    name: '',
  };
  await welcomePage.loadExistingCalendarsAndSystemEvents(
    getMockCalendarDataObject(),
  );

  await welcomePage.openCalendarReadyPage();
  await welcomePage.verifyCreateActionIsDisabled();
  await welcomePage.verifyCreateActionRequiresName(mockCalendarNoName);
});
