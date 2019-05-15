import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEventoPage } from './crear-evento.page';

describe('CrearEventoPage', () => {
  let component: CrearEventoPage;
  let fixture: ComponentFixture<CrearEventoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearEventoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
