import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TratamientoFormulario } from './tratamiento-formulario';

describe('TratamientoFormulario', () => {
  let component: TratamientoFormulario;
  let fixture: ComponentFixture<TratamientoFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratamientoFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(TratamientoFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
