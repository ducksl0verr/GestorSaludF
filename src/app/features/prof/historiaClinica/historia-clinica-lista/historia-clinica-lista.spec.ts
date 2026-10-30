import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriaClinicaLista } from './historia-clinica-lista';

describe('HistoriaClinicaLista', () => {
  let component: HistoriaClinicaLista;
  let fixture: ComponentFixture<HistoriaClinicaLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaClinicaLista],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
