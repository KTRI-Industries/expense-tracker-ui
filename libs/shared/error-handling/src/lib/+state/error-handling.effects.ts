import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';
import { ErrorHandlingActions } from './error-handling.actions';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class ErrorHandlingEffects {
  private actions$ = inject(Actions);

  clearOnNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(() => ErrorHandlingActions.clearBackEndError()),
    ),
  );
}
