import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppStore } from '../../models/app-store.model';
import { AppActions } from '../../state/app.actions';
import { AppFeature } from '../../state/app.state';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  store = inject(Store<AppStore>);
  offlineMode$: Observable<boolean>;

  constructor() {
    this.offlineMode$ = this.store.select(AppFeature.selectOfflineMode);
  }

  updateSystemEvents() {
    this.store.dispatch(AppActions.updateSystemEvents());
  }

  setToken() {
    this.store.dispatch(AppActions.setToken());
  }
}
