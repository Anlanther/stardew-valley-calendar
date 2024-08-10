import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DayFormComponent } from './day-form.component';

@NgModule({
  declarations: [DayFormComponent],
  exports: [DayFormComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    CdkAccordionModule,
  ],
})
export class DayFormModule {}
