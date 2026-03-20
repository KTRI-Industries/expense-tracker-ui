import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { map, Observable } from 'rxjs';

const PASSKEY_PROMPT_DISMISSED_KEY = 'passkey-prompt-dismissed';

interface CredentialContainer {
  type: string;
  userCredentialMetadatas: unknown[];
}

@Injectable({
  providedIn: 'root',
})
export class PasskeyService {
  private http = inject(HttpClient);
  private keycloak = inject(KeycloakService);

  hasPasskey(): Observable<boolean> {
    const credentialsUrl = `${this.getAccountBaseUrl()}/credentials?type=webauthn-passwordless&user-credentials=true`;
    return this.http.get<CredentialContainer[]>(credentialsUrl).pipe(
      map((containers) =>
        containers.some(
          (c) =>
            c.type === 'webauthn-passwordless' &&
            c.userCredentialMetadatas?.length > 0,
        ),
      ),
    );
  }

  shouldShowPasskeyPrompt(): boolean {
    return localStorage.getItem(PASSKEY_PROMPT_DISMISSED_KEY) !== 'true';
  }

  dismissPasskeyPrompt(): void {
    localStorage.setItem(PASSKEY_PROMPT_DISMISSED_KEY, 'true');
  }

  openSecurityPage(): void {
    window.open(this.getSecurityUrl(), '_blank', 'noopener,noreferrer');
  }

  getSecurityUrl(): string {
    const base = this.getAccountBaseUrl();
    const url = this.keycloak.getKeycloakInstance().createAccountUrl();
    const query = url.includes('?') ? url.substring(url.indexOf('?')) : '';
    return `${base}/account-security/signing-in${query}`;
  }

  private getAccountBaseUrl(): string {
    const url = this.keycloak.getKeycloakInstance().createAccountUrl();
    const accountIndex = url.indexOf('/account');
    return url.substring(0, accountIndex + '/account'.length);
  }
}
