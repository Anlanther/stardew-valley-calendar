import { Component, inject, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppStore } from '../../../models/app-store.model';
import { AppFeature } from '../../../state/app.state';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnDestroy {
  store = inject(Store<AppStore>);

  get firstWeek() {
    return this.getDaysOfWeek(0);
  }
  get secondWeek() {
    return this.getDaysOfWeek(1);
  }
  get thirdWeek() {
    return this.getDaysOfWeek(2);
  }
  get forthWeek() {
    return this.getDaysOfWeek(3);
  }

  isSelectedObj: { navBarOpen: boolean; day: number } = {
    navBarOpen: false,
    day: 0,
  };

  subs = new Subscription();

  constructor() {
    this.subs.add(
      this.store
        .pipe(select(AppFeature.selectIsDateSelected))
        .subscribe((state) => (this.isSelectedObj = state)),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getDaysOfWeek(week: number) {
    const dayAdjuster = week * 7;
    const weekDays = [1, 2, 3, 4, 5, 6, 7];
    const daysOfWeek = weekDays.map((day) => day + dayAdjuster);
    return daysOfWeek;
  }

  isSelected(day: number) {
    const isSelected =
      this.isSelectedObj.navBarOpen && this.isSelectedObj.day === day;
    return isSelected;
  }
}
