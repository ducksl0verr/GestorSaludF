import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailFormulario } from './email-formulario';

describe('EmailFormulario', () => {
  let component: EmailFormulario;
  let fixture: ComponentFixture<EmailFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
