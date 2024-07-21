import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule } from './calendar/calendar.module';
import { DayFormModule } from './day-form/day-form.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { AppEffects } from './state/app.effect';
import { AppFeature } from './state/app.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule,
    DayFormModule,
    DialogsModule,
    StoreModule.forRoot({ [AppFeature.name]: AppFeature.reducer }),
    EffectsModule.forRoot(AppEffects),
    StoreDevtoolsModule.instrument({
      name: 'Stardew Valley Calendar',
      maxAge: 25,
    }),
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
