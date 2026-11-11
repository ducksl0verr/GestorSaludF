import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObraSocialLista } from './obra-social-lista';

describe('ObraSocialLista', () => {
  let component: ObraSocialLista;
  let fixture: ComponentFixture<ObraSocialLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObraSocialLista],
    }).compileComponents();

    fixture = TestBed.createComponent(ObraSocialLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
