import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDictionaryComponent } from './view-dictionary.component';

describe('ViewDictionaryComponent', () => {
  let component: ViewDictionaryComponent;
  let fixture: ComponentFixture<ViewDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDictionaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
