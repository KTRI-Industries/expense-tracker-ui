import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfo } from '@expense-tracker-ui/shared/api';
import {
  MatList,
  MatListItem,
  MatListOption,
  MatSelectionList,
} from '@angular/material/list';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { TenantListComponent } from './tenant-list.component';

@Component({
  selector: 'expense-tracker-ui-user-page',
  standalone: true,
  imports: [
    CommonModule,
    MatList,
    MatListItem,
    MatSelectionList,
    MatListOption,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    RouterLink,
    MatCardActions,
    MatButton,
    TenantListComponent,
  ],
  templateUrl: './user-page.component.html',
  styles: ``,
})
export class UserPageComponent {
  @Input() tenantUsers: UserInfo[] | null = [];
  @Input() isTenantOwner: boolean | null | undefined = false;
  @Input() email: string | null | undefined = '';

  @Output() delete = new EventEmitter<string>();

  onDelete(value: string) {
    console.log(value);
    this.delete.emit(value);
  }

  isLoggedInUser(user: UserInfo) {
    return user.email == this.email;
  }
}
