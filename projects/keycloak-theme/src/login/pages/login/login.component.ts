import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';

@Component({
  selector: 'kc-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [NgClass, KcSanitizePipe, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginComponent),
    },
  ],
})
export class LoginComponent extends ComponentReference {
  readonly kcContext = inject<Extract<KcContext, { pageId: 'login.ftl' }>>(
    KC_LOGIN_CONTEXT,
  );
  readonly i18n = inject<I18n>(LOGIN_I18N);

  readonly infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
  readonly socialProvidersNode =
    viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

  readonly isLoginButtonDisabled = signal(false);
  readonly isPasswordRevealed = signal(false);

  displayRequiredFields = false;
  displayInfo =
    !!this.kcContext.realm.password &&
    !!this.kcContext.realm.registrationAllowed &&
    !this.kcContext.registrationDisabled;
  displayMessage = !this.kcContext.messagesPerField.existsError(
    'username',
    'password',
  );

  togglePasswordVisibility() {
    this.isPasswordRevealed.update((revealed) => !revealed);
  }
}
