import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CalendarComponent } from './calendar.component';
import { EventComponent } from './event/event.component';
import { GridComponent } from './grid/grid.component';

@NgModule({
  declarations: [EventComponent, GridComponent, CalendarComponent],
  imports: [
    CommonModule,
    DialogModule,
    MatListModule,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [CalendarComponent],
})
export class CalendarModule {}
