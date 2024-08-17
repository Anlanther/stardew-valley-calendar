import { Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ICON_METADATA } from '../../constants/icon-metadata.constant';
import { AppStore } from '../../models/app-store.model';
import { CalendarState } from '../../models/calendar-state.model';
import { EventState } from '../../models/event-state.model';
import { GameEvent } from '../../models/game-event.model';
import { Tag } from '../../models/tag.model';
import { AppActions } from '../../state/app.actions';
import { AppFeature } from '../../state/app.state';

@Component({
  selector: 'app-day-form',
  templateUrl: './day-form.component.html',
  styleUrl: './day-form.component.scss',
})
export class DayFormComponent {
  store = inject(Store<AppStore>);

  activeCalendar$: Observable<CalendarState>;
  activeEvents$: Observable<EventState>;
  selectedDate$: Observable<string>;

  expandedIndex = 0;

  constructor() {
    this.activeCalendar$ = this.store.pipe(
      select(AppFeature.selectActiveCalendar),
    );
    this.activeEvents$ = this.store.pipe(
      select(AppFeature.selectActiveFormEvents),
    );
    this.selectedDate$ = this.store.pipe(select(AppFeature.selectSelectedDate));
  }

  getEventIcon(gameEventTag: Tag) {
    const url = ICON_METADATA.get(gameEventTag)!.url;
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
