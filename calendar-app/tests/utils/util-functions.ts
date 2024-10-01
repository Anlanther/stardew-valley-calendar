import { Page } from '@playwright/test';
import { DeepPartial } from '../../src/app/models/deep-partial.model';
import { Calendar_Data } from '../../src/app/services/models/calendar';
import { CalendarForm } from '../models/calendar-form.model';
import { Queries } from '../models/queries.model';
import { MOCK_CALENDAR_FORM } from './mocks/calendar-form';
import { MOCK_CALENDARS_RESPONSE } from './mocks/calendars-response.mock';

export async function dBNotAvailableResponse(page: Page) {
  return page.route(/graphql/, (route) => {
    route.fulfill({
      status: 404,
    });
  });
}

export function getMockCalendarDataObject(
  dataOverride?: DeepPartial<Calendar_Data>[],
) {
  const mockResponse = MOCK_CALENDARS_RESPONSE;
  if (dataOverride) {
    mockResponse.calendars.data = dataOverride;
  }
  return mockResponse;
}

export async function loadExistingCalendarsAndSystemEvents(
  page: Page,
  calendars: {
    calendars: { data: DeepPartial<Calendar_Data>[] };
  },
) {
  await page.route(/graphql/, (route) => {
    const req: { query: string } = route.request().postDataJSON();

    if (req.query.includes(Queries.GET_ALL_CALENDARS)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: calendars }),
      });
    }
  });
}

export function getMockCalendarForm(
  calendarOverride: Partial<CalendarForm>,
): CalendarForm {
  const updatedCalendarForm = (
    Object.keys(MOCK_CALENDAR_FORM) as Array<keyof CalendarForm>
  ).reduce(
    (acc, key) =>
      calendarOverride[key] ? { ...acc, [key]: calendarOverride[key] } : acc,
    MOCK_CALENDAR_FORM,
  );

  return updatedCalendarForm;
}
