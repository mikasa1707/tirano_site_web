import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArticleFormPage } from './admin-article-form-page';

describe('AdminArticleFormPage', () => {
  let component: AdminArticleFormPage;
  let fixture: ComponentFixture<AdminArticleFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminArticleFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminArticleFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
