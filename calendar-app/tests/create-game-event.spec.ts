import { Season } from '../src/app/models/season.model';
import { test } from './fixtures/app-fixture';
import { EventForm } from './models/event-form.model';
import { getMockCalendarForm, getMockEventForm } from './utils/util-functions';

const mockGameDate = {
  day: 3,
  season: Season.FALL,
};
const mockEventPlain: EventForm = getMockEventForm();
const mockEventRecurring: EventForm = getMockEventForm({
  title: `${mockEventPlain.title} Recurring`,
  isRecurring: true,
});

test('Add game event should only apply to active calendar', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar1 = getMockCalendarForm({
    name: 'Create Game Event Test',
  });
  const plainCalendar2 = getMockCalendarForm({
    name: 'Create Game Event Test2',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar1);
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
  await calendarPage.verifyEventOnDayDrawer(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
    true,
  );
  await calendarPage.createCalendar(plainCalendar2);
  await calendarPage.verifyEventOnCalendar(
    mockGameDate.day,
    mockGameDate.season,
    mockEventPlain.title,
    false,
  );

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(plainCalendar1.name);
  await calendarPage.deleteCalendar();
});

test('Game event recurs if set', async ({ welcomePage, calendarPage }) => {
  const mockOtherYearsToTest = [2, 5, 10];
  const mockCalendarPlain = getMockCalendarForm();

  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
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
  await calendarPage.deleteCalendar();
});

test('Game event form requires name and tag', async ({
  welcomePage,
  calendarPage,
}) => {
  const mockCalendarPlain = getMockCalendarForm();

  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await calendarPage.selectDateForEvents(mockGameDate.day, mockGameDate.season);
  await calendarPage.verifyFormNameAndTagAreUnique(mockEventPlain, 'day');
  await calendarPage.deleteCalendar();
});

test('Create game dialog does not allow for titles with more than 50 characters', async ({
  welcomePage,
  dayDrawerComponent,
  createEventDialog,
  calendarPage,
}) => {
  const plainCalendar = getMockCalendarForm();
  const characterLimitErrorMessage = 'Over 50 character limit';
  const eventWithInvalidTitleLength = getMockEventForm({
    title: 'A fail test title that is fifty one characters long',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await calendarPage.selectDateForEvents(mockGameDate.day, mockGameDate.season);
  await dayDrawerComponent.clickCreateEventButton();
  await createEventDialog.fillForm(eventWithInvalidTitleLength);

  await createEventDialog.verifyErrorState(
    eventWithInvalidTitleLength,
    characterLimitErrorMessage,
    true,
  );

  await calendarPage.deleteCalendar();
});
