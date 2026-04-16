import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { bootstrapKcApplication } from './kc.gen';
import './styles.css';

(async () => {
  if (window.kcContext === undefined) {
    const { NoContextComponent } = await import('./no-context.component');
    await bootstrapApplication(NoContextComponent, appConfig);
    return;
  }

  await bootstrapKcApplication({
    kcContext: window.kcContext,
    bootstrapApplication: ({ KcRootComponent, kcProvider }) =>
      bootstrapApplication(KcRootComponent, {
        ...appConfig,
        providers: [...appConfig.providers, kcProvider],
      }),
  });
})();
