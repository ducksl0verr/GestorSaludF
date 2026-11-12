import { TestBed } from '@angular/core/testing';
import { RecetaServices } from './receta-services';

describe('RecetaServices', () => {
  let service: RecetaServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecetaServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
