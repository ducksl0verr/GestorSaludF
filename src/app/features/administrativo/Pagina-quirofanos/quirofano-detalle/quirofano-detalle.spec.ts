import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuirofanoDetalle } from './quirofano-detalle';

describe('QuirofanoDetalle', () => {
  let component: QuirofanoDetalle;
  let fixture: ComponentFixture<QuirofanoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuirofanoDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(QuirofanoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
