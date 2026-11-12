import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticoLista } from './diagnostico-lista';

describe('DiagnosticoLista', () => {
  let component: DiagnosticoLista;
  let fixture: ComponentFixture<DiagnosticoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
