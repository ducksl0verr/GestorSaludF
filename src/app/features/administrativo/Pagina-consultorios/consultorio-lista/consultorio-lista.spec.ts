import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultorioLista } from './consultorio-lista';

describe('ConsultorioLista', () => {
  let component: ConsultorioLista;
  let fixture: ComponentFixture<ConsultorioLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultorioLista],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultorioLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
