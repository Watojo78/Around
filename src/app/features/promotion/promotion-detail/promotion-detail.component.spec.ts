import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionDetailComponent } from './promotion-detail.component';

describe('PromotionDetailComponent', () => {
  let component: PromotionDetailComponent;
  let fixture: ComponentFixture<PromotionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionDetailComponent]
    });
    fixture = TestBed.createComponent(PromotionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
