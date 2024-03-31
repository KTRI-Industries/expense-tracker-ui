import { render, screen } from '@testing-library/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { ErrorHandlingComponent } from './error-handling.component';
import { selectMessage } from '../+state/error-handling.selectors';
import '@testing-library/jest-dom';

describe('ErrorHandlingComponent', () => {
  it('should display error message when present', async () => {
    await render(ErrorHandlingComponent, {
      providers: [
        provideMockStore({
          selectors: [{ selector: selectMessage, value: 'Test error message' }],
        }),
      ],
    });

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should not display error message when absent', async () => {
    await render(ErrorHandlingComponent, {
      providers: [
        provideMockStore({
          selectors: [{ selector: selectMessage, value: null }],
        }),
      ],
    });

    expect(screen.queryByText(/.+/)).toBeNull();
  });
});
