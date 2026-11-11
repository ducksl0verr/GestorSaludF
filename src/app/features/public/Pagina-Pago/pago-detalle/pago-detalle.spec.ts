import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDetalle } from './pago-detalle';

describe('PagoDetalle', () => {
  let component: PagoDetalle;
  let fixture: ComponentFixture<PagoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
