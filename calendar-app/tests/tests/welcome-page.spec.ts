import { test } from '../fixtures/app-fixture';
import { MOCK_CALENDARS } from '../mocks/calendars.mock';
import { Queries } from '../models/queries.model';

test.describe('Welcome Page', () => {
  test('API not available', async ({ welcomePage }) => {
    await welcomePage.page.route(/graphql/, (route) => {
      route.fulfill({
        status: 404,
      });
    });
    await welcomePage.openPage();
    await welcomePage.verifyApiConnectionFailedMessage();
  });

  test('With existing calendars available', async ({ welcomePage }) => {
    await welcomePage.page.route(/graphql/, (route) => {
      const req: { query: string } = route.request().postDataJSON();

      if (req.query.includes(Queries.GET_ALL_CALENDARS)) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_CALENDARS }),
        });
      }
    });
    await welcomePage.openPage();
    await welcomePage.verifySelectOrCreateCalendarMessage();
  });
  test('With no existing calendars available', async ({ welcomePage }) => {
    const emptyMockCalendar = { ...MOCK_CALENDARS };
    emptyMockCalendar.calendars.data = [];

    await welcomePage.page.route(/graphql/, (route) => {
      const req: { query: string } = route.request().postDataJSON();

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
});
