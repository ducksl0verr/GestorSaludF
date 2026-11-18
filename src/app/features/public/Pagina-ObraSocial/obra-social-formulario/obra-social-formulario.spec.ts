import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObraSocialFormulario } from './obra-social-formulario';

describe('ObraSocialFormulario', () => {
  let component: ObraSocialFormulario;
  let fixture: ComponentFixture<ObraSocialFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObraSocialFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(ObraSocialFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
