import { HomepageEntity } from './homepage.models';
import {
  homepageAdapter,
  HomepagePartialState,
  initialHomepageState,
} from './homepage.reducer';
import * as HomepageSelectors from './homepage.selectors';

describe('Homepage Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getHomepageId = (it: HomepageEntity) => it.id;
  const createHomepageEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    }) as HomepageEntity;

  let state: HomepagePartialState;

  beforeEach(() => {
    state = {
      homepage: homepageAdapter.setAll(
        [
          createHomepageEntity('PRODUCT-AAA'),
          createHomepageEntity('PRODUCT-BBB'),
          createHomepageEntity('PRODUCT-CCC'),
        ],
        {
          ...initialHomepageState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('Homepage Selectors', () => {
    it('selectAllHomepage() should return the list of Homepage', () => {
      const results = HomepageSelectors.selectAllHomepage(state);
      const selId = getHomepageId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = HomepageSelectors.selectEntity(state) as HomepageEntity;
      const selId = getHomepageId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectHomepageLoaded() should return the current "loaded" status', () => {
      const result = HomepageSelectors.selectHomepageLoaded(state);

      expect(result).toBe(true);
    });

    it('selectHomepageError() should return the current "error" state', () => {
      const result = HomepageSelectors.selectHomepageError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
