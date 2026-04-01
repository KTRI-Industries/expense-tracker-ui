import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { ActionsSubject } from '@ngrx/store';
import {
  FeatureFlagsControllerService,
  FeatureFlagsResponse,
} from '@expense-tracker-ui/shared/api';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { FeatureFlagActions } from './feature-flags.actions';
import { FeatureFlagsEffects } from './feature-flags.effects';

describe('FeatureFlagsEffects', () => {
  type FeatureFlagsControllerMock = {
    getFlags: jest.Mock<Observable<FeatureFlagsResponse>, []>;
  };

  let actions$: ActionsSubject;
  let featureFlagsController: FeatureFlagsControllerMock;
  let effects: FeatureFlagsEffects;

  beforeEach(() => {
    actions$ = new ActionsSubject();
    featureFlagsController = {
      getFlags: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        FeatureFlagsEffects,
        {
          provide: Actions,
          useValue: actions$,
        },
        {
          provide: FeatureFlagsControllerService,
          useValue: featureFlagsController,
        },
      ],
    });

    effects = TestBed.inject(FeatureFlagsEffects);
  });

  afterEach(() => {
    actions$.complete();
    TestBed.resetTestingModule();
  });

  it('should load feature flags successfully', async () => {
    const flags: FeatureFlagsResponse = {
      importTransactions: true,
    };
    featureFlagsController.getFlags.mockReturnValue(of(flags));

    const resultPromise = firstValueFrom(effects.loadFeatureFlags$);

    actions$.next(FeatureFlagActions.loadFeatureFlags());

    await expect(resultPromise).resolves.toEqual(
      FeatureFlagActions.loadFeatureFlagsSuccess({ flags }),
    );
    expect(featureFlagsController.getFlags).toHaveBeenCalled();
  });

  it('should dispatch loadFeatureFlagsFailure when loading flags fails', async () => {
    const error = new Error('flags failed');
    featureFlagsController.getFlags.mockReturnValue(
      throwError(() => error),
    );

    const resultPromise = firstValueFrom(effects.loadFeatureFlags$);

    actions$.next(FeatureFlagActions.loadFeatureFlags());

    await expect(resultPromise).resolves.toEqual(
      FeatureFlagActions.loadFeatureFlagsFailure({ error }),
    );
  });
});
