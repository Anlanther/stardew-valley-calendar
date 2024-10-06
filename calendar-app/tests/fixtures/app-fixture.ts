import { test as base } from '@playwright/test';
import { CalendarPage } from '../pages/calendar-page';
import { CreateCalendarDialog } from '../pages/components/create-calendar-dialog';
import { CreateEventDialog } from '../pages/components/create-event-dialog';
import { DeleteCalendarDialog } from '../pages/components/delete-calendar-dialog';
import { DrawerComponent } from '../pages/components/drawer-component';
import { EditCalendarDialog } from '../pages/components/edit-calendar-dialog';
import { EditEventDialog } from '../pages/components/edit-event-dialog';
import { MenuComponent } from '../pages/components/menu-component';
import { SelectCalendarDialog } from '../pages/components/select-calendar-dialog';
import { WelcomePage } from '../pages/welcome-page';

type AppFixtures = {
  welcomePage: WelcomePage;
  calendarPage: CalendarPage;
  createCalendarDialog: CreateCalendarDialog;
  selectCalendarDialog: SelectCalendarDialog;
  createEventDialog: CreateEventDialog;
  editEventDialog: EditEventDialog;
  menuComponent: MenuComponent;
  drawerComponent: DrawerComponent;
  editCalendarDialog: EditCalendarDialog;
  deleteCalendarDialog: DeleteCalendarDialog;
};

export const test = base.extend<AppFixtures>({
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },
  createCalendarDialog: async ({ page }, use) => {
    await use(new CreateCalendarDialog(page));
  },
  editCalendarDialog: async ({ page }, use) => {
    await use(new EditCalendarDialog(page));
  },
  createEventDialog: async ({ page }, use) => {
    await use(new CreateEventDialog(page));
  },
  editEventDialog: async ({ page }, use) => {
    await use(new EditEventDialog(page));
  },
  deleteCalendarDialog: async ({ page }, use) => {
    await use(new DeleteCalendarDialog(page));
  },
  selectCalendarDialog: async ({ page }, use) => {
    await use(new SelectCalendarDialog(page));
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
