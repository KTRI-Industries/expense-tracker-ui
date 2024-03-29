import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class ErrorHandlingEffects {
  private actions$ = inject(Actions);
}
