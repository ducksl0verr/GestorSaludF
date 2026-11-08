import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotonSalir } from './boton-salir';

describe('BotonSalir', () => {
  let component: BotonSalir;
  let fixture: ComponentFixture<BotonSalir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonSalir],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonSalir);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
