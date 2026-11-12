import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultorioNuevo } from './consultorio-nuevo';

describe('ConsultorioNuevo', () => {
  let component: ConsultorioNuevo;
  let fixture: ComponentFixture<ConsultorioNuevo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultorioNuevo],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultorioNuevo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
