import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescripcionTratamientoFormulario } from './prescripcion-tratamiento-formulario';

describe('PrescripcionTratamientoFormulario', () => {
  let component: PrescripcionTratamientoFormulario;
  let fixture: ComponentFixture<PrescripcionTratamientoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescripcionTratamientoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescripcionTratamientoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
