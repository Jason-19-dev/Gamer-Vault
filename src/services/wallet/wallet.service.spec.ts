import { TestBed } from '@angular/core/testing';

import { WalletService } from '../../app/services/wallet.service';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
