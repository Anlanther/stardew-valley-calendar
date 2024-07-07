import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppStore } from '../models/app-store.model';
import { CalendarState } from '../models/calendar-state.model';
import { EventState } from '../models/event-state.model';
import { AppFeature } from '../state/app.state';

@Component({
  selector: 'app-day-form',
  standalone: true,
  imports: [CommonModule, CdkAccordionModule],
  templateUrl: './day-form.component.html',
  styleUrl: './day-form.component.scss',
})
export class DayFormComponent {
  store = inject(Store<AppStore>);

  activeCalendar$: Observable<CalendarState>;
  activeEvents$: Observable<EventState>;
  selectedDate$: Observable<string>;

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  constructor() {
    this.activeCalendar$ = this.store.select(AppFeature.selectActiveCalendar);
    this.activeEvents$ = this.store.select(
      AppFeature.selectActiveCalendarEvents,
    );
    this.selectedDate$ = this.store.select(AppFeature.selectSelectedDate);
  }

  openCreateDialog() {}
}
