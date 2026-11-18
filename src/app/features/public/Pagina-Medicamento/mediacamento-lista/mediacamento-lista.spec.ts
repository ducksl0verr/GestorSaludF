import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediacamentoLista } from './mediacamento-lista';

describe('MediacamentoLista', () => {
  let component: MediacamentoLista;
  let fixture: ComponentFixture<MediacamentoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediacamentoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(MediacamentoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
