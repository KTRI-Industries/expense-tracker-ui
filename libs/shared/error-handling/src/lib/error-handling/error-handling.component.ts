import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectMessage } from '../+state/error-handling.selectors';

@Component({
  selector: 'expense-tracker-ui-error-handling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-handling.component.html',
  styleUrl: './error-handling.component.css',
})
export class ErrorHandlingComponent {
  errorMessage$ = this.store.select(selectMessage);
  constructor(private store: Store) {}
}
