import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateCalendarDialogComponent } from './calendar/create-dialog/create-dialog.component';
import { EditCalendarDialogComponent } from './calendar/edit-dialog/edit-dialog.component';
import { CreateEventDialogComponent } from './day-form/create-dialog/create-dialog.component';
import { EditEventDialogComponent } from './day-form/edit-dialog/edit-dialog.component';
import { UpdateYearDialogComponent } from './day-form/update-year-dialog/update-year-dialog.component';
import { DeleteDialogComponent } from './delete/delete-dialog.component';

@NgModule({
  declarations: [
    CreateCalendarDialogComponent,
    EditCalendarDialogComponent,
    EditEventDialogComponent,
    CreateEventDialogComponent,
    DeleteDialogComponent,
    UpdateYearDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatButtonModule,
  ],
  exports: [
    CreateCalendarDialogComponent,
    EditCalendarDialogComponent,
    EditEventDialogComponent,
    CreateEventDialogComponent,
  ],
})
export class DialogsModule {}
