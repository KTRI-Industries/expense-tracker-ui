import { Route } from '@angular/router';

export const authRoutes: Route[] = [
  {
    path: '',
    // TODO it seems that if we register effects here they are not fired? providers: [provideEffects(AuthEffects)],
  },
];
