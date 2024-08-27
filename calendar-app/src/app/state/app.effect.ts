import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store, select } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, switchMap } from 'rxjs';
import { CreateCalendarDialogComponent } from '../components/dialogs/calendar/create-dialog/create-dialog.component';
import { EditCalendarDialogComponent } from '../components/dialogs/calendar/edit-dialog/edit-dialog.component';
import { SelectCalendarDialogComponent } from '../components/dialogs/calendar/select-dialog/select-dialog.component';
import { DeleteDialogComponent } from '../components/dialogs/delete/delete-dialog.component';
import { CreateEventDialogComponent } from '../components/dialogs/game-event/create-dialog/create-dialog.component';
import { EditEventDialogComponent } from '../components/dialogs/game-event/edit-dialog/edit-dialog.component';
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
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectAvailableCalendars)),
      ),
      exhaustMap(([, existingCalendars]) => {
        const dialogRef = this.dialog.open(CreateCalendarDialogComponent, {
          data: {
            existingCalendars: existingCalendars.map(
              (calendar) => calendar.name,
            ),
          },
        });
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
      exhaustMap(([{ gameEvent, existingEvents }, selectedDate]) => {
        const dialogRef = this.dialog.open(EditEventDialogComponent, {
          data: { gameEvent, activeYear: selectedDate.year, existingEvents },
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
      exhaustMap(([{ existingEvents }, date]) => {
        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
          data: {
            day: date.day,
            season: date.season,
            year: date.year,
            existingEvents,
          },
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
        this.store.pipe(select(AppFeature.selectAvailableCalendars)),
      ]),
      exhaustMap(([, activeDate, activeCalendar, existingCalendars]) => {
        const dialogRef = this.dialog.open(EditCalendarDialogComponent, {
          data: {
            activeCalendar,
            year: activeDate.year,
            existingCalendars: existingCalendars.map(
              (calendar) => calendar.name,
            ),
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
          .pipe(
            map((calendar) =>
              AppActions.addedEventToCalendar(calendar, action.gameEvent),
            ),
          );
      }),
    ),
  );

  createUploadedCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createUploadedCalendar),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectAvailableCalendars)),
      ),
      switchMap(([{ downloadedCalendar }, availableCalendars]) => {
        let calendarName = downloadedCalendar.name;
        const duplicates = availableCalendars.filter((calendar) => {
          const test = new RegExp(downloadedCalendar.name, 'g').test(
            calendar.name,
          );
          return test;
        });
        if (duplicates.length === 0) {
          const newName = `${downloadedCalendar.name}[1]`;
          calendarName = newName;
        } else if (duplicates.length > 0) {
          const nonOriginalDuplicates = duplicates.filter((d) =>
            /\d/.test(d.name),
          );
          const duplicateIndicator = /\[(\d+)\]/;
          const duplicateNumbers = nonOriginalDuplicates
            .map((d) => +d.name.match(duplicateIndicator)![1])
            .sort((a, b) => b - a);
          const newName = `${downloadedCalendar.name}[${duplicateNumbers[0] + 1}]`;
          calendarName = newName;
        }
        return this.calendarDataService
          .create(
            calendarName,
            downloadedCalendar.description,
            downloadedCalendar.systemConfig.includeBirthdays,
            downloadedCalendar.systemConfig.includeFestivals,
            downloadedCalendar.systemConfig.includeCrops,
          )
          .pipe(
            map((calendar) =>
              AppActions.createUploadedCalendarBaseSuccess(
                calendar,
                downloadedCalendar.gameEvents,
              ),
            ),
          );
      }),
    ),
  );

  createEventsForUploadedCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createUploadedCalendarBaseSuccess),
      switchMap((action) =>
        this.gameEventDataService
          .createMultiple(action.gameEventsToAdd)
          .pipe(
            map((gameEvents) =>
              AppActions.createUploadedCalendarEventsSuccess(
                action.calendar,
                gameEvents,
              ),
            ),
          ),
      ),
    ),
  );

  addGameEventsToUploadedCalendar = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createUploadedCalendarEventsSuccess),
      switchMap((action) => {
        const updatedCalendar: Partial<Calendar> = {
          id: action.calendar.id,
          gameEvents: [
            ...action.calendar.gameEvents,
            ...action.gameEventsToAdd,
          ],
        };
        return this.calendarDataService
          .updateEvents(updatedCalendar)
          .pipe(map((calendar) => AppActions.createCalendarSuccess(calendar)));
      }),
    ),
  );
}
