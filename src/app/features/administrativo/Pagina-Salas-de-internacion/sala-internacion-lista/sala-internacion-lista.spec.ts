import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalaInternacionLista } from './sala-internacion-lista';

describe('SalaInternacionLista', () => {
  let component: SalaInternacionLista;
  let fixture: ComponentFixture<SalaInternacionLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaInternacionLista],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaInternacionLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
