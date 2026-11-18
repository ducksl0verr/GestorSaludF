import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicilioFormulario } from './domicilio-formulario';

describe('DomicilioFormulario', () => {
  let component: DomicilioFormulario;
  let fixture: ComponentFixture<DomicilioFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomicilioFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
