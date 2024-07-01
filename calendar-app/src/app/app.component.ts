import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { CalendarComponent } from './calendar/calendar.component';
import { AppStore } from './models/app-store.model';
import { CalendarState } from './models/calendar-state.model';
import { AppFeature } from './state/app.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  store = inject(Store<AppStore>);

  calendar$: Observable<CalendarState>;

  disableDelete = signal<boolean>(false);

  constructor() {
    this.calendar$ = this.store.select(AppFeature.selectActiveCalendar).pipe(
      tap((calendar) => {
        return calendar
          ? this.disableDelete.set(false)
          : this.disableDelete.set(true);
      })
    );
  }
}
