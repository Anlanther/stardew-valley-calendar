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
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppStore } from '../models/app-store.model';
import { CalendarState } from '../models/calendar-state.model';
import { Season } from '../models/season.model';
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

  yearFormControl = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);

  store = inject(Store<AppStore>);

  calendar$: Observable<CalendarState>;

  constructor() {
    this.calendar$ = this.store.select(AppFeature.selectActiveCalendar);
  }
}
