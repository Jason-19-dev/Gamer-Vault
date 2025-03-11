import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsPagesPage } from './tabs-pages.page';

describe('TabsPagesPage', () => {
  let component: TabsPagesPage;
  let fixture: ComponentFixture<TabsPagesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
