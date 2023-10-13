import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { KeycloakPlaygroundActions } from './keycloak-playground.actions';
import { ExternalConfiguration } from '../../../../../src/app/app.config';

@Injectable()
export class KeycloakPlaygroundEffects {
  private actions$ = inject(Actions);
  private client = inject(HttpClient);
  private externalConfig = inject(ExternalConfiguration);

  retrieveAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KeycloakPlaygroundActions.adminCall),
      switchMap((_) =>
        this.client
          .get(`${this.externalConfig.basePath}/admin`, {
            responseType: 'text',
          })
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
