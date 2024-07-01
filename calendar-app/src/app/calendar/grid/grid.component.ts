import { Component } from '@angular/core';
import { EventComponent } from '../event/event.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [EventComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
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

  getDaysOfWeek(week: number) {
    const dayAdjuster = week * 7;
    const weekDays = [1, 2, 3, 4, 5, 6, 7];
    const daysOfWeek = weekDays.map((day) => day + dayAdjuster);
    return daysOfWeek;
  }
}
