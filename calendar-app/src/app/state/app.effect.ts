import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store, select } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, switchMap } from 'rxjs';
import { CreateCalendarDialogComponent } from '../components/dialogs/calendar/create-dialog/create-dialog.component';
import { EditCalendarDialogComponent } from '../components/dialogs/calendar/edit-dialog/edit-dialog.component';
import { SelectCalendarDialogComponent } from '../components/dialogs/calendar/select-dialog/select-dialog.component';
import { DeleteDialogComponent } from '../components/dialogs/delete/delete-dialog.component';
import { CreateEventDialogComponent } from '../components/dialogs/game-event/create-dialog/create-dialog.component';
import { EditEventDialogComponent } from '../components/dialogs/game-event/edit-dialog/edit-dialog.component';
import { TokenDialogComponent } from '../components/dialogs/token/token-dialog.component';
import { AppStore } from '../models/app-store.model';
import { Calendar } from '../models/calendar.model';
import { GameEvent, UnsavedGameEvent } from '../models/game-event.model';
import { Type } from '../models/type.model';
import { CalendarUtils } from '../services/calendar.utils';
import { CalendarDataService } from '../services/calendar/calendar-data.service';
import { DataService } from '../services/data.service';
import { GameEventDataService } from '../services/game-event/game-event-data.service';
import { OfflineDataService } from '../services/offline-data.service';
import { AppActions } from './app.actions';
import { AppFeature } from './app.state';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppStore>);
  private dialog = inject(MatDialog);
  private calendarDataService = inject(CalendarDataService);
  private gameEventDataService = inject(GameEventDataService);
  private dataService = inject(DataService);
  private offlineDataService = inject(OfflineDataService);

  initialise$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.initialise, AppActions.setOfflineMode),
      switchMap(() => [
        AppActions.getCalendars(),
        AppActions.createDefaultGameEvents(),
      ]),
    ),
  );

  getAllCalendars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCalendars),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ),
      switchMap(([, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.getAllCalendars()
          : this.calendarDataService.getAll()
        ).pipe(
          switchMap((calendars) => [
            AppActions.getCalendarsSuccess(calendars),
            AppActions.aPIFailed(false),
          ]),
          catchError(() => {
            return of(AppActions.aPIFailed(true));
          }),
        ),
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
          minHeight: 360,
        });
        return dialogRef.afterClosed();
      }),
      filter(
        (dialogRes: {
          name: string;
          includeBirthdays: boolean;
          includeFestivals: boolean;
          includeCrops: boolean;
          description: string;
        }) => !!dialogRes,
      ),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ),
      switchMap(([dialogRes, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.createCalendar(
              dialogRes.name,
              dialogRes.description,
              dialogRes.includeBirthdays,
              dialogRes.includeFestivals,
              dialogRes.includeCrops,
            )
          : this.calendarDataService.create(
              dialogRes.name,
              dialogRes.description,
              dialogRes.includeBirthdays,
              dialogRes.includeFestivals,
              dialogRes.includeCrops,
            )
        ).pipe(map((calendar) => AppActions.createCalendarSuccess(calendar))),
      ),
    ),
  );

  setToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.setToken),
      exhaustMap(() => {
        const dialogRef = this.dialog.open(TokenDialogComponent);
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      map((dialogRes: { token: string }) => {
        this.dataService.setToken(dialogRes.token);
        return AppActions.initialise();
      }),
    ),
  );

  getOrCreateSystemEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AppActions.createDefaultGameEvents,
        AppActions.updatedSystemEventsSuccess,
      ),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ),
      switchMap(([, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.getOrCreateEventDefaults()
          : this.gameEventDataService.getOrCreateDefaults()
        ).pipe(
          switchMap((gameEvents) => [
            AppActions.createDefaultGameEventsSuccess(gameEvents),
            AppActions.aPIFailed(false),
          ]),
          catchError(() => {
            return of(AppActions.aPIFailed(true));
          }),
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
      filter(
        (dialogRes: { id: string; availableCalendars: Calendar[] }) =>
          !!dialogRes,
      ),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([dialogRes, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.getCalendar(
              dialogRes.id,
              dialogRes.availableCalendars,
            )
          : this.calendarDataService.get(dialogRes.id)
        ).pipe(map((calendar) => AppActions.updateActiveCalendar(calendar))),
      ),
    ),
  );

  updateGameEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateEvent),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectSelectedDate)),
        this.store.pipe(select(AppFeature.selectActiveDayEvents)),
      ]),
      exhaustMap(([{ gameEvent }, selectedDate, existingEvents]) => {
        const dialogRef = this.dialog.open(EditEventDialogComponent, {
          data: {
            gameEvent,
            activeYear: selectedDate.year,
            existingEvents,
            object: 'event',
          },
          minHeight: 420,
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes: { gameEvent: GameEvent }) => !!dialogRes),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ]),
      switchMap(([dialogRes, offlineMode, activeCalendar]) =>
        (offlineMode
          ? this.offlineDataService.updateGameEvent(
              dialogRes.gameEvent,
              activeCalendar!,
            )
          : this.gameEventDataService.update(dialogRes.gameEvent)
        ).pipe(map((calendar) => AppActions.updateEventSuccess(calendar))),
      ),
    ),
  );

  updateGoal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateGoal),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectSelectedDate)),
        this.store.pipe(select(AppFeature.selectActiveSeasonGoals)),
      ]),
      exhaustMap(([{ gameEvent }, selectedDate, existingGoals]) => {
        const dialogRef = this.dialog.open(EditEventDialogComponent, {
          data: {
            gameEvent,
            activeYear: selectedDate.year,
            existingEvents: existingGoals,
            object: 'goal',
          },
          minHeight: 420,
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes: { gameEvent: GameEvent }) => !!dialogRes),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ]),
      switchMap(([dialogRes, offlineMode, activeCalendar]) =>
        (offlineMode
          ? this.offlineDataService.updateGameEvent(
              dialogRes.gameEvent,
              activeCalendar!,
            )
          : this.gameEventDataService.update(dialogRes.gameEvent)
        ).pipe(map((calendar) => AppActions.updateGoalSuccess(calendar))),
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
      filter((dialogRes: { id: string }) => !!dialogRes),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([dialogRes, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.deleteGameEvent(dialogRes.id)
          : this.gameEventDataService.delete(dialogRes.id)
        ).pipe(map((id) => AppActions.deleteEventSuccess(id))),
      ),
    ),
  );

  deleteGoal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteGoal),
      exhaustMap((action) => {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: { id: action.id, name: action.name, object: 'goal' },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes: { id: string }) => !!dialogRes),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([dialogRes, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.deleteGameEvent(dialogRes.id)
          : this.gameEventDataService.delete(dialogRes.id)
        ).pipe(map((id) => AppActions.deleteGoalSuccess(id))),
      ),
    ),
  );

  deleteCalendarGameEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteCalendarGameEvents),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([{ calendarId, eventIds }, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.deleteManyGameEvents(eventIds)
          : this.gameEventDataService.deleteMany(eventIds)
        ).pipe(map(() => AppActions.deleteCalendarSuccess(calendarId))),
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
      filter(
        (dialogRes: { id: string; gameEvents: GameEvent[] }) => !!dialogRes,
      ),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([dialogRes, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.deleteCalendar(dialogRes.id)
          : this.calendarDataService.delete(dialogRes.id)
        ).pipe(
          map((id) => {
            const userEvents = dialogRes.gameEvents
              .filter((event) => event.type === Type.User)
              .map((event) => event.id);
            return AppActions.deleteCalendarGameEvents(id, userEvents);
          }),
        ),
      ),
    ),
  );

  createGameEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createEvent),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectSelectedDate)),
        this.store.pipe(select(AppFeature.selectActiveDayEvents)),
      ]),
      exhaustMap(([, date, existingEvents]) => {
        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
          data: {
            day: date.day,
            season: date.season,
            year: date.year,
            existingEvents,
            object: 'event',
          },
          minHeight: 420,
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes: { gameEvent: UnsavedGameEvent }) => !!dialogRes),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ),
      switchMap(([dialogRes, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.createGameEvent(dialogRes.gameEvent)
          : this.gameEventDataService.create(dialogRes.gameEvent)
        ).pipe(map((calendar) => AppActions.createEventSuccess(calendar))),
      ),
    ),
  );

  createSeasonGoal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createGoal),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectSelectedDate)),
        this.store.pipe(select(AppFeature.selectActiveSeasonGoals)),
      ]),
      exhaustMap(([, date, existingGoals]) => {
        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
          data: {
            day: 0,
            season: date.season,
            year: date.year,
            existingEvents: existingGoals,
            object: 'goal',
          },
          minHeight: 420,
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes: { gameEvent: UnsavedGameEvent }) => !!dialogRes),
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ),
      switchMap(([dialogRes, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.createGameEvent(dialogRes.gameEvent)
          : this.gameEventDataService.create(dialogRes.gameEvent)
        ).pipe(map((calendar) => AppActions.createGoalSuccess(calendar))),
      ),
    ),
  );

  addGoalToCurrentCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createGoalSuccess),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([action, activeCalendar, offlineMode]) => {
        const updatedCalendar: Partial<Calendar> = {
          id: activeCalendar?.id,
          gameEvents: [...(activeCalendar?.gameEvents ?? []), action.gameEvent],
        };
        return (
          offlineMode
            ? this.offlineDataService.updateCalendarEvents(
                updatedCalendar,
                activeCalendar!,
              )
            : this.calendarDataService.updateEvents(updatedCalendar)
        ).pipe(
          map((calendar) =>
            AppActions.addedGoalToCalendar(calendar, action.gameEvent),
          ),
        );
      }),
    ),
  );

  updateCalendarDetails$ = createEffect(() =>
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
      filter(
        (dialogRes: {
          calendar: Calendar;
          fullActiveCalendar: Calendar;
          year: number;
        }) => !!dialogRes,
      ),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([dialogRef, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.updateCalendarDetails(
              dialogRef.calendar,
              dialogRef.fullActiveCalendar,
            )
          : this.calendarDataService.updateDetails(dialogRef.calendar)
        ).pipe(
          map((calendar) =>
            AppActions.updateCalendarSuccess(calendar, dialogRef.year),
          ),
        ),
      ),
    ),
  );

  addEventToCurrentCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createEventSuccess),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([action, activeCalendar, offlineMode]) => {
        const updatedCalendar: Partial<Calendar> = {
          id: activeCalendar?.id,
          gameEvents: [...(activeCalendar?.gameEvents ?? []), action.gameEvent],
        };
        return (
          offlineMode
            ? this.offlineDataService.updateCalendarEvents(
                updatedCalendar,
                activeCalendar!,
              )
            : this.calendarDataService.updateEvents(updatedCalendar)
        ).pipe(
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
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectAvailableCalendars)),
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([{ downloadedCalendar }, availableCalendars, offlineMode]) => {
        const calendarName = CalendarUtils.getLoadedCalendarName(
          downloadedCalendar.name,
          availableCalendars,
        );
        return (
          offlineMode
            ? this.offlineDataService.createCalendar(
                calendarName,
                downloadedCalendar.description,
                downloadedCalendar.systemConfig.includeBirthdays,
                downloadedCalendar.systemConfig.includeFestivals,
                downloadedCalendar.systemConfig.includeCrops,
              )
            : this.calendarDataService.create(
                calendarName,
                downloadedCalendar.description,
                downloadedCalendar.systemConfig.includeBirthdays,
                downloadedCalendar.systemConfig.includeFestivals,
                downloadedCalendar.systemConfig.includeCrops,
              )
        ).pipe(
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
      concatLatestFrom(() =>
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ),
      switchMap(([action, offlineMode]) =>
        (offlineMode
          ? this.offlineDataService.createMultipleGameEvents(
              action.gameEventsToAdd,
            )
          : this.gameEventDataService.createMultiple(action.gameEventsToAdd)
        ).pipe(
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

  addGameEventsToUploadedCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createUploadedCalendarEventsSuccess),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectOfflineMode)),
      ]),
      switchMap(([action, offlineMode]) => {
        const updatedCalendar: Partial<Calendar> = {
          id: action.calendar.id,
          gameEvents: [
            ...action.calendar.gameEvents,
            ...action.gameEventsToAdd,
          ],
        };
        return (
          offlineMode
            ? this.offlineDataService.updateCalendarEvents(
                updatedCalendar,
                action.calendar,
              )
            : this.calendarDataService.updateEvents(updatedCalendar)
        ).pipe(map((calendar) => AppActions.createCalendarSuccess(calendar)));
      }),
    ),
  );

  updateSystemEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateSystemEvents),
      switchMap(() => {
        return this.gameEventDataService
          .updateSystem()
          .pipe(map(() => AppActions.updatedSystemEventsSuccess()));
      }),
    ),
  );
}
