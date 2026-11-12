import { TestBed } from '@angular/core/testing';
import { DiagnoticoServices } from './diagnostico-services';

describe('DiagnoticoServices', () => {
  let service: DiagnoticoServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnoticoServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
