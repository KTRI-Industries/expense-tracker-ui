import {
  ChangeDetectorRef,
  Component,
  inject,
  type OnInit,
  type Type,
} from '@angular/core';
import type { Meta, StoryContext } from '@storybook/angular';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { provideKeycloakifyAngular } from '@keycloakify/angular/login/providers/keycloakify-angular';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { createGetKcContextMock } from 'keycloakify/login/KcContext';
import { appConfig } from '../app.config';
import { kcEnvDefaults, themeNames } from '../kc.gen';
import type { KcContextExtension, KcContextExtensionPerPage } from './KcContext';
import {
  classes,
  doMakeUserConfirmPassword,
  doUseDefaultCss,
  getKcPage,
} from './KcPage';
import { getI18n } from './i18n';
import { TemplateComponent } from './template/template.component';

const kcContextExtension: KcContextExtension = {
  themeName: themeNames[0],
  properties: {
    ...kcEnvDefaults,
  },
};

const kcContextExtensionPerPage: KcContextExtensionPerPage = {};

export const { getKcContextMock } = createGetKcContextMock({
  kcContextExtension,
  kcContextExtensionPerPage,
  overrides: {},
  overridesPerPage: {},
});

type StoryGlobals = {
  pageId?: KcContext['pageId'];
  kcContext?: Record<string, unknown>;
};

// Storybook feeds globals into the Keycloak provider so every story can tweak a
// mocked page context without having to rebuild a custom wrapper component.
export const decorators: Meta['decorators'] = [
  (_story, context: StoryContext) => ({
    applicationConfig: {
      providers: [
        ...(appConfig.providers ?? []),
        provideKeycloakifyAngular({
          kcContext: getKcContextMock({
            pageId: ((context.globals as StoryGlobals).pageId ?? 'login.ftl') as KcContext['pageId'],
            overrides: (context.globals as StoryGlobals).kcContext,
          }),
          classes,
          getI18n,
          doUseDefaultCss,
          doMakeUserConfirmPassword,
        }),
      ],
    },
  }),
];

@Component({
  selector: 'kc-page-story',
  standalone: true,
  imports: [TemplateComponent],
  template: `@if (pageComponent) { <kc-root [page]="pageComponent"></kc-root> }`,
})
export class KcPageStory implements OnInit {
  pageComponent: Type<unknown> | undefined;
  readonly kcContext = inject<KcContext>(KC_LOGIN_CONTEXT);
  readonly #cd = inject(ChangeDetectorRef);

  ngOnInit() {
    getKcPage(this.kcContext.pageId).then((kcPage) => {
      this.pageComponent = kcPage.PageComponent;
      this.#cd.markForCheck();
    });
  }
}
