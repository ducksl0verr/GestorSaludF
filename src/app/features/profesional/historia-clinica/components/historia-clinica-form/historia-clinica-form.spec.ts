import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriaClinicaForm } from './historia-clinica-form';

describe('HistoriaClinicaForm', () => {
  let component: HistoriaClinicaForm;
  let fixture: ComponentFixture<HistoriaClinicaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaClinicaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
