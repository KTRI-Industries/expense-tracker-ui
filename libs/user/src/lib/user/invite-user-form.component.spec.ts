import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteUserFormComponent } from './invite-user-form.component';

describe('UserComponent', () => {
  let component: InviteUserFormComponent;
  let fixture: ComponentFixture<InviteUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteUserFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
