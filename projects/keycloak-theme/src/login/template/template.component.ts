import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  Renderer2,
  signal,
  type Signal,
  type TemplateRef,
  type Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  DEFAULT_UI_THEME,
  UI_THEME_ATTRIBUTE,
  type UiTheme,
} from '@expense-tracker-ui/shared/theme';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { I18n } from '@keycloakify/angular/login/i18n';
import { type KcContext } from '@keycloakify/angular/login/KcContext';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services/login-resource-injector';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { type ClassKey, getKcClsx } from 'keycloakify/login/lib/kcClsx';
import type { Observable } from 'rxjs';

@Component({
  selector: 'kc-root',
  standalone: true,
  templateUrl: './template.component.html',
  imports: [AsyncPipe, KcSanitizePipe, MatCardModule, NgClass, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => TemplateComponent),
    },
  ],
})
export class TemplateComponent extends ComponentReference {
  readonly i18n = inject<I18n>(LOGIN_I18N);
  readonly renderer = inject(Renderer2);
  readonly meta = inject(Meta);
  readonly title = inject(Title);
  readonly kcContext = inject<KcContext>(KC_LOGIN_CONTEXT);
  readonly doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  readonly classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
  readonly loginResourceInjectorService = inject(LoginResourceInjectorService);
  readonly #cdr = inject(ChangeDetectorRef);

  readonly activeTheme = signal<UiTheme>(DEFAULT_UI_THEME);

  readonly isReadyToRender$: Observable<boolean> =
    this.loginResourceInjectorService.injectResource(this.doUseDefaultCss);

  readonly page = input<Type<unknown>>();
  readonly pageRef = viewChild('pageRef', { read: ViewContainerRef });

  readonly userProfileFormFields = input<Type<unknown>>();

  headerNode: Signal<TemplateRef<HTMLElement> | undefined> | undefined;
  infoNode: Signal<TemplateRef<HTMLElement> | undefined> | undefined;
  socialProvidersNode: Signal<TemplateRef<HTMLElement> | undefined> | undefined;

  displayInfo = false;
  displayMessage = true;
  displayRequiredFields = false;
  documentTitle: string | undefined;
  bodyClassName = 'et-login-page';

  private readonly componentCreationEffect = effect(
    () => {
      const page = this.page();
      const pageRef = this.pageRef();

      if (!page || !pageRef) {
        return;
      }

      const userProfileFormFields = this.userProfileFormFields();
      const compRef = pageRef.createComponent(page);

      if (
        'userProfileFormFields' in (compRef.instance as object) &&
        userProfileFormFields
      ) {
        compRef.setInput('userProfileFormFields', userProfileFormFields);
      }

      this.onComponentCreated(compRef.instance as object);
    },
    { manualCleanup: true },
  );

  tryAnotherWay() {
    document.forms['kc-select-try-another-way-form' as never]?.requestSubmit();
  }

  private onComponentCreated(compRef: object) {
    if ('displayInfo' in compRef) {
      this.displayInfo = !!compRef.displayInfo;
    }
    if ('displayMessage' in compRef) {
      this.displayMessage = !!compRef.displayMessage;
    }
    if ('displayRequiredFields' in compRef) {
      this.displayRequiredFields = !!compRef.displayRequiredFields;
    }
    if ('documentTitle' in compRef && compRef.documentTitle) {
      this.documentTitle = compRef.documentTitle as string;
    }
    if ('bodyClassName' in compRef && compRef.bodyClassName) {
      this.bodyClassName = `et-login-page ${compRef.bodyClassName as string}`.trim();
    }
    if ('headerNode' in compRef && compRef.headerNode) {
      this.headerNode = computed(
        () => (compRef.headerNode as Signal<TemplateRef<HTMLElement>>)(),
      );
    }
    if ('infoNode' in compRef && compRef.infoNode) {
      this.infoNode = computed(
        () => (compRef.infoNode as Signal<TemplateRef<HTMLElement>>)(),
      );
    }
    if ('socialProvidersNode' in compRef && compRef.socialProvidersNode) {
      this.socialProvidersNode = computed(
        () => (compRef.socialProvidersNode as Signal<TemplateRef<HTMLElement>>)(),
      );
    }

    this.title.setTitle(
      this.documentTitle ??
        this.i18n.msgStr('loginTitle', this.kcContext.realm.displayName),
    );

    this.applyKcIndexClasses();
    this.applyUiTheme(this.activeTheme());
    this.#cdr.markForCheck();
    this.componentCreationEffect.destroy();
  }

  private applyUiTheme(theme: UiTheme) {
    this.renderer.setAttribute(document.documentElement, UI_THEME_ATTRIBUTE, theme);
  }

  private applyKcIndexClasses() {
    const kcClsx = getKcClsx({
      doUseDefaultCss: this.doUseDefaultCss,
      classes: this.classes,
    }).kcClsx;

    const kcBodyClasses = `${kcClsx('kcBodyClass')} ${this.bodyClassName}`
      .trim()
      .split(/\s+/);
    const kcHtmlClasses = kcClsx('kcHtmlClass').split(/\s+/);

    kcBodyClasses.forEach((klass) => {
      if (klass) {
        this.renderer.addClass(document.body, klass);
      }
    });

    kcHtmlClasses.forEach((klass) => {
      if (klass) {
        this.renderer.addClass(document.documentElement, klass);
      }
    });
  }
}
