import { Component, inject, Renderer2, signal, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable, skip, Subscription } from 'rxjs';
import { AppStore } from '../../models/app-store.model';
import { DownloadedCalendar } from '../../models/downloaded-calendar.model';
import { AppActions } from '../../state/app.actions';
import { AppFeature } from '../../state/app.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  store = inject(Store<AppStore>);
  renderer = inject(Renderer2);

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

  openSelectDialog() {
    this.store.dispatch(AppActions.selectCalendar());
  }

  deleteCalendar() {
    this.store.dispatch(AppActions.deleteCalendar());
  }

  toggleSideNav(isOpen: boolean) {
    isOpen ? this.sideNav.open() : this.sideNav.close();
  }

  openEditCalendarDialog() {
    this.store.dispatch(AppActions.updateCalendar());
  }

  downloadCalendar() {
    this.store
      .select(AppFeature.selectActiveCalendar)
      .subscribe((activeCalendar) => {
        if (activeCalendar) {
          const {
            name,
            description,
            gameEvents,
            systemConfig,
          }: DownloadedCalendar = activeCalendar;
          const json = JSON.stringify({
            name,
            description,
            gameEvents,
            systemConfig,
          });
          const blob = new Blob([json], { type: 'text/json' });
          const url = window.URL.createObjectURL(blob);
          const link = this.renderer.createElement('a');

          link.setAttribute('target', '_blank');
          link.setAttribute('href', url);
          link.setAttribute('download', `${activeCalendar.name}.json`);
          link.click();

          window.URL.revokeObjectURL(url);
          link.remove();
        }
      })
      .unsubscribe();
  }
}
