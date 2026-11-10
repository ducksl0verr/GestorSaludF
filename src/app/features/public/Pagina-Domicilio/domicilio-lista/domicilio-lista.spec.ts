import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicilioLista } from './domicilio-lista';

describe('DomicilioLista', () => {
  let component: DomicilioLista;
  let fixture: ComponentFixture<DomicilioLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomicilioLista],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
