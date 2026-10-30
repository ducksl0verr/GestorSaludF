import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriaClinicaDetalle } from './historia-clinica-detalle';

describe('HistoriaClinicaDetalle', () => {
  let component: HistoriaClinicaDetalle;
  let fixture: ComponentFixture<HistoriaClinicaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaClinicaDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
