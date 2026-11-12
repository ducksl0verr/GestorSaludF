import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultorioActualizar } from './consultorio-actualizar';

describe('ConsultorioActualizar', () => {
  let component: ConsultorioActualizar;
  let fixture: ComponentFixture<ConsultorioActualizar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultorioActualizar],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultorioActualizar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
