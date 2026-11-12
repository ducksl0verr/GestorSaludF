import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediacamentoDetalle } from './mediacamento-detalle';

describe('MediacamentoDetalle', () => {
  let component: MediacamentoDetalle;
  let fixture: ComponentFixture<MediacamentoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediacamentoDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(MediacamentoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
