import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPersona } from './editar-persona';

describe('EditarPersona', () => {
  let component: EditarPersona;
  let fixture: ComponentFixture<EditarPersona>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPersona]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPersona);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
