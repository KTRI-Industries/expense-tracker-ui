import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthActions } from '@expense-tracker-ui/shared/auth';
import { Store } from '@ngrx/store';

@Component({
  selector: 'expense-tracker-ui-homepage',
  standalone: true,
  imports: [CommonModule, MatButton, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {
  constructor(private store: Store) {}
  login() {
    this.store.dispatch(AuthActions.login());
  }
}
