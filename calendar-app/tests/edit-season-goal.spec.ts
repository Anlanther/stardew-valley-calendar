import { Season } from '../src/app/models/season.model';
import { test } from './fixtures/app-fixture';
import { EventForm } from './models/event-form.model';
import { getMockCalendarForm, getMockEventForm } from './utils/util-functions';

const mockGoalPlain: EventForm = getMockEventForm();
const mockCalendarPlain = getMockCalendarForm();
const mockSeason = Season.FALL;

test('Delete season goal', async ({ welcomePage, calendarPage }) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await calendarPage.createSeasonGoal(mockSeason, mockGoalPlain);
  await calendarPage.verifyGoalOnSeasonDrawer(
    mockSeason,
    mockGoalPlain.title,
    true,
  );
  await calendarPage.deleteGoal(mockSeason, mockGoalPlain.title);
  await calendarPage.verifyGoalOnSeasonDrawer(
    mockSeason,
    mockGoalPlain.title,
    false,
  );

  await calendarPage.deleteCalendar();
});

test('Edit goal has correct input when opened', async ({
  welcomePage,
  calendarPage,
}) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await calendarPage.createSeasonGoal(mockSeason, mockGoalPlain);
  await calendarPage.verifyGoalDetailsInEditDialog(mockSeason, mockGoalPlain);

  await calendarPage.deleteCalendar();
});

test('Edit game dialog does not allow for titles with more than 50 characters', async ({
  welcomePage,
  editEventDialog,
  seasonDrawerComponent,
  calendarPage,
}) => {
  const characterLimitErrorMessage = 'Over 50 character limit';
  const goalWithInvalidTitleLength = {
    ...mockGoalPlain,
    title: 'A fail test title that is fifty one characters long',
  };

  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await calendarPage.createSeasonGoal(mockSeason, mockGoalPlain);
  await seasonDrawerComponent.openGoalEditDialog(mockGoalPlain.title);
  await editEventDialog.fillForm(goalWithInvalidTitleLength);

  await editEventDialog.verifyErrorState(
    goalWithInvalidTitleLength,
    characterLimitErrorMessage,
    true,
  );

  await calendarPage.deleteCalendar();
});
