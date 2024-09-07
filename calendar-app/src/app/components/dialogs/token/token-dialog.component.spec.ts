import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenDialogComponent } from './token-dialog.component';

describe('TokenDialogComponent', () => {
  let component: TokenDialogComponent;
  let fixture: ComponentFixture<TokenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TokenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
