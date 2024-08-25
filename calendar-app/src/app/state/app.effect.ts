import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store, select } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, switchMap } from 'rxjs';
import { CreateCalendarDialogComponent } from '../components/dialogs/calendar/create-dialog/create-dialog.component';
import { EditCalendarDialogComponent } from '../components/dialogs/calendar/edit-dialog/edit-dialog.component';
import { SelectCalendarDialogComponent } from '../components/dialogs/calendar/select-dialog/select-dialog.component';
import { CreateEventDialogComponent } from '../components/dialogs/day-form/create-dialog/create-dialog.component';
import { EditEventDialogComponent } from '../components/dialogs/day-form/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../components/dialogs/delete/delete-dialog.component';
import { AppStore } from '../models/app-store.model';
import { Calendar } from '../models/calendar.model';
import { GameEvent, UnsavedGameEvent } from '../models/game-event.model';
import { Type } from '../models/type.model';
import { CalendarDataService } from '../services/calendar/calendar-data.service';
import { GameEventDataService } from '../services/game-event/game-event-data.service';
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
        AppActions.createDefaultGameEvents(),
      ]),
      catchError((error) => {
        AppActions.aPIFailed();
        throw Error(error);
      }),
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
    ),
  );

  createCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createCalendar),
      exhaustMap(() => {
        const dialogRef = this.dialog.open(CreateCalendarDialogComponent, {});
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap(
        (dialogRes: {
          name: string;
          includeBirthdays: boolean;
          includeFestivals: boolean;
          includeCrops: boolean;
          description: string;
        }) =>
          this.calendarDataService
            .create(
              dialogRes.name,
              dialogRes.description,
              dialogRes.includeBirthdays,
              dialogRes.includeFestivals,
              dialogRes.includeCrops,
            )
            .pipe(
              map((calendar) => AppActions.createCalendarSuccess(calendar)),
            ),
      ),
    ),
  );

  getOrCreateSystemEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createDefaultGameEvents),
      switchMap(() =>
        this.gameEventDataService
          .getOrCreateDefaults()
          .pipe(
            map((calendar) =>
              AppActions.createDefaultGameEventsSuccess(calendar),
            ),
          ),
      ),
    ),
  );

  selectCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.selectCalendar),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectAvailableCalendars)),
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ]),
      exhaustMap(([, availableCalendars, activeCalendar]) => {
        const dialogRef = this.dialog.open(SelectCalendarDialogComponent, {
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

  updateGameEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateEvent),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectSelectedDate)),
      ),
      exhaustMap(([{ gameEvent }, selectedDate]) => {
        const dialogRef = this.dialog.open(EditEventDialogComponent, {
          data: { gameEvent, activeYear: selectedDate.year },
          minHeight: '420px',
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { gameEvent: GameEvent }) =>
        this.gameEventDataService
          .update(dialogRes.gameEvent)
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

  deleteGameEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteDeletedGameEvents),
      switchMap(({ id, eventIds }) =>
        this.gameEventDataService
          .deleteMany(eventIds)
          .pipe(map(() => AppActions.deleteCalendarSuccess(id))),
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
            gameEvents: activeCalendar?.gameEvents,
          },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { id: string; gameEvents: GameEvent[] }) =>
        this.calendarDataService.delete(dialogRes.id).pipe(
          map((id) => {
            const userEvents = dialogRes.gameEvents
              .filter((event) => event.type === Type.User)
              .map((event) => event.id);
            return AppActions.deleteDeletedGameEvents(id, userEvents);
          }),
        ),
      ),
    ),
  );

  createGameEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createEvent),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectSelectedDate)),
      ),
      exhaustMap(([, date]) => {
        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
          data: { day: date.day, season: date.season, year: date.year },
          minHeight: '420px',
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { gameEvent: UnsavedGameEvent }) =>
        this.gameEventDataService
          .create(dialogRes.gameEvent)
          .pipe(map((calendar) => AppActions.createEventSuccess(calendar))),
      ),
    ),
  );

  updateActiveYear$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateCalendar),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectSelectedDate)),
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ]),
      exhaustMap(([, activeDate, activeCalendar]) => {
        const dialogRef = this.dialog.open(EditCalendarDialogComponent, {
          data: {
            activeCalendar,
            year: activeDate.year,
          },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRef: { calendar: Calendar; year: number }) => {
        return this.calendarDataService
          .updateDetails(dialogRef.calendar)
          .pipe(
            map((calendar) =>
              AppActions.updateCalendarSuccess(calendar, dialogRef.year),
            ),
          );
      }),
    ),
  );

  updateCurrentCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createEventSuccess),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ),
      switchMap(([action, activeCalendar]) => {
        const updatedCalendar: Partial<Calendar> = {
          id: activeCalendar?.id,
          gameEvents: [...(activeCalendar?.gameEvents ?? []), action.gameEvent],
        };
        return this.calendarDataService
          .updateEvents(updatedCalendar)
          .pipe(map((calendar) => AppActions.addedEventToCalendar(calendar)));
      }),
    ),
  );
}
