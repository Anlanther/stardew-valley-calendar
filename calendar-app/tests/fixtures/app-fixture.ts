import { test as base } from '@playwright/test';
import { CalendarPage } from '../pages/calendar-page';
import { CreateCalendarDialog } from '../pages/create-calendar-dialog';
import { DrawerComponent } from '../pages/drawer-component';
import { MenuComponent } from '../pages/menu-component';
import { WelcomePage } from '../pages/welcome-page';

type AppFixtures = {
  welcomePage: WelcomePage;
  calendarPage: CalendarPage;
  createCalendarDialog: CreateCalendarDialog;
  menuComponent: MenuComponent;
  drawerComponent: DrawerComponent;
};

export const test = base.extend<AppFixtures>({
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },
  createCalendarDialog: async ({ page }, use) => {
    await use(new CreateCalendarDialog(page));
  },
  menuComponent: async ({ page }, use) => {
    await use(new MenuComponent(page));
  },
  calendarPage: async ({ page }, use) => {
    await use(new CalendarPage(page));
  },
  drawerComponent: async ({ page }, use) => {
    await use(new DrawerComponent(page));
  },
});
