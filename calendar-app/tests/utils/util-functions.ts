import { Page } from '@playwright/test';
import { DeepPartial } from '../../src/app/models/deep-partial.model';
import { Calendar_Data } from '../../src/app/services/models/calendar';
import { CalendarForm } from '../models/calendar-form.model';
import { EventForm } from '../models/event-form.model';
import { Queries } from '../models/queries.model';
import { MOCK_CALENDAR_FORM } from './mocks/calendar-form';
import { MOCK_CALENDARS_RESPONSE } from './mocks/calendars-response.mock';
import { MOCK_EVENT_FORM } from './mocks/event-form.mock';

export async function dBNotAvailableResponse(page: Page) {
  await page.route(/graphql/, (route) => {
    route.fulfill({
      status: 404,
    });
  });
  return;
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
  return;
}

export function getMockCalendarForm(
  calendarOverride?: Partial<CalendarForm>,
): CalendarForm {
  if (!calendarOverride) {
    return MOCK_CALENDAR_FORM;
  }

  const updatedCalendarForm = (
    Object.keys(MOCK_CALENDAR_FORM) as Array<keyof CalendarForm>
  ).reduce(
    (acc, key) =>
      key in calendarOverride ? { ...acc, [key]: calendarOverride[key] } : acc,
    MOCK_CALENDAR_FORM,
  );

  return updatedCalendarForm;
}

export function getMockEventForm(
  eventOverride?: Partial<EventForm>,
): EventForm {
  if (!eventOverride) {
    return MOCK_EVENT_FORM;
  }

  const updatedEventForm = (
    Object.keys(MOCK_EVENT_FORM) as Array<keyof EventForm>
  ).reduce(
    (acc, key) =>
      key in eventOverride ? { ...acc, [key]: eventOverride[key] } : acc,
    MOCK_EVENT_FORM,
  );

  return updatedEventForm;
}
