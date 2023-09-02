import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { KeycloakPlaygroundActions } from './keycloak-playground.actions';

@Injectable()
export class KeycloakPlaygroundEffects {
  private actions$ = inject(Actions);
  private client = inject(HttpClient);

  retrieveAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KeycloakPlaygroundActions.adminCall),
      switchMap((_) =>
        this.client
          .get('http://localhost:8080/admin', { responseType: 'text' })
          .pipe(
            map((message: string) =>
              KeycloakPlaygroundActions.adminCallSuccess({ message })
            ),
            catchError((error: Error) =>
              of(KeycloakPlaygroundActions.adminCallError({ error }))
            )
          )
      )
    )
  );
}
