import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectMessage } from '../+state/error-handling.selectors';
import { tap } from 'rxjs';

@Component({
  selector: 'expense-tracker-ui-error-handling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-handling.component.html',
  styleUrl: './error-handling.component.css',
})
export class ErrorHandlingComponent {
  errorMessage$ = this.store
    .select(selectMessage)
    .pipe(tap((message) => console.log(message)));
  constructor(private store: Store) {}
}
