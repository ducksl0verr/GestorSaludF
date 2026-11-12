import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriaClinicaFormulario } from './historia-clinica-formulario';

describe('HistoriaClinicaFormulario', () => {
  let component: HistoriaClinicaFormulario;
  let fixture: ComponentFixture<HistoriaClinicaFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaClinicaFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
