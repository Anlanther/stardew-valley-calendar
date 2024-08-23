import { UnsavedCalendar } from '../../src/app/models/calendar.model';
import { test } from '../fixtures/app-fixture';
import { MOCK_CALENDAR_TO_CREATE } from '../mocks/calendar-to-create.mock';

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
      menuComponent,
    }) => {
      await welcomePage.openExistingCalendar(MOCK_CALENDAR_TO_CREATE.name);
      await welcomePage.page.waitForTimeout(5000);
      await menuComponent.openMenu();
      // await welcomePage.openAndCreateCalendar(MOCK_CALENDAR_TO_CREATE);
      // await calendarPage.verifyCorrectTitle(MOCK_CALENDAR_TO_CREATE.name);
    });

    //   test('Only birthdays are included', async({welcomePage}) => {
    // })
    //   test('Only crops are included', async({welcomePage}) => {
    // })
    //   test('Only festivals are included', async({welcomePage}) => {
    // })
    // test.describe('Menu', () => {
    //   test('Edit Calendar is correctly populated with created config', async({welcomePage}) => {
    // })
    // test('Create New opens create dialog', async({welcomePage}) => {
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
