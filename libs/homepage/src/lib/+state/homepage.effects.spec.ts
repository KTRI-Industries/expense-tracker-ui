import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as HomepageActions from './homepage.actions';
import { HomepageEffects } from './homepage.effects';

describe('HomepageEffects', () => {
  let actions: Observable<Action>;
  let effects: HomepageEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        HomepageEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(HomepageEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: HomepageActions.initHomepage() });

      const expected = hot('-a-|', {
        a: HomepageActions.loadHomepageSuccess({ homepage: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
