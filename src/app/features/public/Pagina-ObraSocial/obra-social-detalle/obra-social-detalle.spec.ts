import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObraSocialDetalle } from './obra-social-detalle';

describe('ObraSocialDetalle', () => {
  let component: ObraSocialDetalle;
  let fixture: ComponentFixture<ObraSocialDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObraSocialDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ObraSocialDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
