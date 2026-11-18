import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TratamientoLista } from './tratamiento-lista';

describe('TratamientoLista', () => {
  let component: TratamientoLista;
  let fixture: ComponentFixture<TratamientoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TratamientoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(TratamientoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
