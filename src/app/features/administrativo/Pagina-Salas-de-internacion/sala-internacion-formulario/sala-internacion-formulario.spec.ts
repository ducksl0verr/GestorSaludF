import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaInternacionFormulario } from './sala-internacion-formulario';

describe('SalaInternacionFormulario', () => {
  let component: SalaInternacionFormulario;
  let fixture: ComponentFixture<SalaInternacionFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaInternacionFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaInternacionFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
