import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CalendarModule } from '../components/calendar/calendar.module';
import { DrawerModule } from '../components/drawers/drawer.module';
import { MainComponent } from './main/main.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [MainComponent, WelcomeComponent],
  imports: [
    CommonModule,
    CalendarModule,
    DrawerModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [MainComponent, WelcomeComponent],
})
export class ViewsModule {}
