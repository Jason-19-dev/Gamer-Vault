import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoinsPage } from './coins.page';

describe('CoinsPage', () => {
  let component: CoinsPage;
  let fixture: ComponentFixture<CoinsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
