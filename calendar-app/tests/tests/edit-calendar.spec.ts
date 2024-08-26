import { UnsavedCalendar } from '../../src/app/models/calendar.model';
import { test } from '../fixtures/app-fixture';
import { MOCK_BIRTHDAY_EVENTS } from '../mocks/birthday-events.mock';
import { MOCK_CALENDAR_TO_CREATE } from '../mocks/calendar-to-create.mock';
import { MOCK_CROP_EVENTS } from '../mocks/crop-events.mock';
import { MOCK_FESTIVAL_EVENTS } from '../mocks/festival-events.mock';

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
  await menuComponent.deleteCalendar();
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
  await menuComponent.deleteCalendar();
});

test('Calendar toggles birthdays on', async ({
  welcomePage,
  calendarPage,
  menuComponent,
  editCalendarDialog,
}) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await menuComponent.selectEditCalendar();
  await editCalendarDialog.updateIncludeBirthdaysCheckbox(true);
  await editCalendarDialog.clickEditButton();

  for (let i = 0; i < MOCK_BIRTHDAY_EVENTS.length; i++) {
    const mockBirthday = MOCK_BIRTHDAY_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockBirthday.gameDate.day,
      mockBirthday.gameDate.season,
      mockBirthday.title,
      true,
    );
  }

  await menuComponent.deleteCalendar();
});

test('Calendar toggles crops on', async ({
  welcomePage,
  calendarPage,
  menuComponent,
  editCalendarDialog,
}) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await menuComponent.selectEditCalendar();
  await editCalendarDialog.updateIncludeCropsCheckbox(true);
  await editCalendarDialog.clickEditButton();

  for (let i = 0; i < MOCK_CROP_EVENTS.length; i++) {
    const mockCrop = MOCK_CROP_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockCrop.gameDate.day,
      mockCrop.gameDate.season,
      mockCrop.title,
      true,
    );
  }

  await menuComponent.deleteCalendar();
});

test('Calendar toggles festivals on', async ({
  welcomePage,
  calendarPage,
  menuComponent,
  editCalendarDialog,
}) => {
  await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
  await menuComponent.selectEditCalendar();
  await editCalendarDialog.updateIncludeBirthdaysCheckbox(true);
  await editCalendarDialog.clickEditButton();

  for (let i = 0; i < MOCK_FESTIVAL_EVENTS.length; i++) {
    const mockFestival = MOCK_FESTIVAL_EVENTS[i];
    await calendarPage.verifyEventOnCalendar(
      mockFestival.gameDate.day,
      mockFestival.gameDate.season,
      mockFestival.title,
      false,
    );
  }

  await menuComponent.deleteCalendar();
});
