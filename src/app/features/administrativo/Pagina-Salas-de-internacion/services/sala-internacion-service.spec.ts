import { TestBed } from '@angular/core/testing';
import { SalaInternacionService } from './sala-internacion-service';

describe('SalaInternacionService', () => {
  let service: SalaInternacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaInternacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
