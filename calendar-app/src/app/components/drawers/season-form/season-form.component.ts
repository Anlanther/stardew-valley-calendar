import { Component, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { TAG_METADATA } from '../../../constants/tag-metadata.constant';
import { Tag } from '../../../constants/tag.constant';
import { AppStore } from '../../../models/app-store.model';
import { CalendarState } from '../../../models/calendar-state.model';
import { EventState } from '../../../models/event-state.model';
import { GameEvent } from '../../../models/game-event.model';
import { Season } from '../../../models/season.model';
import { AppActions } from '../../../state/app.actions';
import { AppFeature } from '../../../state/app.state';

@Component({
  selector: 'app-season-form',
  templateUrl: './season-form.component.html',
  styleUrl: './season-form.component.scss',
})
export class SeasonFormComponent {
  store = inject(Store<AppStore>);

  activeCalendar$: Observable<CalendarState>;
  activeSeasonGoals$: Observable<EventState>;
  activeDate$: Observable<{ season: Season }>;

  constructor() {
    this.activeCalendar$ = this.store.pipe(
      select(AppFeature.selectActiveCalendar),
    );
    this.activeSeasonGoals$ = this.store.pipe(
      select(AppFeature.selectActiveSeasonGoals),
    );
    this.activeDate$ = this.store.pipe(
      select(AppFeature.selectSelectedDate),
      map((date) => ({ season: date.season })),
    );
  }

  getEventIcon(gameEventTag: Tag) {
    const url = TAG_METADATA.get(gameEventTag)!.url;
    return url;
  }

  openEditDialog(event: GameEvent) {
    this.store.dispatch(AppActions.updateGoal(event));
  }

  openDeleteDialog(id: string, name: string) {
    this.store.dispatch(AppActions.deleteGoal(id, name));
  }

  openCreateDialog() {
    this.store.dispatch(AppActions.createGoal());
  }

  closeSideNav() {
    this.store.dispatch(AppActions.toggleSeasonNav(false));
  }
}
