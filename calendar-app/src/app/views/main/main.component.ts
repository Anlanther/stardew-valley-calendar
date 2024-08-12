import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable, skip, Subscription } from 'rxjs';
import { AppStore } from '../../models/app-store.model';
import { AppActions } from '../../state/app.actions';
import { AppFeature } from '../../state/app.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  store = inject(Store<AppStore>);

  navTitle$: Observable<string>;
  disableDelete = signal<boolean>(false);
  subs = new Subscription();

  @ViewChild('drawer') sideNav!: MatSidenav;

  constructor() {
    this.navTitle$ = this.store.select(AppFeature.selectNavTitle);
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

  openUpdateYearDialog() {
    this.store.dispatch(AppActions.openUpdateActiveYearDialog());
  }
}
