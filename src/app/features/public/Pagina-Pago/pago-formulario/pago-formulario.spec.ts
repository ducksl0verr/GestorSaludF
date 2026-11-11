import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoFormulario } from './pago-formulario';

describe('PagoFormulario', () => {
  let component: PagoFormulario;
  let fixture: ComponentFixture<PagoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
