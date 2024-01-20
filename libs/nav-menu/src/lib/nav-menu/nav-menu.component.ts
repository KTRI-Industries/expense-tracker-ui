import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'expense-tracker-ui-nav-menu',
  standalone: true,
  imports: [CommonModule, MatToolbar],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css',
})
export class NavMenuComponent {}
