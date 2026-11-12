import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnoDetalles } from './turno-detalles';

describe('TurnoDetalles', () => {
  let component: TurnoDetalles;
  let fixture: ComponentFixture<TurnoDetalles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoDetalles],
    }).compileComponents();

    fixture = TestBed.createComponent(TurnoDetalles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
