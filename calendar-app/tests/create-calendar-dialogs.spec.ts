import { test } from './fixtures/app-fixture';
import { getMockCalendarForm } from './utils/util-functions';

test('Select calendar displays list of all existing calendar names correctly', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar1 = getMockCalendarForm({
    name: 'Mock Calendar Select T1',
  });
  const plainCalendar2 = getMockCalendarForm({
    name: 'Mock Calendar Select T2',
  });
  const plainCalendar3 = getMockCalendarForm({
    name: 'Mock Calendar Select T3',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar1);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.createCalendar(plainCalendar2);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar2.name, true);
  await calendarPage.createCalendar(plainCalendar3);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar2.name, true);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar3.name, true);

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(plainCalendar2.name);
  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(plainCalendar1.name);
  await calendarPage.deleteCalendar();
});

test('Create calendar dialog does not allow for duplicate name to be set', async ({
  welcomePage,
  calendarPage,
  menuComponent,
  createCalendarDialog,
}) => {
  const plainCalendar = getMockCalendarForm({ name: 'My Unique Calendar' });
  const duplicateNamedCalendar = getMockCalendarForm({
    name: 'My Unique Calendar',
  });
  const duplicateErrorMessage = 'Duplicate Name';

  await welcomePage.selectOrCreateCalendar(plainCalendar);
  await menuComponent.selectCreateCalendar();
  await createCalendarDialog.verifyErrorState(
    duplicateNamedCalendar,
    duplicateErrorMessage,
    true,
  );

  await calendarPage.deleteCalendar();
});

test('Create calendar dialog does not allow for titles with more than 50 characters', async ({
  welcomePage,
  createCalendarDialog,
}) => {
  const calendarWithInvalidNameLength = getMockCalendarForm({
    name: 'A fail test title that is fifty one characters long',
  });
  const characterLimitErrorMessage = 'Over 50 character limit';

  await welcomePage.openCalendarReadyPage();
  await welcomePage.clickCreateCalendar();
  await createCalendarDialog.verifyErrorState(
    calendarWithInvalidNameLength,
    characterLimitErrorMessage,
    true,
  );
});

test('Create calendar dialog does not allow empty title', async ({
  welcomePage,
  createCalendarDialog,
}) => {
  const calendarWithNoName = getMockCalendarForm({
    name: '',
  });
  const nameRequiredMessage = 'Name is required';

  await welcomePage.openCalendarReadyPage();
  await welcomePage.clickCreateCalendar();
  await createCalendarDialog.verifyErrorState(
    calendarWithNoName,
    nameRequiredMessage,
    true,
  );
});
