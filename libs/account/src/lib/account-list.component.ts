import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatChip, MatChipSet } from '@angular/material/chips';

@Component({
  selector: 'expense-tracker-ui-account-list',
  imports: [
    CommonModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    MatRowDef,
    MatHeaderRowDef,
    MatChipSet,
    MatChip,
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
})
export class AccountListComponent {
  private _accounts: TenantWithUserDetails[] | null | undefined;

  @Input()
  set accounts(value: TenantWithUserDetails[] | null | undefined) {
    this._accounts = value ?? [];

    // TODO - this is a workaround, we should not be setting the datasource here
    this.accountssDatasource = new MatTableDataSource(this._accounts);
  }

  get accounts() {
    return this._accounts;
  }

  @Input() currentTenantId: string | null | undefined;

  @Output() leaveAccount = new EventEmitter<TenantWithUserDetails>();
  @Output() associateUserWithAccount =
    new EventEmitter<TenantWithUserDetails>();
  @Output() switchAccount = new EventEmitter<TenantWithUserDetails>();
  @Output() setDefaultAccount = new EventEmitter<TenantWithUserDetails>();
  @Output() rejectInvite = new EventEmitter<TenantWithUserDetails>();

  accountssDatasource: MatTableDataSource<TenantWithUserDetails> | undefined;
  displayedColumns = ['mainUserEmail', 'isAssociated'];

  onLeave(element: TenantWithUserDetails) {
    this.leaveAccount.emit(element);
  }

  onAccept(element: TenantWithUserDetails) {
    this.associateUserWithAccount.emit(element);
  }

  onSwitch(element: TenantWithUserDetails) {
    this.switchAccount.emit(element);
  }

  onSetDefault(element: TenantWithUserDetails) {
    this.setDefaultAccount.emit(element);
  }

  onReject(element: TenantWithUserDetails) {
    this.rejectInvite.emit(element);
  }
}
