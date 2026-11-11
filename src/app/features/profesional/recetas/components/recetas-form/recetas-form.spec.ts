import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetaForm } from './recetas-form';

describe('RecetasForm', () => {
  let component: RecetaForm;
  let fixture: ComponentFixture<RecetaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RecetaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
