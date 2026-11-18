import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediacamentoFormulario } from './mediacamento-formulario';

describe('MediacamentoFormulario', () => {
  let component: MediacamentoFormulario;
  let fixture: ComponentFixture<MediacamentoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediacamentoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(MediacamentoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
