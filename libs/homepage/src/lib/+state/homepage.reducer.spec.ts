import { Action } from '@ngrx/store';

import * as HomepageActions from './homepage.actions';
import { HomepageEntity } from './homepage.models';
import {
  homepageReducer,
  HomepageState,
  initialHomepageState,
} from './homepage.reducer';

describe('Homepage Reducer', () => {
  const createHomepageEntity = (id: string, name = ''): HomepageEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Homepage actions', () => {
    it('loadHomepageSuccess should return the list of known Homepage', () => {
      const homepage = [
        createHomepageEntity('PRODUCT-AAA'),
        createHomepageEntity('PRODUCT-zzz'),
      ];
      const action = HomepageActions.loadHomepageSuccess({ homepage });

      const result: HomepageState = homepageReducer(
        initialHomepageState,
        action,
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = homepageReducer(initialHomepageState, action);

      expect(result).toBe(initialHomepageState);
    });
  });
});
