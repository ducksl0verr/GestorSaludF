import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaInternacionDetalle } from './sala-internacion-detalle';

describe('SalaInternacionDetalle', () => {
  let component: SalaInternacionDetalle;
  let fixture: ComponentFixture<SalaInternacionDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaInternacionDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaInternacionDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
