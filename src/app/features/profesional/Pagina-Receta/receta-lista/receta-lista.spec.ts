import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetaLista } from './receta-lista';

describe('RecetaLista', () => {
  let component: RecetaLista;
  let fixture: ComponentFixture<RecetaLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaLista],
    }).compileComponents();

    fixture = TestBed.createComponent(RecetaLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
