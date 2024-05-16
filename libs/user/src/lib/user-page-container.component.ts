import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPageComponent } from './user-page.component';
import { AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-user-page-container',
  standalone: true,
  imports: [UserPageComponent, AsyncPipe],
  template: `
    <lib-user-page [tenantUsers]="users$ | async"></lib-user-page>
  `,
  styles: ``,
})
export class UserPageContainerComponent {
  users$ = this.store.select(AuthSelectors.selectNonMainUsers);

  constructor(private store: Store) {}
}
