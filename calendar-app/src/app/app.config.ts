import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { AppEffects } from './state/app.effect';
import { AppFeature } from './state/app.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideStore({ [AppFeature.name]: AppFeature.reducer }),
    provideEffects(AppEffects),
    provideStoreDevtools({ name: 'Stardew Calendar', maxAge: 15 }),
  ],
};
