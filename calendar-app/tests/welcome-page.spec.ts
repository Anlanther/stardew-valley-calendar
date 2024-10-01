import { test } from './fixtures/app-fixture';
import { CalendarForm } from './models/calendar-form.model';
import { Queries } from './models/queries.model';
import { MOCK_CALENDAR_FORM } from './utils/mocks/calendar-form';
import { MOCK_CALENDARS_RESPONSE } from './utils/mocks/calendars-response.mock';
import { MOCK_SYSTEM_EVENTS_RESPONSE } from './utils/mocks/system-events-response.mock';

const mockCalendarNoName: CalendarForm = {
  ...MOCK_CALENDAR_FORM,
  name: '',
};
test('API not available', async ({ welcomePage }) => {
  await welcomePage.page.route(/graphql/, (route) => {
    route.fulfill({
      status: 404,
    });
  });
  await welcomePage.openPage();
  await welcomePage.verifyApiConnectionFailedMessage();
});

test('System events not loaded', async ({ welcomePage }) => {
  await welcomePage.page.route(/graphql/, (route) => {
    const req: { query: string } = route.request().postDataJSON();

    if (req.query.includes(Queries.GET_ALL_CALENDARS)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_CALENDARS_RESPONSE }),
      });
    }
    if (req.query.includes(Queries.GET_SYSTEM_EVENTS)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
    }
  });
  await welcomePage.openPage();
  await welcomePage.verifyApiConnectionFailedMessage();
});

test('With existing calendars available and system events loaded', async ({
  welcomePage,
}) => {
  await welcomePage.page.route(/graphql/, (route) => {
    const req: { query: string } = route.request().postDataJSON();

    if (req.query.includes(Queries.GET_ALL_CALENDARS)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_CALENDARS_RESPONSE }),
      });
    }
    if (req.query.includes(Queries.GET_SYSTEM_EVENTS)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_SYSTEM_EVENTS_RESPONSE }),
      });
    }
  });
  await welcomePage.openPage();
  await welcomePage.verifySelectOrCreateCalendarMessage();
});

test('With no existing calendars available', async ({ welcomePage }) => {
  const emptyMockCalendar = { ...MOCK_CALENDARS_RESPONSE };
  emptyMockCalendar.calendars.data = [];

  await welcomePage.page.route(/graphql/, (route) => {
    const req: { query: string } = route.request().postDataJSON();

    if (req.query.includes(Queries.GET_SYSTEM_EVENTS)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_SYSTEM_EVENTS_RESPONSE }),
      });
    }

    if (req.query.includes(Queries.GET_ALL_CALENDARS)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: emptyMockCalendar }),
      });
    }
  });
  await welcomePage.openPage();
  await welcomePage.verifyNoExistingCalendarsMessage();
});

test('Dialogs work correctly', async ({ welcomePage }) => {
  await welcomePage.openCalendarReadyPage();
  await welcomePage.verifyCreateActionIsDisabled();
  await welcomePage.verifyCreateActionRequiresName(mockCalendarNoName);
});
