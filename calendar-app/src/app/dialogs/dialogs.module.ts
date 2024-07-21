import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateCalendarDialogComponent } from './calendar/create-dialog/create-dialog.component';
import { EditCalendarDialogComponent } from './calendar/edit-dialog/edit-dialog.component';
import { DeleteEventDialogComponent } from './day-form/delete-dialog/delete-dialog.component';
import { EditEventDialogComponent } from './day-form/edit-dialog/edit-dialog.component';

@NgModule({
  declarations: [
    CreateCalendarDialogComponent,
    EditCalendarDialogComponent,
    DeleteEventDialogComponent,
    EditEventDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [
    CreateCalendarDialogComponent,
    EditCalendarDialogComponent,
    DeleteEventDialogComponent,
    EditEventDialogComponent,
  ],
})
export class DialogsModule {}
