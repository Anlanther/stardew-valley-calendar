import { HttpClient } from '@angular/common/http';
import {
  SpectatorService,
  SpyObject,
  createServiceFactory,
} from '@ngneat/spectator/jest';
import { DataService } from './data.service';

describe('UserDataService', () => {
  let spectator: SpectatorService<DataService>;
  let mockHttpClient: SpyObject<HttpClient>;

  const createService = createServiceFactory({
    service: DataService,
    mocks: [HttpClient],
  });

  beforeEach(() => {
    spectator = createService();
    mockHttpClient = spectator.inject(HttpClient);
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('graphql', () => {
    it('should call on the HttpClient', () => {});
  });
});
