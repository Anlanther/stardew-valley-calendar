import { Season } from '../src/app/models/season.model';
import { test } from './fixtures/app-fixture';
import { CalendarForm } from './models/calendar-form.model';
import { EventForm } from './models/event-form.model';
import { getMockCalendarForm, getMockEventForm } from './utils/util-functions';

const mockCalendarPlain: CalendarForm = getMockCalendarForm();
const mockSeason = Season.FALL;
const mockGoalPlain: EventForm = getMockEventForm();
const mockGoalRecurring: EventForm = getMockEventForm({
  title: `${mockGoalPlain.title} Recurring`,
  isRecurring: true,
});

test('Add season goal should only apply to active calendar', async ({
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
  await calendarPage.createSeasonGoal(mockSeason, mockGoalPlain);
  await calendarPage.verifyGoalOnSeasonDrawer(
    mockSeason,
    mockGoalPlain.title,
    true,
  );
  await calendarPage.createCalendar(plainCalendar2);
  await calendarPage.verifyGoalOnSeasonDrawer(
    mockSeason,
    mockGoalPlain.title,
    false,
  );

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(plainCalendar1.name);
  await calendarPage.deleteCalendar();
});

test('Goal recurs if set', async ({ welcomePage, calendarPage }) => {
  const mockOtherYearsToTest = [2, 5, 10];

  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await calendarPage.createSeasonGoal(mockSeason, mockGoalPlain);
  await calendarPage.createSeasonGoal(mockSeason, mockGoalRecurring);

  for (let i = 0; i < mockOtherYearsToTest.length; i++) {
    const year = mockOtherYearsToTest[i];
    await calendarPage.updateYear(year);
    await calendarPage.openSeasonDrawer();
    await calendarPage.verifyGoalOnSeasonDrawer(
      mockSeason,
      mockGoalPlain.title,
      false,
    );
    await calendarPage.verifyGoalOnSeasonDrawer(
      mockSeason,
      mockGoalRecurring.title,
      true,
    );
  }
  await calendarPage.updateYear(1);
  await calendarPage.deleteCalendar();
});

test('Goal requires name and tag', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await calendarPage.selectSeason(mockSeason);
  await calendarPage.verifyFormNameAndTagAreUnique(mockGoalPlain, 'season');
  await calendarPage.deleteCalendar();
});

test('Create game dialog does not allow for titles with more than 50 characters', async ({
  welcomePage,
  seasonDrawerComponent,
  createEventDialog,
  calendarPage,
}) => {
  const plainCalendar = getMockCalendarForm();
  const characterLimitErrorMessage = 'Over 50 character limit';
  const goalWithInvalidTitleLength = getMockEventForm({
    title: 'A fail test title that is fifty one characters long',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await calendarPage.openSeasonDrawer();
  await seasonDrawerComponent.clickCreateGoalButton();
  await createEventDialog.fillForm(goalWithInvalidTitleLength);

  await createEventDialog.verifyErrorState(
    goalWithInvalidTitleLength,
    characterLimitErrorMessage,
    true,
  );

  await calendarPage.deleteCalendar();
});
