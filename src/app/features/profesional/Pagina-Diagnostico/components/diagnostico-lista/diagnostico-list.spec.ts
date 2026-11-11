import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticoList } from './diagnostico-list';

describe('DiagnosticoList', () => {
  let component: DiagnosticoList;
  let fixture: ComponentFixture<DiagnosticoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticoList],
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosticoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
