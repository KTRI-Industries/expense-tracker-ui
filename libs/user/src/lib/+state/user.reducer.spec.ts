import { Action } from '@ngrx/store';

import * as UserActions from './user.actions';
import { UserEntity } from './user.models';
import { initialUserState, userReducer, UserState } from './user.reducer';

describe('User Reducer', () => {
  const createUserEntity = (id: string, name = ''): UserEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid User actions', () => {
    it('loadUserSuccess should return the list of known User', () => {
      const user = [
        createUserEntity('PRODUCT-AAA'),
        createUserEntity('PRODUCT-zzz'),
      ];
      const action = UserActions.loadUserSuccess({ user });

      const result: UserState = userReducer(initialUserState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = userReducer(initialUserState, action);

      expect(result).toBe(initialUserState);
    });
  });
});
