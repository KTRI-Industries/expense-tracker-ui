import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PasskeyService } from './passkey.service';
import { KeycloakService } from 'keycloak-angular';

describe('PasskeyService', () => {
  let service: PasskeyService;
  let httpMock: HttpTestingController;
  const mockKeycloakInstance = {
    createAccountUrl: jest
      .fn()
      .mockReturnValue(
        'https://keycloak.example.com/realms/expense-tracker-realm/account?referrer=expense-tracker-ui',
      ),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PasskeyService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: KeycloakService,
          useValue: {
            getKeycloakInstance: () => mockKeycloakInstance,
          },
        },
      ],
    });

    service = TestBed.inject(PasskeyService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('hasPasskey', () => {
    it('should return true when user has webauthn-passwordless credentials', fakeAsync(() => {
      let result: boolean | undefined;
      service.hasPasskey().subscribe((r) => (result = r));

      const req = httpMock.expectOne((r) =>
        r.url.includes('/account/credentials'),
      );
      req.flush([
        {
          type: 'webauthn-passwordless',
          userCredentialMetadatas: [{ id: 'cred-1' }],
        },
      ]);

      tick();
      expect(result).toBe(true);
    }));

    it('should return false when user has no webauthn-passwordless credentials', fakeAsync(() => {
      let result: boolean | undefined;
      service.hasPasskey().subscribe((r) => (result = r));

      const req = httpMock.expectOne((r) =>
        r.url.includes('/account/credentials'),
      );
      req.flush([
        { type: 'webauthn-passwordless', userCredentialMetadatas: [] },
      ]);

      tick();
      expect(result).toBe(false);
    }));

    it('should return false when no credential containers are returned', fakeAsync(() => {
      let result: boolean | undefined;
      service.hasPasskey().subscribe((r) => (result = r));

      const req = httpMock.expectOne((r) =>
        r.url.includes('/account/credentials'),
      );
      req.flush([]);

      tick();
      expect(result).toBe(false);
    }));
  });

  describe('shouldShowPasskeyPrompt', () => {
    it('should return true when localStorage key is not set', () => {
      expect(service.shouldShowPasskeyPrompt()).toBe(true);
    });

    it('should return false when localStorage key is set to true', () => {
      localStorage.setItem('passkey-prompt-dismissed', 'true');
      expect(service.shouldShowPasskeyPrompt()).toBe(false);
    });
  });

  describe('dismissPasskeyPrompt', () => {
    it('should set localStorage key', () => {
      service.dismissPasskeyPrompt();
      expect(localStorage.getItem('passkey-prompt-dismissed')).toBe('true');
    });
  });

  describe('getSecurityUrl', () => {
    it('should construct the correct security URL', () => {
      const url = service.getSecurityUrl();
      expect(url).toBe(
        'https://keycloak.example.com/realms/expense-tracker-realm/account/account-security/signing-in?referrer=expense-tracker-ui',
      );
    });
  });

  describe('openSecurityPage', () => {
    it('should open the security page in a new tab', () => {
      const windowOpenSpy = jest
        .spyOn(window, 'open')
        .mockImplementation(() => null);

      service.openSecurityPage();

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://keycloak.example.com/realms/expense-tracker-realm/account/account-security/signing-in?referrer=expense-tracker-ui',
        '_blank',
        'noopener,noreferrer',
      );

      windowOpenSpy.mockRestore();
    });
  });
});
