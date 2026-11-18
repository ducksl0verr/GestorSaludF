import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultorioFormulario } from './consultorio-formulario';

describe('ConsultorioFormulario', () => {
  let component: ConsultorioFormulario;
  let fixture: ComponentFixture<ConsultorioFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultorioFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultorioFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
