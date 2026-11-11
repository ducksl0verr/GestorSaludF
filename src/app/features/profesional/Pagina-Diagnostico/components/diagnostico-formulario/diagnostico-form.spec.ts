import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticoForm } from './diagnostico-form';

describe('DiagnosticoForm', () => {
  let component: DiagnosticoForm;
  let fixture: ComponentFixture<DiagnosticoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
