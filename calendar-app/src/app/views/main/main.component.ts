import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable, skip, Subscription, tap } from 'rxjs';
import { AppStore } from '../../models/app-store.model';
import { CalendarState } from '../../models/calendar-state.model';
import { AppActions } from '../../state/app.actions';
import { AppFeature } from '../../state/app.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  store = inject(Store<AppStore>);

  activeCalendar$: Observable<CalendarState>;
  disableDelete = signal<boolean>(false);
  subs = new Subscription();

  @ViewChild('drawer') sideNav!: MatSidenav;

  constructor() {
    this.activeCalendar$ = this.store
      .select(AppFeature.selectActiveCalendar)
      .pipe(
        tap((calendar) => {
          return calendar
            ? this.disableDelete.set(false)
            : this.disableDelete.set(true);
        }),
      );
    this.subs.add(
      this.store
        .select(AppFeature.selectNavBarOpen)
        .pipe(skip(1))
        .subscribe((isOpen) => this.toggleSideNav(isOpen)),
    );
  }

  openCreateDialog() {
    this.store.dispatch(AppActions.createCalendar());
  }

  openEditDialog() {
    this.store.dispatch(AppActions.updateCalendar());
  }

  deleteCalendar() {
    this.store.dispatch(AppActions.deleteCalendar());
  }

  toggleSideNav(isOpen: boolean) {
    isOpen ? this.sideNav.open() : this.sideNav.close();
  }
}
