import { TestBed } from '@angular/core/testing';

import { HttpheaderService } from './httpheader.service';

describe('HttpheaderService', () => {
  let service: HttpheaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpheaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
