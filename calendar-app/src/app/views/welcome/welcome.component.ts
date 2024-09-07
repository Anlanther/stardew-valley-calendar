import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from '../../models/app-store.model';
import { AppActions } from '../../state/app.actions';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  store = inject(Store<AppStore>);

  updateSystemEvents() {
    this.store.dispatch(AppActions.updateSystemEvents());
  }
}
