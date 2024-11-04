import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { OrdinalSuffixPipe } from '../../pipes/ordinal-suffix.pipe';
import { DayFormComponent } from './day-form/day-form.component';
import { SeasonFormComponent } from './season-form/season-form.component';

@NgModule({
  declarations: [DayFormComponent, SeasonFormComponent],
  exports: [DayFormComponent, SeasonFormComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    MatMenuModule,
    CdkAccordionModule,
    MatExpansionModule,
  ],
  providers: [OrdinalSuffixPipe],
})
export class DrawerModule {}
