import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store, select } from '@ngrx/store';
import { exhaustMap, filter, map, switchMap } from 'rxjs';
import { CreateDialogComponent } from '../calendar/create-dialog/create-dialog.component';
import { EditDialogComponent } from '../calendar/edit-dialog/edit-dialog.component';
import { AppStore } from '../models/app-store.model';
import { CalendarDataService } from '../services/calendar/calendar-data.service';
import { AppActions } from './app.actions';
import { AppFeature } from './app.state';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppStore>);
  private dialog = inject(MatDialog);
  private calendarDataService = inject(CalendarDataService);

  getAllCalendars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.getCalendars, AppActions.createCalendar),
      switchMap(() =>
        this.calendarDataService
          .getAll()
          .pipe(map((calendars) => AppActions.getCalendarsSuccess(calendars)))
      )
    )
  );

  createCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createCalendar),
      exhaustMap(() => {
        const dialogRef = this.dialog.open(CreateDialogComponent);
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { name: string }) =>
        this.calendarDataService
          .create(dialogRes.name)
          .pipe(map((calendar) => AppActions.createCalendarSuccess(calendar)))
      )
    )
  );

  editCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.editCalendar),
      concatLatestFrom(() => [
        this.store.pipe(select(AppFeature.selectAvailableCalendars)),
        this.store.pipe(select(AppFeature.selectActiveCalendar)),
      ]),
      exhaustMap(([, availableCalendars, activeCalendar]) => {
        const dialogRef = this.dialog.open(EditDialogComponent, {
          data: { availableCalendars, activeCalendar },
        });
        return dialogRef.afterClosed();
      }),
      filter((dialogRes) => !!dialogRes),
      switchMap((dialogRes: { id: string }) =>
        this.calendarDataService
          .get(dialogRes.id)
          .pipe(map((calendar) => AppActions.loadCalendar(calendar.id)))
      )
    )
  );

  loadCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadCalendar),
      switchMap(({ id }) =>
        this.calendarDataService
          .get(id)
          .pipe(map((calendar) => AppActions.updateActiveCalendar(calendar)))
      )
    )
  );
}
