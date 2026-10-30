import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultingRooms } from './consulting-rooms';

describe('ConsultingRooms', () => {
  let component: ConsultingRooms;
  let fixture: ComponentFixture<ConsultingRooms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultingRooms],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultingRooms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
