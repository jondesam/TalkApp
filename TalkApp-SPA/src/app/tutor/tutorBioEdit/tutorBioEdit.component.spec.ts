/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TutorBioEditComponent } from './tutorBioEdit.component';

describe('TutorRegisterComponent', () => {
  let component: TutorBioEditComponent;
  let fixture: ComponentFixture<TutorBioEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TutorBioEditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorBioEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
