import { Component } from '@angular/core';
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
  ],
  templateUrl: './tenant-list.component.html',
  styles: ``,
})
export class TenantListComponent {}
