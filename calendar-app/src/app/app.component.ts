import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppStore } from './models/app-store.model';
import { StatusMessage } from './models/status-message.model';
import { AppActions } from './state/app.actions';
import { AppFeature } from './state/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  store = inject(Store<AppStore>);

  status$: Observable<StatusMessage>;

  get noApi() {
    return StatusMessage.NO_API_ACCESS;
  }
  get ready() {
    return StatusMessage.READY;
  }
  get noCalendars() {
    return StatusMessage.NO_CALENDARS_AVAILABLE;
  }
  get noSelectedCalendar() {
    return StatusMessage.NO_SELECTED_CALENDAR;
  }

  constructor() {
    this.store.dispatch(AppActions.getCalendars());
    this.status$ = this.store.select(AppFeature.selectStatusMessage);
  }

  openCreateDialog() {
    this.store.dispatch(AppActions.createCalendar());
  }

  openEditDialog() {
    this.store.dispatch(AppActions.updateCalendar());
  }
}
