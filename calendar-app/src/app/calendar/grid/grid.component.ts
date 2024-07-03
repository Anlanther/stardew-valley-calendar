import { Component, Input, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { AppStore } from '../../models/app-store.model';
import { Calendar } from '../../models/calendar.model';
import { Season } from '../../models/season.model';
import { AppFeature } from '../../state/app.state';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  @Input() activeCalendar!: Calendar;
  @Input() season!: Season;

  store = inject(Store<AppStore>);

  get firstWeek() {
    return this.getDaysOfWeek(0);
  }
  get secondWeek() {
    return this.getDaysOfWeek(1);
  }
  get thirdWeek() {
    return this.getDaysOfWeek(2);
  }
  get forthWeek() {
    return this.getDaysOfWeek(3);
  }

  activeYear = signal<number>(1);

  constructor() {
    this.store
      .select(AppFeature.selectSelectedYear)
      .pipe(tap((year) => this.activeYear.set(year)));
  }

  getDaysOfWeek(week: number) {
    const dayAdjuster = week * 7;
    const weekDays = [1, 2, 3, 4, 5, 6, 7];
    const daysOfWeek = weekDays.map((day) => day + dayAdjuster);
    return daysOfWeek;
  }
}
