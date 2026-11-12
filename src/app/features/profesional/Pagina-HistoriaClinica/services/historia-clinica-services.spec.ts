import { TestBed } from '@angular/core/testing';
import { HistoriaClinicaServices } from './historia-clinica-services';

describe('HistoriaClinicaServices', () => {
  let service: HistoriaClinicaServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriaClinicaServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
