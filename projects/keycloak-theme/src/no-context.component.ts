import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'kc-no-context',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
      <section class="rounded-[2rem] border border-white/60 bg-white/85 p-10 shadow-[0_24px_64px_rgba(24,50,77,0.12)] backdrop-blur">
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--landing-eyebrow)]">
          Expense Tracker
        </p>
        <h1 class="font-brand text-4xl font-bold tracking-[-0.04em] text-[var(--app-ink)]">
          Keycloakify preview shell
        </h1>
        <p class="mt-4 max-w-2xl text-base leading-7 text-[var(--app-ink-soft)]">
          This Angular project is meant to render inside Keycloak or with a mocked
          <code>kcContext</code>. Run it through the Keycloakify preview flow or package it for
          deployment to see the login pages.
        </p>
      </section>
    </main>
  `,
})
export class NoContextComponent {}
