import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuirofanoLista } from './quirofano-lista';

describe('QuirofanoLista', () => {
  let component: QuirofanoLista;
  let fixture: ComponentFixture<QuirofanoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuirofanoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(QuirofanoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
