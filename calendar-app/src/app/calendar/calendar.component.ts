import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppStore } from '../models/app-store.model';
import { CalendarState } from '../models/calendar-state.model';
import { Season } from '../models/season.model';
import { AppActions } from '../state/app.actions';
import { AppFeature } from '../state/app.state';
import { GridComponent } from './grid/grid.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    GridComponent,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
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

  yearFormControl = new FormControl(1, [
    Validators.required,
    Validators.min(1),
  ]);

  store = inject(Store<AppStore>);
  subs = new Subscription();

  activeCalendar$: Observable<CalendarState>;
  selectedYear$: Observable<number>;

  constructor() {
    this.activeCalendar$ = this.store.pipe(
      select(AppFeature.selectActiveCalendar),
    );
    this.selectedYear$ = this.store.pipe(select(AppFeature.selectSelectedYear));
  }

  updateYear() {
    const year = this.yearFormControl.value!;
    this.store.dispatch(AppActions.updateYear(year));
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
