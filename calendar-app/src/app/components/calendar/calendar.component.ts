import { Component, inject } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { select, Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { AppStore } from '../../models/app-store.model';
import { CalendarState } from '../../models/calendar-state.model';
import { Season } from '../../models/season.model';
import { AppActions } from '../../state/app.actions';
import { AppFeature } from '../../state/app.state';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  get fall() {
    return Season.FALL;
  }
  get spring() {
    return Season.SPRING;
  }
  get summer() {
    return Season.SUMMER;
  }
  get winter() {
    return Season.WINTER;
  }

  store = inject(Store<AppStore>);
  subs = new Subscription();

  activeCalendar$: Observable<CalendarState>;
  selectedYear$: Observable<number>;

  constructor() {
    this.activeCalendar$ = this.store.pipe(
      select(AppFeature.selectActiveCalendar),
    );
    this.selectedYear$ = this.store.pipe(
      select(AppFeature.selectSelectedDate),
      map((date) => date.year),
    );
  }

  onTabChange(event: MatTabChangeEvent) {
    const season = this.getIndexedSeason(event.index);
    this.store.dispatch(AppActions.updateSeason(season));
  }

  getIndexedSeason(index: number) {
    switch (index) {
      case 0:
        return this.spring;
      case 1:
        return this.summer;
      case 2:
        return this.fall;
      case 3:
        return this.winter;
      default:
        throw new Error('Not valid index');
    }
  }
}
