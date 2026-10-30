import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrativeLayout } from './administrative-layout';

describe('AdministrativeLayout', () => {
  let component: AdministrativeLayout;
  let fixture: ComponentFixture<AdministrativeLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrativeLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrativeLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
