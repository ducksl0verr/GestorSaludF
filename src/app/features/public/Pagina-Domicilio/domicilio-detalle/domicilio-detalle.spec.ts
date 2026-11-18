import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicilioDetalle } from './domicilio-detalle';

describe('DomicilioDetalle', () => {
  let component: DomicilioDetalle;
  let fixture: ComponentFixture<DomicilioDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomicilioDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
