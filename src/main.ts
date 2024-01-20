import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ExternalConfiguration } from '@expense-tracker-ui/shared/auth';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';

fetch('/assets/app.config.json')
  .then((response) => response.json())
  .then((externalConfig) => {
    bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [
        ...appConfig.providers,
        { provide: ExternalConfiguration, useValue: externalConfig },
        provideAnimations(),
      ],
    }).catch((err) => console.error(err));
  });
