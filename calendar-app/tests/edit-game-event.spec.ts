import { Season } from '../src/app/models/season.model';
import { test } from './fixtures/app-fixture';
import { CalendarForm } from './models/calendar-form.model';
import { EventForm } from './models/event-form.model';
import { getMockCalendarForm, getMockEventForm } from './utils/util-functions';

const mockEventPlain: EventForm = getMockEventForm();
const mockCalendarWithAllSystem: CalendarForm = getMockCalendarForm({
  name: `Mock Calendar with All System`,
  includeBirthdays: true,
  includeCrops: true,
  includeFestivals: true,
});
const mockGameDate = {
  day: 3,
  season: Season.FALL,
};

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

test('Edit game event has correct input when opened', async ({
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

test('Edit game dialog does not allow for titles with more than 50 characters', async ({
  welcomePage,
  drawerComponent,
  editEventDialog,
  calendarPage,
}) => {
  const plainCalendar = getMockCalendarForm();
  const characterLimitErrorMessage = 'Over 50 character limit';
  const eventWithInvalidTitleLength = {
    ...mockEventPlain,
    title: 'A fail test title that is fifty one characters long',
  };

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await calendarPage.createGameEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain,
  );
  await calendarPage.selectDateForEvents(mockGameDate.day, mockGameDate.season);
  await drawerComponent.openEventEditDialog(mockEventPlain.title);
  await editEventDialog.fillForm(eventWithInvalidTitleLength);

  await editEventDialog.verifyErrorState(
    eventWithInvalidTitleLength,
    characterLimitErrorMessage,
    true,
  );

  await calendarPage.deleteCalendar();
});
