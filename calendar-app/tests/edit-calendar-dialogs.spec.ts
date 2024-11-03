import { test } from './fixtures/app-fixture';
import { getMockCalendarForm } from './utils/util-functions';

test('Edited calendar name displays correctly on select calendar dialog', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar1 = getMockCalendarForm({
    name: 'Mock Calendar',
  });
  const plainCalendar2 = getMockCalendarForm({
    name: 'Another Mock Calendar',
  });
  const newPlainCalendar1Name = 'Calendar Name Changed';
  const newPlainCalendar2Name = 'Updated Mock Calendar';

  await welcomePage.selectOrCreateCalendar(plainCalendar1);
  await calendarPage.createCalendar(plainCalendar2);
  await calendarPage.updateCalendarName(newPlainCalendar2Name);
  await calendarPage.verifyCalendarInSelectDialog(newPlainCalendar2Name, true);
  await calendarPage.openExistingCalendar(plainCalendar1.name);
  await calendarPage.verifyCalendarInSelectDialog(newPlainCalendar2Name, true);
  await calendarPage.updateCalendarName(newPlainCalendar1Name);
  await calendarPage.verifyCalendarInSelectDialog(newPlainCalendar2Name, true);
  await calendarPage.verifyCalendarInSelectDialog(newPlainCalendar1Name, true);

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(newPlainCalendar2Name);
  await calendarPage.deleteCalendar();
});

test('Select calendar dialog no longer shows calendar name when it is deleted', async ({
  welcomePage,
  calendarPage,
}) => {
  const plainCalendar1 = getMockCalendarForm({
    name: 'Mock Calendar',
  });
  const plainCalendar2 = getMockCalendarForm({
    name: 'Another Mock Calendar',
  });

  await welcomePage.selectOrCreateCalendar(plainCalendar1);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.createCalendar(plainCalendar2);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await calendarPage.verifyCalendarInSelectDialog(plainCalendar2.name, true);
  await calendarPage.deleteCalendar();
  await welcomePage.verifyCalendarInSelectDialog(plainCalendar1.name, true);
  await welcomePage.verifyCalendarInSelectDialog(plainCalendar2.name, false);

  await welcomePage.openExistingCalendar(plainCalendar1.name);
  await calendarPage.deleteCalendar();
  await welcomePage.verifyNoExistingCalendarsMessage();
});

test('Edit calendar dialog does not allow for duplicate name to be set', async ({
  welcomePage,
  calendarPage,
  menuComponent,
  editCalendarDialog,
}) => {
  const existingCalendar = getMockCalendarForm({ name: 'My Unique Calendar' });
  const calendarToTest = getMockCalendarForm({ name: 'Test Calendar' });
  const duplicateErrorMessage = 'Duplicate Name';

  await welcomePage.selectOrCreateCalendar(existingCalendar);
  await calendarPage.createCalendar(calendarToTest);
  await menuComponent.selectEditCalendar();

  await editCalendarDialog.verifyErrorState(
    { ...calendarToTest, name: existingCalendar.name },
    duplicateErrorMessage,
    true,
  );

  await calendarPage.deleteCalendar();
  await welcomePage.openExistingCalendar(existingCalendar.name);
  await calendarPage.deleteCalendar();
});

test('Edit calendar dialog does not allow for titles with more than 50 characters', async ({
  welcomePage,
  menuComponent,
  editCalendarDialog,
  calendarPage,
}) => {
  const calendarToTest = getMockCalendarForm();
  const calendarWithInvalidNameLength = getMockCalendarForm({
    name: 'A fail test title that is fifty one characters long',
  });
  const characterLimitErrorMessage = 'Over 50 character limit';

  await welcomePage.selectOrCreateCalendar(calendarToTest);
  await menuComponent.selectEditCalendar();
  await editCalendarDialog.verifyErrorState(
    calendarWithInvalidNameLength,
    characterLimitErrorMessage,
    true,
  );

  await calendarPage.deleteCalendar();
});

test('Edit calendar dialog does not allow for empty title', async ({
  welcomePage,
  menuComponent,
  editCalendarDialog,
  calendarPage,
}) => {
  const calendarToTest = getMockCalendarForm();
  const nameRequiredMessage = 'Name is required';
  const calendarWithNoName = getMockCalendarForm({
    name: '',
  });

  await welcomePage.selectOrCreateCalendar(calendarToTest);
  await menuComponent.selectEditCalendar();
  await editCalendarDialog.verifyErrorState(
    calendarWithNoName,
    nameRequiredMessage,
    true,
  );

  await calendarPage.deleteCalendar();
});
