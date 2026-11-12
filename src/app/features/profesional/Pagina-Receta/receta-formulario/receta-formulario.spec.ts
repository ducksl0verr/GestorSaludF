import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetaFormulario } from './receta-formulario';

describe('RecetaFormulario', () => {
  let component: RecetaFormulario;
  let fixture: ComponentFixture<RecetaFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(RecetaFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
