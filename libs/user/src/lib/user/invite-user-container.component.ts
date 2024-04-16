import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '@expense-tracker-ui/shared/auth';
import { InviteUserFormComponent } from './invite-user-form.component';

@Component({
  selector: 'expense-tracker-ui-user-container',
  standalone: true,
  imports: [InviteUserFormComponent],
  template: `
    <expense-tracker-ui-invite-user-form
      (invite)="onInvite($event)"></expense-tracker-ui-invite-user-form>
  `,
  styles: ``,
})
export class InviteUserContainerComponent {
  onInvite($event: any) {
    this.store.dispatch(
      AuthActions.inviteUser({ recipientEmail: $event.email }),
    );
  }

  constructor(private store: Store) {}
}
