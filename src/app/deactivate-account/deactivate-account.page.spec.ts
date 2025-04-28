import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeactivateAccountPage } from './deactivate-account.page';

describe('DeactivateAccountPage', () => {
  let component: DeactivateAccountPage;
  let fixture: ComponentFixture<DeactivateAccountPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
