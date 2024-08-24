import { UnsavedCalendar } from '../../src/app/models/calendar.model';
import { test } from '../fixtures/app-fixture';
import { MOCK_BIRTHDAY_EVENTS } from '../mocks/birthday-events.mock';
import { MOCK_CALENDAR_TO_CREATE } from '../mocks/calendar-to-create.mock';
import { MOCK_CROP_EVENTS } from '../mocks/crop-events.mock';
import { MOCK_FESTIVAL_EVENTS } from '../mocks/festival-events.mock';

test.describe('Create Calendar', () => {
  test.describe('Welcome Page', () => {
    test.beforeEach(async ({ welcomePage }) => {
      await welcomePage.openPage();
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
      const withNoName: UnsavedCalendar = {
        ...MOCK_CALENDAR_TO_CREATE,
        systemConfig: {
          ...MOCK_CALENDAR_TO_CREATE.systemConfig,
          includeBirthdays: true,
        },
        name: '',
      };

      await welcomePage.clickCreateCalendar();
      await createCalendarDialog.fillForm(
        withNoName.name,
        withNoName.description,
        withNoName.systemConfig.includeBirthdays,
        withNoName.systemConfig.includeFestivals,
        withNoName.systemConfig.includeCrops,
      );
      await createCalendarDialog.verifyCreateButtonIsDisabled();
    });
  });

  test.describe('Main Page', () => {
    test('App heading to have calendar name and default to year 1 Spring', async ({
      welcomePage,
      calendarPage,
    }) => {
      await welcomePage.openExistingCalendar(MOCK_CALENDAR_TO_CREATE.name);
      // await welcomePage.openAndCreateCalendar(MOCK_CALENDAR_TO_CREATE);
      await calendarPage.verifyCorrectTitle(MOCK_CALENDAR_TO_CREATE.name);
    });

    test('Only birthdays are included', async ({
      welcomePage,
      calendarPage,
    }) => {
      const mockWithBirthdays: UnsavedCalendar = {
        ...MOCK_CALENDAR_TO_CREATE,
        name: `${MOCK_CALENDAR_TO_CREATE.name} with Birthdays`,
        systemConfig: {
          ...MOCK_CALENDAR_TO_CREATE.systemConfig,
          includeBirthdays: true,
        },
      };

      // await welcomePage.openAndCreateCalendar(mockWithBirthdays);
      await welcomePage.openExistingCalendar(mockWithBirthdays.name);

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
      const mockWithCrops: UnsavedCalendar = {
        ...MOCK_CALENDAR_TO_CREATE,
        name: `${MOCK_CALENDAR_TO_CREATE.name} with Crops`,
        systemConfig: {
          ...MOCK_CALENDAR_TO_CREATE.systemConfig,
          includeBirthdays: true,
        },
      };

      // await welcomePage.openAndCreateCalendar(mockWithCrops);
      await welcomePage.openExistingCalendar(mockWithCrops.name);

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
      const mockWithFestivals: UnsavedCalendar = {
        ...MOCK_CALENDAR_TO_CREATE,
        name: `${MOCK_CALENDAR_TO_CREATE.name} with Festivals`,
        systemConfig: {
          ...MOCK_CALENDAR_TO_CREATE.systemConfig,
          includeBirthdays: true,
        },
      };

      await welcomePage.openAndCreateCalendar(mockWithFestivals);
      // await welcomePage.openExistingCalendar(mockWithFestivals.name);

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

    // test.describe('Menu', () => {
    //   test('Edit Calendar is correctly populated with created config', async({welcomePage}) => {
    // })

    // test('Create New from menu opens create dialog', async({welcomePage}) => {
    // })

    // test('Select Calendar opens select dialog with current calendar being selected', async({welcomePage}) => {
    // })

    //   })

    // test.afterEach(async ({ menuComponent }) => {
    //   await menuComponent.selectCalendar(MOCK_CALENDAR_TO_CREATE.name);
    //   await menuComponent.deleteCalendar();
    // });
  });
});
