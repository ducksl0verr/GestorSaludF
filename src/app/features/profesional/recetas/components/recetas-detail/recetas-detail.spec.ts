import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetasDetail } from './recetas-detail';

describe('RecetasDetail', () => {
  let component: RecetasDetail;
  let fixture: ComponentFixture<RecetasDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetasDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(RecetasDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
