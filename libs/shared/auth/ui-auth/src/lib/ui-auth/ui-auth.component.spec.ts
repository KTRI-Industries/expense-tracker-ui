import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiAuthComponent } from './ui-auth.component';

describe('UiAuthComponent', () => {
  let component: UiAuthComponent;
  let fixture: ComponentFixture<UiAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAuthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
