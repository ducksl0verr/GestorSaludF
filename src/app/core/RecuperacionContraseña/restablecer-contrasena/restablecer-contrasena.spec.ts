import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { RestablecerContrasena } from './restablecer-contrasena';

describe('RestablecerContrasena', () => {
  let component: RestablecerContrasena;
  let fixture: ComponentFixture<RestablecerContrasena>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestablecerContrasena],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ token: 'token-de-prueba' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestablecerContrasena);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
