import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateCalendarDialogComponent } from './calendar/create-dialog/create-dialog.component';
import { EditCalendarDialogComponent } from './calendar/edit-dialog/edit-dialog.component';
import { CreateEventDialogComponent } from './day-form/create-dialog/create-dialog.component';
import { EditEventDialogComponent } from './day-form/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './delete/delete-dialog.component';

@NgModule({
  declarations: [
    CreateCalendarDialogComponent,
    EditCalendarDialogComponent,
    EditEventDialogComponent,
    CreateEventDialogComponent,
    DeleteDialogComponent,
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
  ],
  exports: [
    CreateCalendarDialogComponent,
    EditCalendarDialogComponent,
    EditEventDialogComponent,
    CreateEventDialogComponent,
  ],
})
export class DialogsModule {}