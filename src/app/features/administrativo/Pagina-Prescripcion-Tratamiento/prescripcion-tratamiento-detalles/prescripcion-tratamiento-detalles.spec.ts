import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescripcionTratamientoDetalles } from './prescripcion-tratamiento-detalles';

describe('PrescripcionTratamientoDetalles', () => {
  let component: PrescripcionTratamientoDetalles;
  let fixture: ComponentFixture<PrescripcionTratamientoDetalles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescripcionTratamientoDetalles],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescripcionTratamientoDetalles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
