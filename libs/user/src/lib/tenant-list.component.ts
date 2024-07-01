import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { TenantWithUserDetails } from '@expense-tracker-ui/api';
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
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
import { MatChip, MatChipSet } from '@angular/material/chips';

@Component({
  selector: 'expense-tracker-ui-tenant-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatIcon,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    MatSortHeader,
    MatRowDef,
    MatHeaderRowDef,
    MatChipSet,
    MatChip,
  ],
  templateUrl: './tenant-list.component.html',
  styles: ``,
})
export class TenantListComponent {
  private _tenants: TenantWithUserDetails[] | null | undefined;

  @Input()
  set tenants(value: TenantWithUserDetails[] | null | undefined) {
    this._tenants = value ?? [];

    // TODO - this is a workaround, we should not be setting the datasource here
    this.tenantsDatasource = new MatTableDataSource(this._tenants);
  }

  get tenants() {
    return this._tenants;
  }

  @Output() leaveTenant = new EventEmitter<TenantWithUserDetails>();
  @Output() associateTenant = new EventEmitter<TenantWithUserDetails>();

  tenantsDatasource: MatTableDataSource<TenantWithUserDetails> | undefined;
  displayedColumns = ['mainUserEmail', 'isAssociated'];

  onLeave(element: TenantWithUserDetails) {
    this.leaveTenant.emit(element);
  }

  onAccept(element: TenantWithUserDetails) {
    this.associateTenant.emit(element);
  }
}
