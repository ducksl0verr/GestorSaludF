import { TestBed } from '@angular/core/testing';
import { PrescripcionTratamientoService } from './prescripcion-tratamiento-service';

describe('PrescripcionTratamientoService', () => {
  let service: PrescripcionTratamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescripcionTratamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
