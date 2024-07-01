import { AppState } from '../state/app.reducer';
import { AppFeature } from '../state/app.state';

export type AppStore = { [AppFeature.name]: AppState };
