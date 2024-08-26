import { CommonModule, TitleCasePipe } from '@angular/common';
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
import { SelectCalendarDialogComponent } from './calendar/select-dialog/select-dialog.component';
import { DeleteDialogComponent } from './delete/delete-dialog.component';
import { CreateEventDialogComponent } from './game-event/create-dialog/create-dialog.component';
import { EditEventDialogComponent } from './game-event/edit-dialog/edit-dialog.component';

@NgModule({
  declarations: [
    CreateCalendarDialogComponent,
    SelectCalendarDialogComponent,
    EditEventDialogComponent,
    CreateEventDialogComponent,
    DeleteDialogComponent,
    EditCalendarDialogComponent,
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
    SelectCalendarDialogComponent,
    EditEventDialogComponent,
    CreateEventDialogComponent,
  ],
  providers: [TitleCasePipe],
})
export class DialogsModule {}
