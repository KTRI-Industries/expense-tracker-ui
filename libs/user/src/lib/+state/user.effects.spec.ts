import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as UserActions from './user.actions';
import { UserEffects } from './user.effects';

describe('UserEffects', () => {
  let actions: Observable<Action>;
  let effects: UserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        UserEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(UserEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: UserActions.initUser() });

      const expected = hot('-a-|', {
        a: UserActions.loadUserSuccess({ user: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
