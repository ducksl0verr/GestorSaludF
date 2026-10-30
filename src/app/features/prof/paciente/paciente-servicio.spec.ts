import { TestBed } from '@angular/core/testing';
import { PacienteServicio } from './paciente-servicio';

describe('PacienteServicio', () => {
  let service: PacienteServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacienteServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
