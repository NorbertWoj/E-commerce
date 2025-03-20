import { TestBed } from '@angular/core/testing';

import { SnapShopFormService } from './snap-shop-form.service';

describe('SnapShopFormService', () => {
  let service: SnapShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnapShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
