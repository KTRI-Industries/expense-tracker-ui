import { TestBed } from '@angular/core/testing';
import { Configuration } from '@expense-tracker-ui/shared/api';
import {
  ExternalConfiguration,
} from '@expense-tracker-ui/shared/auth';
import { KeycloakService } from 'keycloak-angular';
import { appConfig, initializeKeycloak } from './app.config';

describe('appConfig', () => {
  it('should create the API configuration from the external configuration', () => {
    const externalConfig = {
      allowedOrigins: ['http://localhost:4200'],
      basePath: 'https://api.example.com',
      keycloakUrl: 'https://keycloak.example.com',
    } as ExternalConfiguration;

    TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        {
          provide: ExternalConfiguration,
          useValue: externalConfig,
        },
        {
          provide: KeycloakService,
          useValue: {
            init: jest.fn(),
          },
        },
      ],
    });

    expect(TestBed.inject(Configuration).basePath).toBe(externalConfig.basePath);
  });
});

describe('initializeKeycloak', () => {
  it('should initialize keycloak with the runtime configuration', async () => {
    const keycloak = {
      init: jest.fn().mockResolvedValue(true),
    } as unknown as KeycloakService;
    const externalConfig = {
      keycloakUrl: 'https://keycloak.example.com',
    } as ExternalConfiguration;

    await initializeKeycloak(keycloak, externalConfig)();

    expect(keycloak.init).toHaveBeenCalledWith({
      config: {
        url: externalConfig.keycloakUrl,
        realm: 'expense-tracker-realm',
        clientId: 'expense-tracker-ui',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          `${window.location.origin}/assets/silent-check-sso.html`,
      },
      enableBearerInterceptor: true,
    });
  });
});
