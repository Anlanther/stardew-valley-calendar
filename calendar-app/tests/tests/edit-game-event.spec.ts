import { UnsavedCalendar } from '../../src/app/models/calendar.model';
import { UnsavedGameDate } from '../../src/app/models/game-date.model';
import { Season } from '../../src/app/models/season.model';
import { TagCategory } from '../../src/app/models/tag-category.model';
import { Tag } from '../../src/app/models/tag.model';
import { test } from '../fixtures/app-fixture';
import { MOCK_CALENDAR_TO_CREATE } from '../mocks/calendar-to-create.mock';
import { EventForm } from '../models/event-form.model';

const mockCalendarWithAllSystem: UnsavedCalendar = {
  ...MOCK_CALENDAR_TO_CREATE,
  systemConfig: {
    includeBirthdays: true,
    includeCrops: true,
    includeFestivals: true,
  },
};

test('Day form drawer opens', async ({
  welcomePage,
  calendarPage,
  menuComponent,
}) => {
  const mockGameDate: UnsavedGameDate = {
    day: 3,
    season: Season.FALL,
    isRecurring: true,
  };
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.selectDate(mockGameDate.day, mockGameDate.season);
  await calendarPage.validateDayFormDrawerIsOpenWithDate(
    mockGameDate.day,
    mockGameDate.season,
  );
  await menuComponent.deleteCalendar();
});

test('Add game event', async ({
  welcomePage,
  calendarPage,
  createEventDialog,
}) => {
  const mockGameDate: UnsavedGameDate = {
    day: 3,
    season: Season.FALL,
    isRecurring: true,
  };
  const mockEvent: EventForm = {
    title: 'Mining Day',
    description: 'Try to get to floor 50 in the mines',
    tag: Tag.Mining,
    tagCategory: TagCategory.ACTIVITY,
    isRecurring: false,
  };
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.selectDate(mockGameDate.day, mockGameDate.season);
  await calendarPage.clickCreateEventButton();
  await createEventDialog.createEvent(mockEvent);
  await calendarPage.verifyEventOnCalendar(
    mockGameDate.day,
    mockGameDate.season,
    mockEvent.title,
    true,
  );
  await calendarPage.verifyEventOnDayFormDrawer(
    mockGameDate.day,
    mockGameDate.season,
    mockEvent.title,
    true,
  );
  await calendarPage.deleteEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEvent.title,
  );
});

test('Edit game event has correct input', async ({
  welcomePage,
  calendarPage,
  createEventDialog,
  editEventDialog,
}) => {
  const mockGameDate: UnsavedGameDate = {
    day: 3,
    season: Season.FALL,
    isRecurring: true,
  };
  const mockEvent: EventForm = {
    title: 'Mining Day',
    description: 'Try to get to floor 50 in the mines.',
    tag: Tag.Mining,
    tagCategory: TagCategory.ACTIVITY,
    isRecurring: false,
  };
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.selectDate(mockGameDate.day, mockGameDate.season);
  await calendarPage.clickCreateEventButton();
  await createEventDialog.createEvent(mockEvent);
  await calendarPage.openEventEditDialog(
    mockGameDate.day,
    mockGameDate.season,
    mockEvent.title,
  );
  await editEventDialog.verifyInput(mockEvent);

  await editEventDialog.clickCancelButton();
  await calendarPage.deleteEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEvent.title,
  );
});

test('Game event recurs if set', async ({
  welcomePage,
  calendarPage,
  createEventDialog,
  menuComponent,
  editCalendarDialog,
}) => {
  const mockOtherYearsToTest = [2, 5, 10];
  const mockGameDate = {
    day: 3,
    season: Season.FALL,
  };
  const mockEvent: EventForm = {
    title: 'Mining Day',
    description: 'Try to get to floor 50 in the mines.',
    tag: Tag.Mining,
    tagCategory: TagCategory.ACTIVITY,
    isRecurring: false,
  };
  const mockEventRecurring: EventForm = {
    title: 'Mining Day Recurring',
    description: 'Try to get to floor 50 in the mines.',
    tag: Tag.Mining,
    tagCategory: TagCategory.ACTIVITY,
    isRecurring: true,
  };
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.selectDate(mockGameDate.day, mockGameDate.season);
  await calendarPage.clickCreateEventButton();
  await createEventDialog.createEvent(mockEvent);
  await calendarPage.clickCreateEventButton();
  await createEventDialog.createEvent(mockEventRecurring);
  await calendarPage.verifyEventOnCalendar(
    mockGameDate.day,
    mockGameDate.season,
    mockEvent.title,
    true,
  );
  await calendarPage.verifyEventOnCalendar(
    mockGameDate.day,
    mockGameDate.season,
    mockEventRecurring.title,
    true,
  );

  for (let i = 0; i < mockOtherYearsToTest.length; i++) {
    const year = mockOtherYearsToTest[i];
    await menuComponent.selectEditCalendar();
    await editCalendarDialog.updateYearForm(year);
    await editCalendarDialog.clickEditButton();
    await calendarPage.verifyEventOnCalendar(
      mockGameDate.day,
      mockGameDate.season,
      mockEvent.title,
      false,
    );
    await calendarPage.verifyEventOnCalendar(
      mockGameDate.day,
      mockGameDate.season,
      mockEventRecurring.title,
      true,
    );
  }

  await menuComponent.selectEditCalendar();
  await editCalendarDialog.updateYearForm(1);
  await editCalendarDialog.clickEditButton();

  await calendarPage.deleteEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEvent.title,
  );
  await calendarPage.deleteEvent(
    mockGameDate.day,
    mockGameDate.season,
    mockEventRecurring.title,
  );
});

test('Validate game event form requires name and tag', async ({
  welcomePage,
  calendarPage,
  createEventDialog,
}) => {
  const mockGameDate = {
    day: 3,
    season: Season.FALL,
  };
  const mockEvent: EventForm = {
    title: 'Mining Day',
    description: 'Try to get to floor 50 in the mines.',
    tag: Tag.Mining,
    tagCategory: TagCategory.ACTIVITY,
    isRecurring: false,
  };
  await welcomePage.selectOrCreateCalendar(mockCalendarWithAllSystem);
  await calendarPage.selectDate(mockGameDate.day, mockGameDate.season);

  await calendarPage.clickCreateEventButton();
  await createEventDialog.fillTitleForm(mockEvent.title);
  await createEventDialog.verifyCreateButtonState(false);
  await createEventDialog.clickCancelButton();

  await calendarPage.clickCreateEventButton();
  await createEventDialog.selectTag(mockEvent.tagCategory, mockEvent.tag);
  await createEventDialog.verifyCreateButtonState(false);
  await createEventDialog.clickCancelButton();

  await calendarPage.clickCreateEventButton();
  await createEventDialog.fillTitleForm(mockEvent.title);
  await createEventDialog.selectTag(mockEvent.tagCategory, mockEvent.tag);
  await createEventDialog.verifyCreateButtonState(true);
  await createEventDialog.clickCancelButton();
});
