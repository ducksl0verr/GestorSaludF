import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfLayouts } from './prof-layouts';

describe('ProfLayouts', () => {
  let component: ProfLayouts;
  let fixture: ComponentFixture<ProfLayouts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfLayouts],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfLayouts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
