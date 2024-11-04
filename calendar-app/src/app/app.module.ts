import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule } from './components/calendar/calendar.module';
import { DialogsModule } from './components/dialogs/dialogs.module';
import { DrawerModule } from './components/drawers/drawer.module';
import { AppEffects } from './state/app.effect';
import { AppFeature } from './state/app.state';
import { ViewsModule } from './views/views.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule,
    DrawerModule,
    ViewsModule,
    DialogsModule,
    MatFormFieldModule,
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
