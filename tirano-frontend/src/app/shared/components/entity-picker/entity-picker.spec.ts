import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPicker } from './entity-picker';

describe('EntityPicker', () => {
  let component: EntityPicker;
  let fixture: ComponentFixture<EntityPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
