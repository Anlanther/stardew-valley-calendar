import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DayFormComponent } from './day-form.component';

@NgModule({
  declarations: [DayFormComponent],
  exports: [DayFormComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    MatMenuModule,
    CdkAccordionModule,
    MatExpansionModule,
  ],
})
export class DayFormModule {}
