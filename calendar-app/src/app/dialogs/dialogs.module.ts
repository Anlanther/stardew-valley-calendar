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
import { DeleteEventDialogComponent } from './day-form/delete-dialog/delete-dialog.component';
import { EditEventDialogComponent } from './day-form/edit-dialog/edit-dialog.component';

@NgModule({
  declarations: [
    CreateCalendarDialogComponent,
    EditCalendarDialogComponent,
    DeleteEventDialogComponent,
    EditEventDialogComponent,
    CreateEventDialogComponent,
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
    DeleteEventDialogComponent,
    EditEventDialogComponent,
    CreateEventDialogComponent,
  ],
})
export class DialogsModule {}
