import { test as base } from '@playwright/test';
import { CalendarPage } from '../pages/calendar-page';
import { CreateCalendarDialog } from '../pages/components/create-calendar-dialog';
import { CreateEventDialog } from '../pages/components/create-event-dialog';
import { DayDrawerComponent } from '../pages/components/day-drawer-component';
import { DeleteCalendarDialog } from '../pages/components/delete-calendar-dialog';
import { DevMenuComponent } from '../pages/components/dev-menu';
import { EditCalendarDialog } from '../pages/components/edit-calendar-dialog';
import { EditEventDialog } from '../pages/components/edit-event-dialog';
import { MenuComponent } from '../pages/components/menu-component';
import { SeasonDrawerComponent } from '../pages/components/season-drawer-component';
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
  devMenuComponent: DevMenuComponent;
  dayDrawerComponent: DayDrawerComponent;
  seasonDrawerComponent: SeasonDrawerComponent;
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
  devMenuComponent: async ({ page }, use) => {
    await use(new DevMenuComponent(page));
  },
  calendarPage: async ({ page }, use) => {
    await use(new CalendarPage(page));
  },
  dayDrawerComponent: async ({ page }, use) => {
    await use(new DayDrawerComponent(page));
  },
  seasonDrawerComponent: async ({ page }, use) => {
    await use(new SeasonDrawerComponent(page));
  },
});
