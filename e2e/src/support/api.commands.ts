import {
  ApiSessionContext,
  RecurrentTransactionDraft,
  TestCredentials,
  TransactionDraft,
} from './models';
import {
  API_BASE_URL,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
} from './test-config';

interface TokenResponse {
  access_token: string;
}

interface TokenPayload {
  email?: string;
  tenantId?: string[] | string;
}

interface PageResponse<T> {
  content?: T[];
}

interface TransactionRecord {
  transactionId: string;
}

interface RecurrentTransactionRecord {
  recurrentTransactionId: string;
}

interface UserRecord {
  email?: string;
}

interface TenantRecord {
  id: string;
  isAssociated: boolean;
  isCurrentUserOwner: boolean;
}

export function registerApiCommands(): void {
  Cypress.Commands.add('seedTransaction', (transaction: TransactionDraft) => {
    getApiSessionContext().then((context) => {
      cy.request({
        method: 'POST',
        url: `${API_BASE_URL}/transactions`,
        headers: buildTenantHeaders(context),
        body: {
          amount: {
            amount: -Math.abs(Number(transaction.amount)),
            currency: 'EUR',
          },
          date: toApiDate(transaction.date),
          description: transaction.description ?? 'Seeded transaction',
          categories: [],
        },
      });
    });
  });

  Cypress.Commands.add(
    'seedRecurrentTransaction',
    (transaction: RecurrentTransactionDraft) => {
      getApiSessionContext().then((context) => {
        cy.request({
          method: 'POST',
          url: `${API_BASE_URL}/recurrent-transactions`,
          headers: buildTenantHeaders(context),
          body: {
            amount: {
              amount: -Math.abs(Number(transaction.amount)),
              currency: 'EUR',
            },
            description:
              transaction.description ?? 'Seeded recurrent transaction',
            categories: [],
            recurrencePeriod: {
              startDate: toApiDate(transaction.date),
              frequency: 'DAILY',
            },
          },
        });
      });
    },
  );
}

export function deleteAllTransactionsByApi() {
  return getApiSessionContext().then((context) => {
    return cy
      .request<PageResponse<TransactionRecord>>({
        method: 'GET',
        url: `${API_BASE_URL}/transactions?page=0&size=200&sort=date,desc`,
        headers: buildTenantHeaders(context),
      })
      .then((response) =>
        Cypress.Promise.each(response.body.content ?? [], (transaction) =>
          cy.request({
            method: 'DELETE',
            url: `${API_BASE_URL}/transactions/${transaction.transactionId}`,
            headers: buildTenantHeaders(context),
          }),
        ).then(() => undefined),
      );
  });
}

export function deleteAllRecurrentTransactionsByApi() {
  return getApiSessionContext().then((context) => {
    return cy
      .request<PageResponse<RecurrentTransactionRecord>>({
        method: 'GET',
        url: `${API_BASE_URL}/recurrent-transactions?page=0&size=200`,
        headers: buildTenantHeaders(context),
      })
      .then((response) =>
        Cypress.Promise.each(response.body.content ?? [], (transaction) =>
          cy.request({
            method: 'DELETE',
            url: `${API_BASE_URL}/recurrent-transactions/${transaction.recurrentTransactionId}`,
            headers: buildTenantHeaders(context),
          }),
        ).then(() => undefined),
      );
  });
}

export function deleteAllInvitedUsersByApi() {
  return getApiSessionContext().then((context) => {
    return cy
      .request<UserRecord[]>({
        method: 'GET',
        url: `${API_BASE_URL}/users`,
        headers: buildTenantHeaders(context),
      })
      .then((response) =>
        Cypress.Promise.each(
          (response.body ?? []).filter(
            (user) => user.email && user.email !== context.email,
          ),
          (user) =>
            cy.request({
              method: 'PUT',
              url: `${API_BASE_URL}/users/uninvite`,
              headers: buildTenantHeaders(context),
              body: {
                guestEmail: user.email,
              },
            }),
        ).then(() => undefined),
      );
  });
}

export function acceptInvitationByApi() {
  return getApiSessionContext().then((context) => {
    return cy
      .request<TenantRecord[]>({
        method: 'GET',
        url: `${API_BASE_URL}/tenants`,
        headers: buildAuthHeaders(context),
      })
      .then((response) => {
        const invitation = response.body.find(
          (tenant) => !tenant.isAssociated && !tenant.isCurrentUserOwner,
        );

        if (!invitation) {
          return;
        }

        return cy
          .request({
            method: 'POST',
            url: `${API_BASE_URL}/users/associate`,
            headers: buildAuthHeaders(context),
            body: {
              tenantId: invitation.id,
            },
          })
          .then(() => {
            cy.visit('/user-page/tenants');
            cy.get('[data-cy="switch-tenant-button"]:visible').first().click();
          });
      });
  });
}

export function leaveTenantByApi() {
  return getApiSessionContext().then((context) => {
    return cy
      .request<TenantRecord[]>({
        method: 'GET',
        url: `${API_BASE_URL}/tenants`,
        headers: buildAuthHeaders(context),
      })
      .then((response) => {
        const secondaryTenant = response.body.find(
          (tenant) => tenant.isAssociated && !tenant.isCurrentUserOwner,
        );

        if (!secondaryTenant) {
          return;
        }

        return cy.request({
          method: 'POST',
          url: `${API_BASE_URL}/users/disassociate`,
          headers: buildAuthHeaders(context),
          body: {
            tenantId: secondaryTenant.id,
          },
        });
      });
  });
}

function getApiSessionContext() {
  const credentials = Cypress.env('currentCredentials') as
    | TestCredentials
    | null
    | undefined;

  if (!credentials) {
    throw new Error('No current Cypress credentials found for API operations.');
  }

  return cy
    .request<TokenResponse>({
      method: 'POST',
      url: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      form: true,
      body: {
        client_id: KEYCLOAK_CLIENT_ID,
        grant_type: 'password',
        username: credentials.email,
        password: credentials.password,
      },
    })
    .then((response) => {
      const payload = decodeTokenPayload(response.body.access_token);
      const tenantId = Array.isArray(payload.tenantId)
        ? payload.tenantId[0]
        : payload.tenantId;

      return {
        accessToken: response.body.access_token,
        currentTenantId: tenantId,
        email: payload.email,
      };
    });
}

function decodeTokenPayload(accessToken: string): TokenPayload {
  const encodedPayload = accessToken.split('.')[1];
  const normalizedPayload = encodedPayload
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=');

  return JSON.parse(
    Cypress.Buffer.from(normalizedPayload, 'base64').toString('utf8'),
  ) as TokenPayload;
}

function buildAuthHeaders(context: ApiSessionContext): Record<string, string> {
  return {
    Authorization: `Bearer ${context.accessToken}`,
  };
}

function buildTenantHeaders(context: ApiSessionContext): Record<string, string> {
  return {
    ...buildAuthHeaders(context),
    'X-Tenant-ID': context.currentTenantId ?? '',
  };
}

function toApiDate(date: string): string {
  if (date.includes('-')) {
    return date;
  }

  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}
