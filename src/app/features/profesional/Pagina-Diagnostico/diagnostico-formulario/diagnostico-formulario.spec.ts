import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticoFormulario } from './diagnostico-formulario';

describe('DiagnosticoFormulario', () => {
  let component: DiagnosticoFormulario;
  let fixture: ComponentFixture<DiagnosticoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
