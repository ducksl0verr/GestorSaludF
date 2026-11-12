import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticoDetalle } from './diagnostico-detalle';

describe('DiagnosticoDetalle', () => {
  let component: DiagnosticoDetalle;
  let fixture: ComponentFixture<DiagnosticoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticoDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
