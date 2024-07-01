import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, filter, map, switchMap } from 'rxjs';
import { CreateDialogComponent } from '../calendar/create-dialog/create-dialog.component';
import { AppStore } from '../models/app-store.model';
import { CalendarDataService } from '../services/calendar/calendar-data.service';
import { AppActions } from './app.actions';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppStore>);
  private dialog = inject(MatDialog);
  private calendarDataService = inject(CalendarDataService);

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
}
