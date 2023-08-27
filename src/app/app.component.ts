import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { KeycloakService } from 'keycloak-angular';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthActions } from '@expense-tracker-ui/shared/auth';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'expense-tracker-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'expense-tracker-ui';
  constructor(private keycloak: KeycloakService, private store: Store) {}

  ngOnInit(): void {
    // TODO is there a better way to do this from outside the component for example?
    from(this.keycloak.isLoggedIn()).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.store.dispatch(AuthActions.loginSuccess());
      }
    });
  }
}
