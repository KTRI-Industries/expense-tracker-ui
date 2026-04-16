import { getDefaultPageComponent, type KcPage } from '@keycloakify/angular/login';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields';
import type { ClassKey } from 'keycloakify/login';
import type { KcContext } from './KcContext';
import { LoginComponent } from './pages/login/login.component';
import { TemplateComponent } from './template/template.component';

export const classes = {} satisfies Partial<Record<ClassKey, string>>;
export const doUseDefaultCss = true;
export const doMakeUserConfirmPassword = true;

export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {
  switch (pageId) {
    case 'login.ftl':
      return {
        PageComponent: LoginComponent,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
    default:
      return {
        PageComponent: await getDefaultPageComponent(pageId),
        TemplateComponent,
        UserProfileFormFieldsComponent,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes,
      };
  }
}
