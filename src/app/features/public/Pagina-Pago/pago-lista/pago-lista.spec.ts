import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoLista } from './pago-lista';

describe('PagoLista', () => {
  let component: PagoLista;
  let fixture: ComponentFixture<PagoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
