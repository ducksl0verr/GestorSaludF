import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultorioDetalle } from './consultorio-detalle';

describe('ConsultorioDetalle', () => {
  let component: ConsultorioDetalle;
  let fixture: ComponentFixture<ConsultorioDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultorioDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultorioDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
