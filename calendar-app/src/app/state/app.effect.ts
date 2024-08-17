import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store, select } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, switchMap, tap } from 'rxjs';
import { CreateCalendarDialogComponent } from '../components/dialogs/calendar/create-dialog/create-dialog.component';
import { EditCalendarDialogComponent } from '../components/dialogs/calendar/edit-dialog/edit-dialog.component';
import { CreateEventDialogComponent } from '../components/dialogs/day-form/create-dialog/create-dialog.component';
import { EditEventDialogComponent } from '../components/dialogs/day-form/edit-dialog/edit-dialog.component';
import { UpdateYearDialogComponent } from '../components/dialogs/day-form/update-year-dialog/update-year-dialog.component';
import { DeleteDialogComponent } from '../components/dialogs/delete/delete-dialog.component';
import { AppStore } from '../models/app-store.model';
import {
  CalendarEvent,
  UnsavedCalendarEvent,
} from '../models/calendar-event.model';
import { StatusMessage } from '../models/status-message.model';
import { Type } from '../models/type.model';
import { CalendarDataService } from '../services/calendar/calendar-data.service';
import { GameEventDataService } from '../services/game-event/game-event-data.service';
import { Calendar_NoRelations } from '../services/models/calendar';
import { AppActions } from './app.actions';
import { AppFeature } from './app.state';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppStore>);
  private dialog = inject(MatDialog);
  private calendarDataService = inject(CalendarDataService);
  private gameEventDataService = inject(GameEventDataService);

  initialise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.initialise),
      switchMap(() => [
        AppActions.getCalendars(),
        AppActions.createDefaultCalendarEvents(),
      ]),
    ),
  );

  getAllCalendars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCalendars),
      switchMap(() =>
        this.calendarDataService
          .getAll()
          .pipe(map((calendars) => AppActions.getCalendarsSuccess(calendars))),
      ),
      catchError((error) => {
        AppActions.updateStatusMessage(StatusMessage.NO_API_ACCESS);
        throw Error(error);
      }),
    ),
  );

  createCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createCalendar),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectSavedSystemEvents)),
      ),
      exhaustMap(([, systemEvents]) => {
        const dialogRef = this.dialog.open(CreateCalendarDialogComponent, {
          data: { systemEvents },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      tap((x) => console.log('system', x)),
      switchMap(
        (dialogRes: {
          name: string;
          includeBirthday: boolean;
          includeFestivals: boolean;
          includeCrops: boolean;
          systemEvents: CalendarEvent[];
        }) =>
          this.calendarDataService
            .create(
              dialogRes.name,
              dialogRes.includeBirthday,
              dialogRes.includeFestivals,
              dialogRes.includeCrops,
              dialogRes.systemEvents,
            )
            .pipe(
              map((calendar) => AppActions.createCalendarSuccess(calendar)),
            ),
      ),
    ),
  );

  getOrCreateSystemEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createDefaultCalendarEvents),
      switchMap(() =>
        this.gameEventDataService
          .getOrCreateDefaults()
          .pipe(
            map((calendar) =>
              AppActions.createDefaultCalendarEventsSuccess(calendar),
            ),
          ),
      ),
    ),
  );

  editCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateCalendar),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectAvailableCalendars)),
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ]),
      exhaustMap(([, availableCalendars, activeCalendar]) => {
        const dialogRef = this.dialog.open(EditCalendarDialogComponent, {
          data: { availableCalendars, activeCalendar },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { id: string }) =>
        this.calendarDataService
          .get(dialogRes.id)
          .pipe(map((calendar) => AppActions.loadCalendar(calendar.id))),
      ),
    ),
  );

  loadCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadCalendar),
      switchMap(({ id }) =>
        this.calendarDataService
          .get(id)
          .pipe(map((calendar) => AppActions.updateActiveCalendar(calendar))),
      ),
    ),
  );

  updateCalendarEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateEvent),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectSelectedYear)),
      ),
      exhaustMap(([{ calendarEvent }, activeYear]) => {
        const dialogRef = this.dialog.open(EditEventDialogComponent, {
          data: { calendarEvent, activeYear },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { calendarEvent: CalendarEvent }) =>
        this.gameEventDataService
          .update(dialogRes.calendarEvent)
          .pipe(map((calendar) => AppActions.updateEventSuccess(calendar))),
      ),
    ),
  );

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteEvent),
      exhaustMap((action) => {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: { id: action.id, name: action.name, object: 'event' },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { id: string }) =>
        this.gameEventDataService
          .delete(dialogRes.id)
          .pipe(map((id) => AppActions.deleteEventSuccess(id))),
      ),
    ),
  );

  deleteCalendarEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteDeletedCalendarEvents),
      switchMap(({ id, eventIds }) =>
        this.gameEventDataService.deleteMany(eventIds).pipe(
          tap(() => console.log('hello?')),
          map(() => AppActions.deleteCalendarSuccess(id)),
        ),
      ),
    ),
  );

  deleteCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteCalendar),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ]),
      exhaustMap(([, activeCalendar]) => {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: {
            id: activeCalendar?.id,
            name: activeCalendar?.name,
            object: 'calendar',
            gameEvents: activeCalendar?.calendarEvents,
          },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { id: string; gameEvents: CalendarEvent[] }) =>
        this.calendarDataService.delete(dialogRes.id).pipe(
          map((id) => {
            const userEvents = dialogRes.gameEvents
              .filter((event) => event.type === Type.User)
              .map((event) => event.id);
            return AppActions.deleteDeletedCalendarEvents(id, userEvents);
          }),
        ),
      ),
    ),
  );

  createCalendarEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createEvent),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectSelectedDay)),
        this.store.pipe(select(AppFeature.selectSelectedSeason)),
        this.store.pipe(select(AppFeature.selectSelectedYear)),
      ]),
      exhaustMap(([, day, season, year]) => {
        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
          data: { day, season, year },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { calendarEvent: UnsavedCalendarEvent }) =>
        this.gameEventDataService
          .create(dialogRes.calendarEvent)
          .pipe(map((calendar) => AppActions.createEventSuccess(calendar))),
      ),
    ),
  );

  updateActiveYear$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.openUpdateActiveYearDialog),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectSelectedYear)),
      ),
      exhaustMap(([, activeYear]) => {
        const dialogRef = this.dialog.open(UpdateYearDialogComponent, {
          data: { activeYear },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      map((dialogRes: { activeYear: number }) =>
        AppActions.updateYear(dialogRes.activeYear),
      ),
    ),
  );

  updateCurrentCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createEventSuccess),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ),
      switchMap(([action, activeCalendar]) => {
        const existingEvents = activeCalendar?.calendarEvents
          ? [...activeCalendar.calendarEvents.map((event) => event.id)]
          : [];
        const updatedCalendar: Partial<Calendar_NoRelations> = {
          id: activeCalendar?.id,
          gameEvents: [...existingEvents, action.calendarEvent.id],
        };
        return this.calendarDataService
          .update(updatedCalendar)
          .pipe(map((calendar) => AppActions.addedEventToCalendar(calendar)));
      }),
    ),
  );
}
