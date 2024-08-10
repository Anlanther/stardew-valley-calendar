import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppStore } from '../../models/app-store.model';
import { CalendarState } from '../../models/calendar-state.model';
import { AppActions } from '../../state/app.actions';
import { AppFeature } from '../../state/app.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  store = inject(Store<AppStore>);

  activeCalendar$: Observable<CalendarState>;
  disableDelete = signal<boolean>(false);

  constructor() {
    this.activeCalendar$ = this.store
      .select(AppFeature.selectActiveCalendar)
      .pipe(
        tap((calendar) => {
          return calendar
            ? this.disableDelete.set(false)
            : this.disableDelete.set(true);
        }),
      );
  }

  openCreateDialog() {
    this.store.dispatch(AppActions.createCalendar());
  }

  openEditDialog() {
    this.store.dispatch(AppActions.updateCalendar());
  }

  deleteCalendar() {
    this.store.dispatch(AppActions.deleteCalendar());
  }
}
