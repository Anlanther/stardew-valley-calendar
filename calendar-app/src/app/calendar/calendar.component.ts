import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Season } from '../models/season.model';
import { GridComponent } from './grid/grid.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [GridComponent, MatTabsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  get fall() {
    return Season.FALL;
  }
  get spring() {
    return Season.SPRING;
  }
  get summer() {
    return Season.SUMMER;
  }
  get winter() {
    return Season.WINTER;
  }
}
