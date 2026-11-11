import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticoDetail } from './diagnostico-detail';

describe('DiagnosticoDetail', () => {
  let component: DiagnosticoDetail;
  let fixture: ComponentFixture<DiagnosticoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticoDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticoDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
