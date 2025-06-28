import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPersona } from './crear-persona';

describe('CrearPersona', () => {
  let component: CrearPersona;
  let fixture: ComponentFixture<CrearPersona>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPersona]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPersona);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
