import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, ExternalConfiguration } from './app/app.config';
import { AppComponent } from './app/app.component';

fetch('/assets/app.config.json')
  .then((response) => response.json())
  .then((externalConfig) => {
    bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [
        ...appConfig.providers,
        { provide: ExternalConfiguration, useValue: externalConfig },
      ],
    }).catch((err) => console.error(err));
  });
