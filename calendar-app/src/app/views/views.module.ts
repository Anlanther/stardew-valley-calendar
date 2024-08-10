import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CalendarModule } from '../components/calendar/calendar.module';
import { DayFormModule } from '../components/day-form/day-form.module';
import { MainComponent } from './main/main.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [MainComponent, WelcomeComponent],
  imports: [CommonModule, CalendarModule, DayFormModule, MatSidenavModule],
  exports: [MainComponent, WelcomeComponent],
})
export class ViewsModule {}
