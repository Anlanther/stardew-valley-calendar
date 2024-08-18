import { Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { TAG_METADATA } from '../../constants/tag-metadata.constant';
import { AppStore } from '../../models/app-store.model';
import { CalendarState } from '../../models/calendar-state.model';
import { EventState } from '../../models/event-state.model';
import { GameEvent } from '../../models/game-event.model';
import { Tag } from '../../models/tag.model';
import { OrdinalSuffixPipe } from '../../pipes/ordinal-suffix.pipe';
import { AppActions } from '../../state/app.actions';
import { AppFeature } from '../../state/app.state';

@Component({
  selector: 'app-day-form',
  templateUrl: './day-form.component.html',
  styleUrl: './day-form.component.scss',
})
export class DayFormComponent {
  store = inject(Store<AppStore>);
  ordinalSuffix = inject(OrdinalSuffixPipe);

  activeCalendar$: Observable<CalendarState>;
  activeEvents$: Observable<EventState>;
  selectedDate$: Observable<string>;

  constructor() {
    this.activeCalendar$ = this.store.pipe(
      select(AppFeature.selectActiveCalendar),
    );
    this.activeEvents$ = this.store.pipe(
      select(AppFeature.selectActiveFormEvents),
    );
    this.selectedDate$ = this.store.pipe(
      select(AppFeature.selectSelectedDate),
      map((date) => this.ordinalSuffix.transform(date)),
    );
  }

  getEventIcon(gameEventTag: Tag) {
    const url = TAG_METADATA.get(gameEventTag)!.url;
    return url;
  }

  openEditDialog(event: GameEvent) {
    this.store.dispatch(AppActions.updateEvent(event));
  }

  openDeleteDialog(id: string, name: string) {
    this.store.dispatch(AppActions.deleteEvent(id, name));
  }

  openCreateDialog() {
    this.store.dispatch(AppActions.createEvent());
  }

  closeSideNav() {
    this.store.dispatch(AppActions.toggleNavBar(false));
  }
}
