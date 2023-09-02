import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectMessage } from '../+state/keycloak-playground.selectors';
import { Observable } from 'rxjs';
import { KeycloakPlaygroundActions } from '../+state/keycloak-playground.actions';

@Component({
  selector: 'expense-tracker-ui-keycloak-playground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keycloak-playground.component.html',
  styleUrls: ['./keycloak-playground.component.css'],
})
export class KeycloakPlaygroundComponent {
  store: Store = inject(Store);
  message$: Observable<string | null> = this.store.select(selectMessage);

  loadMessage() {
    this.store.dispatch(KeycloakPlaygroundActions.adminCall());
  }
}
