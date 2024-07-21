import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DayFormComponent } from './day-form.component';

@NgModule({
  declarations: [DayFormComponent],
  exports: [DayFormComponent],
  imports: [CommonModule, DialogModule, CdkAccordionModule],
})
export class DayFormModule {}
