import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrativoLayout } from './administrativo-layout';

describe('AdministrativoLayout', () => {
  let component: AdministrativoLayout;
  let fixture: ComponentFixture<AdministrativoLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrativoLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrativoLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
