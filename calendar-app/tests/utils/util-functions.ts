import { Page } from '@playwright/test';
import { DeepPartial } from '../../src/app/models/deep-partial.model';
import { Calendar_Data } from '../../src/app/services/models/calendar';
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
