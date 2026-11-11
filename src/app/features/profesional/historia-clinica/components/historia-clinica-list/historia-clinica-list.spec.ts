import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriaClinicaList } from './historia-clinica-list';

describe('HistoriaClinicaList', () => {
  let component: HistoriaClinicaList;
  let fixture: ComponentFixture<HistoriaClinicaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaClinicaList],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriaClinicaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
