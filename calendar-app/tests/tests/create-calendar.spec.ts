import { UnsavedCalendar } from '../../src/app/models/calendar.model';
import { test } from '../fixtures/app-fixture';
import { MOCK_BIRTHDAY_EVENTS } from '../mocks/birthday-events.mock';
import { MOCK_CALENDAR_TO_CREATE } from '../mocks/calendar-to-create.mock';
import { MOCK_CROP_EVENTS } from '../mocks/crop-events.mock';
import { MOCK_FESTIVAL_EVENTS } from '../mocks/festival-events.mock';

test.describe('Create Calendar', () => {
  const mockCalendarPlain: UnsavedCalendar = { ...MOCK_CALENDAR_TO_CREATE };
  const mockCalendarNoName: UnsavedCalendar = {
    ...MOCK_CALENDAR_TO_CREATE,
    systemConfig: {
      ...MOCK_CALENDAR_TO_CREATE.systemConfig,
      includeBirthdays: true,
    },
    name: '',
  };
  const mockCalendarWithBirthdays: UnsavedCalendar = {
    ...MOCK_CALENDAR_TO_CREATE,
    name: `${MOCK_CALENDAR_TO_CREATE.name} with Birthdays`,
    systemConfig: {
      ...MOCK_CALENDAR_TO_CREATE.systemConfig,
      includeBirthdays: true,
    },
  };
  const mockCalendarWithCrops: UnsavedCalendar = {
    ...MOCK_CALENDAR_TO_CREATE,
    name: `${MOCK_CALENDAR_TO_CREATE.name} with Crops`,
    systemConfig: {
      ...MOCK_CALENDAR_TO_CREATE.systemConfig,
      includeCrops: true,
    },
  };
  const mockCalendarWithFestivals: UnsavedCalendar = {
    ...MOCK_CALENDAR_TO_CREATE,
    name: `${MOCK_CALENDAR_TO_CREATE.name} with Festivals`,
    systemConfig: {
      ...MOCK_CALENDAR_TO_CREATE.systemConfig,
      includeFestivals: true,
    },
  };
  test.describe('Welcome Page', () => {
    test.beforeEach(async ({ welcomePage }) => {
      await welcomePage.openCalendarReadyPage();
    });

    test('Create button is disabled by default', async ({
      welcomePage,
      createCalendarDialog,
    }) => {
      await welcomePage.clickCreateCalendar();
      await createCalendarDialog.verifyCreateButtonIsDisabled();
    });

    test('Form requires name', async ({
      welcomePage,
      createCalendarDialog,
    }) => {
      await welcomePage.clickCreateCalendar();
      await createCalendarDialog.fillForm(
        mockCalendarNoName.name,
        mockCalendarNoName.description,
        mockCalendarNoName.systemConfig.includeBirthdays,
        mockCalendarNoName.systemConfig.includeFestivals,
        mockCalendarNoName.systemConfig.includeCrops,
      );
      await createCalendarDialog.verifyCreateButtonIsDisabled();
    });
  });

  test.describe('Main Page', () => {
    test('App heading to have calendar name and default to year 1 Spring', async ({
      welcomePage,
      calendarPage,
    }) => {
      await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
      await calendarPage.verifyCorrectTitle(mockCalendarPlain.name, 1);
    });

    test('Only birthdays are included', async ({
      welcomePage,
      calendarPage,
    }) => {
      await welcomePage.selectOrCreateCalendar(mockCalendarWithBirthdays);

      for (let i = 0; i < MOCK_BIRTHDAY_EVENTS.length; i++) {
        const mockBirthday = MOCK_BIRTHDAY_EVENTS[i];
        await calendarPage.verifyEvent(
          mockBirthday.gameDate.day,
          mockBirthday.gameDate.season,
          mockBirthday.title,
          true,
        );
      }
      for (let i = 0; i < MOCK_CROP_EVENTS.length; i++) {
        const mockCrop = MOCK_CROP_EVENTS[i];
        await calendarPage.verifyEvent(
          mockCrop.gameDate.day,
          mockCrop.gameDate.season,
          mockCrop.title,
          false,
        );
      }
      for (let i = 0; i < MOCK_FESTIVAL_EVENTS.length; i++) {
        const mockFestival = MOCK_FESTIVAL_EVENTS[i];
        await calendarPage.verifyEvent(
          mockFestival.gameDate.day,
          mockFestival.gameDate.season,
          mockFestival.title,
          false,
        );
      }
    });

    test('Only crops are included', async ({ welcomePage, calendarPage }) => {
      await welcomePage.selectOrCreateCalendar(mockCalendarWithCrops);

      for (let i = 0; i < MOCK_BIRTHDAY_EVENTS.length; i++) {
        const mockBirthday = MOCK_BIRTHDAY_EVENTS[i];
        await calendarPage.verifyEvent(
          mockBirthday.gameDate.day,
          mockBirthday.gameDate.season,
          mockBirthday.title,
          false,
        );
      }
      for (let i = 0; i < MOCK_CROP_EVENTS.length; i++) {
        const mockCrop = MOCK_CROP_EVENTS[i];
        await calendarPage.verifyEvent(
          mockCrop.gameDate.day,
          mockCrop.gameDate.season,
          mockCrop.title,
          true,
        );
      }
      for (let i = 0; i < MOCK_FESTIVAL_EVENTS.length; i++) {
        const mockFestival = MOCK_FESTIVAL_EVENTS[i];
        await calendarPage.verifyEvent(
          mockFestival.gameDate.day,
          mockFestival.gameDate.season,
          mockFestival.title,
          false,
        );
      }
    });

    test('Only festivals are included', async ({
      welcomePage,
      calendarPage,
    }) => {
      await welcomePage.selectOrCreateCalendar(mockCalendarWithFestivals);

      for (let i = 0; i < MOCK_BIRTHDAY_EVENTS.length; i++) {
        const mockBirthday = MOCK_BIRTHDAY_EVENTS[i];
        await calendarPage.verifyEvent(
          mockBirthday.gameDate.day,
          mockBirthday.gameDate.season,
          mockBirthday.title,
          false,
        );
      }
      for (let i = 0; i < MOCK_CROP_EVENTS.length; i++) {
        const mockCrop = MOCK_CROP_EVENTS[i];
        await calendarPage.verifyEvent(
          mockCrop.gameDate.day,
          mockCrop.gameDate.season,
          mockCrop.title,
          false,
        );
      }
      for (let i = 0; i < MOCK_FESTIVAL_EVENTS.length; i++) {
        const mockFestival = MOCK_FESTIVAL_EVENTS[i];
        await calendarPage.verifyEvent(
          mockFestival.gameDate.day,
          mockFestival.gameDate.season,
          mockFestival.title,
          true,
        );
      }
    });

    test.describe('Menu', () => {
      test('Edit Calendar is correctly populated with created config', async ({
        welcomePage,
        menuComponent,
        editCalendarDialog,
      }) => {
        await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
        await menuComponent.selectEditCalendar();
        await editCalendarDialog.verifyInput(mockCalendarPlain);
      });

      test('Create New from menu opens create dialog', async ({
        welcomePage,
        menuComponent,
      }) => {
        await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
        await menuComponent.selectCreateCalendar();
      });

      test('Select Calendar opens select dialog with current calendar being selected', async ({
        welcomePage,
        menuComponent,
        selectCalendarDialog,
      }) => {
        await welcomePage.selectOrCreateCalendar(mockCalendarPlain);
        await menuComponent.selectSelectCalendar();
        await selectCalendarDialog.verifySelectedCalendar(
          mockCalendarPlain.name,
        );
      });
    });
  });
});
