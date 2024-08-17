import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CalendarModule } from '../components/calendar/calendar.module';
import { DayFormModule } from '../components/day-form/day-form.module';
import { MainComponent } from './main/main.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [MainComponent, WelcomeComponent],
  imports: [
    CommonModule,
    CalendarModule,
    DayFormModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [MainComponent, WelcomeComponent],
})
export class ViewsModule {}
