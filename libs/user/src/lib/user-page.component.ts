import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantWithUserDetails, UserInfo } from '@expense-tracker-ui/api';
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
  @Input() tenants: TenantWithUserDetails[] | null | undefined = [];
  @Input() currentTenantId: string | null | undefined = '';

  @Output() delete = new EventEmitter<string>();
  @Output() leaveTenant = new EventEmitter<TenantWithUserDetails>();
  @Output() associateTenant = new EventEmitter<TenantWithUserDetails>();
  @Output() switchTenant = new EventEmitter<TenantWithUserDetails>();
  @Output() setDefaultTenant = new EventEmitter<TenantWithUserDetails>();

  onDelete(value: string) {
    console.log(value);
    this.delete.emit(value);
  }

  isLoggedInUser(user: UserInfo) {
    return user.email == this.email;
  }

  onLeaveTenant($event: TenantWithUserDetails) {
    this.leaveTenant.emit($event);
  }

  onAssociateTenant($event: TenantWithUserDetails) {
    this.associateTenant.emit($event);
  }

  onSwitchTenant($event: TenantWithUserDetails) {
    this.switchTenant.emit($event);
  }

  onSetDefaultTenant($event: TenantWithUserDetails) {
    this.setDefaultTenant.emit($event);
  }
}
