import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProveedorDetalle } from './proveedor-detalle';

describe('ProveedorDetalle', () => {
  let component: ProveedorDetalle;
  let fixture: ComponentFixture<ProveedorDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedorDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
