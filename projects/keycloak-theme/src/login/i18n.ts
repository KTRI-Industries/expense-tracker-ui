import { i18nBuilder } from '@keycloakify/angular/login';
import type { ThemeName } from '../kc.gen';

const { getI18n, ofTypeI18n } =
  i18nBuilder.withThemeName<ThemeName>().build();

type I18n = typeof ofTypeI18n;

export { getI18n, type I18n };
