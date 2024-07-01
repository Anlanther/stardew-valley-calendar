import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppStore } from '../models/app-store.model';
import { AppActions } from './app.actions';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppStore>);

  createCalendar$ = createEffect(() =>
    this.actions$.pipe(ofType(AppActions.createCalendar))
  );
}
