import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class HomepageEffects {
  private actions$ = inject(Actions);
}
