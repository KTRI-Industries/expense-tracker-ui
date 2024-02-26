import {
  homepageReducer,
  HomepageState,
  initialHomepageState,
} from './homepage.reducer';
import * as HomepageActions from './homepage.actions';
import { HomepageEntity } from './homepage.models';

describe('Homepage Reducer', () => {
  let state: HomepageState;

  beforeEach(() => {
    state = {
      ...initialHomepageState,
    };
  });

  it('returns the initial state', () => {
    const action = {} as any;
    const result = homepageReducer(state, action);

    expect(result).toBe(state);
  });

  it('handles initHomepage action', () => {
    const action = HomepageActions.initHomepage();
    const result = homepageReducer(state, action);

    expect(result.loaded).toBe(false);
    expect(result.error).toBe(null);
  });

  it('handles loadHomepageSuccess action', () => {
    const homepage: HomepageEntity[] = [
      // fill with mock data
    ];
    const action = HomepageActions.loadHomepageSuccess({ homepage });
    const result = homepageReducer(state, action);

    expect(result.loaded).toBe(true);
    expect(result.ids.length).toBe(homepage.length);
  });

  it('handles loadHomepageFailure action', () => {
    const error = new Error('error');
    const action = HomepageActions.loadHomepageFailure({ error });
    const result = homepageReducer(state, action);

    expect(result.error).toEqual(error);
  });
});
