import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArticleDetailPage } from './admin-article-detail-page';

describe('AdminArticleDetailPage', () => {
  let component: AdminArticleDetailPage;
  let fixture: ComponentFixture<AdminArticleDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminArticleDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminArticleDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
