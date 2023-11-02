import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { KeycloakPlaygroundActions } from './keycloak-playground.actions';
import { KeycloakPlaygroundService } from '../keycloak-playground.service';
import { UserInfo } from "@expense-tracker-ui/api";

@Injectable()
export class KeycloakPlaygroundEffects {
  private actions$ = inject(Actions);
  private client = inject(KeycloakPlaygroundService);

  retrieveAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KeycloakPlaygroundActions.adminCall),
      switchMap(() =>
        this.client.getAdmin().pipe(
          map((message: UserInfo) =>
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
