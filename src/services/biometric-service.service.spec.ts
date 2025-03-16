import { TestBed } from '@angular/core/testing';

import { BiometricServiceService } from './biometric-service';

describe('BiometricServiceService', () => {
  let service: BiometricServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiometricServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
