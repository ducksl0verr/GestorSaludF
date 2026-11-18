import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrescripcionTratamientoLista } from './prescripcion-tratamiento-lista';

describe('PrescripcionTratamientoLista', () => {
  let component: PrescripcionTratamientoLista;
  let fixture: ComponentFixture<PrescripcionTratamientoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescripcionTratamientoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescripcionTratamientoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
