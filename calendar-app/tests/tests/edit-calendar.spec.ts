import { UnsavedCalendar } from '../../src/app/models/calendar.model';
import { test } from '../fixtures/app-fixture';
import { MOCK_CALENDAR_TO_CREATE } from '../mocks/calendar-to-create.mock';

test.describe('Edit Calendar', () => {
  const mockCalendarPlain: UnsavedCalendar = { ...MOCK_CALENDAR_TO_CREATE };

  test('Name in title updates', async ({
    welcomePage,
    calendarPage,
    menuComponent,
    editCalendarDialog,
  }) => {
    const updatedName = 'Updated Plain Mock';
    await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
    await menuComponent.selectEditCalendar();
    await editCalendarDialog.updateNameForm(updatedName);
    await editCalendarDialog.clickEditButton();
    await calendarPage.verifyCorrectTitle(updatedName, 1);
  });

  test('Year in title updates', async ({
    welcomePage,
    calendarPage,
    menuComponent,
    editCalendarDialog,
  }) => {
    const updatedYear = 2;
    await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
    await menuComponent.selectEditCalendar();
    await editCalendarDialog.updateYearForm(updatedYear);
    await editCalendarDialog.clickEditButton();
    await calendarPage.verifyCorrectTitle(mockCalendarPlain.name, updatedYear);
  });
});
