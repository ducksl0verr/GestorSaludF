import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuirofanoFormulario } from './quirofano-formulario';

describe('QuirofanoFormulario', () => {
  let component: QuirofanoFormulario;
  let fixture: ComponentFixture<QuirofanoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuirofanoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(QuirofanoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
