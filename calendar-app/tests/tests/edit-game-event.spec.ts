import { Season } from '../../src/app/models/season.model';
import { TagCategory } from '../../src/app/models/tag-category.model';
import { Tag } from '../../src/app/models/tag.model';
import { test } from '../fixtures/app-fixture';
import { MOCK_CALENDAR_FORM } from '../mocks/calendar-form';
import { CalendarForm } from '../models/calendar-form.model';
import { EventForm } from '../models/event-form.model';

const mockCalendarWithAllSystem: CalendarForm = {
  ...MOCK_CALENDAR_FORM,
  name: `${MOCK_CALENDAR_FORM.name} with All System`,
  includeBirthdays: true,
  includeCrops: true,
  includeFestivals: true,
};
const mockGameDate = {
  day: 3,
  season: Season.FALL,
};
const mockEventPlain: EventForm = {
  title: 'Mining Day',
  description: 'Try to get to floor 50 in the mines',
  tag: Tag.Mining,
  tagCategory: TagCategory.ACTIVITY,
  isRecurring: false,
};
const mockEventRecurring: EventForm = {
  ...mockEventPlain,
  title: `${mockEventPlain.title} Recurring`,
  description: 'Try to get to floor 50 in the mines.',
  isRecurring: true,
};

test('Day form drawer opens', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.verifyDayFormDrawerIsOpenWithDate(
    mockGameDate.day,
    mockGameDate.season,
  );
  await calendarPage.deleteCalendar();
});

test('Add game event', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.createGameEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain,
  );
  await calendarPage.verifyEventOnCalendar(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
    true,
  );
  await calendarPage.verifyEventOnDayFormDrawer(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
    true,
  );
  await calendarPage.deleteCalendar();
});

test('Delete game event', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.createGameEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain,
  );
  await calendarPage.verifyEventOnCalendar(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
    true,
  );
  await calendarPage.verifyEventOnDayFormDrawer(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
    true,
  );

  await calendarPage.deleteEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
  );
  await calendarPage.verifyEventOnDayFormDrawer(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
    false,
  );

  await calendarPage.deleteCalendar();
});

test('Edit game event has correct input', async ({
  welcomePage,
  calendarPage,
}) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.createGameEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain,
  );
  await calendarPage.verifyEventDetailsInEditDialog(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain,
  );
  await calendarPage.deleteCalendar();
});

test('Game event recurs if set', async ({ welcomePage, calendarPage }) => {
  const mockOtherYearsToTest = [2, 5, 10];

  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.createGameEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain,
  );
  await calendarPage.createGameEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventRecurring,
  );

  for (let i = 0; i < mockOtherYearsToTest.length; i++) {
    const year = mockOtherYearsToTest[i];
    await calendarPage.updateYear(year);
    await calendarPage.verifyEventOnCalendar(
      mockGameDate.day,
      mockGameDate.season,
      mockEventPlain.title,
      false,
    );
    await calendarPage.verifyEventOnCalendar(
      mockGameDate.day,
      mockGameDate.season,
      mockEventRecurring.title,
      true,
    );
  }

  await calendarPage.updateYear(1);

  await calendarPage.deleteEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
  );
  await calendarPage.deleteEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventRecurring.title,
  );

  await calendarPage.deleteCalendar();
});

test('Validate game event form requires name and tag', async ({
  welcomePage,
  calendarPage,
}) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.selectDateForEvents(mockGameDate.day, mockGameDate.season);
  await calendarPage.verifyEventNameAndTagAreUnique(mockEventPlain);
  await calendarPage.deleteCalendar();
});
