import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetLista } from './recet-lista';

describe('RecetLista', () => {
  let component: RecetLista;
  let fixture: ComponentFixture<RecetLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetLista],
    }).compileComponents();

    fixture = TestBed.createComponent(RecetLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
