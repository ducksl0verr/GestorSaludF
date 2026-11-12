import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { OlvideContrasena } from './olvide-contrasena';

describe('OlvideContrasena', () => {
  let component: OlvideContrasena;
  let fixture: ComponentFixture<OlvideContrasena>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlvideContrasena],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OlvideContrasena);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
