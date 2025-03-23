import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { InviteUserFormComponent } from './invite-user-form.component';
import { UserActions } from '../+state/user.actions';

@Component({
  selector: 'expense-tracker-ui-invite-user-container',
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
      UserActions.inviteUser({ recipientEmail: $event.email }),
    );
  }

  constructor(private store: Store) {}
}
