import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDeDatos } from './tabla-de-datos';

describe('TablaDeDatos', () => {
  let component: TablaDeDatos;
  let fixture: ComponentFixture<TablaDeDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaDeDatos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaDeDatos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
