import { render, screen, fireEvent } from '@testing-library/angular';
import { PasskeyPromptDialogComponent } from './passkey-prompt-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('PasskeyPromptDialogComponent', () => {
  const mockDialogRef = {
    close: jest.fn(),
  };

  async function setup() {
    return render(PasskeyPromptDialogComponent, {
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
      ],
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the passkey prompt headline and body', async () => {
    await setup();
    expect(screen.getByText('Simplify your sign-in')).toBeTruthy();
    expect(
      screen.getByText(/Set up a passkey to sign in faster/),
    ).toBeTruthy();
  });

  it('should close with setup when Set up passkey is clicked', async () => {
    await setup();
    fireEvent.click(screen.getByText('Set up passkey'));
    expect(mockDialogRef.close).toHaveBeenCalledWith('setup');
  });

  it('should close with later when Not now is clicked', async () => {
    await setup();
    fireEvent.click(screen.getByText('Not now'));
    expect(mockDialogRef.close).toHaveBeenCalledWith('later');
  });

  it('should close with never when Don\'t ask again is clicked', async () => {
    await setup();
    fireEvent.click(screen.getByText("Don't ask again"));
    expect(mockDialogRef.close).toHaveBeenCalledWith('never');
  });
});
