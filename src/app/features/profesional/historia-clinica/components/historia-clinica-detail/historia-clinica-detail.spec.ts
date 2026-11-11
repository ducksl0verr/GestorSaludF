import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriaClinicaDetail } from './historia-clinica-detail';

describe('HistoriaClinicaDetail', () => {
  let component: HistoriaClinicaDetail;
  let fixture: ComponentFixture<HistoriaClinicaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaClinicaDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
