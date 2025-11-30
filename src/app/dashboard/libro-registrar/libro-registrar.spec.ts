import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroRegistrar } from './libro-registrar';

describe('LibroRegistrar', () => {
  let component: LibroRegistrar;
  let fixture: ComponentFixture<LibroRegistrar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroRegistrar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroRegistrar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
