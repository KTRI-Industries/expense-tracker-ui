export const getAccountRowByOwnerEmail = (email: string) =>
  cy
    .get('[data-cy="account-row"]')
    .filter((_, row) => row.textContent?.includes(email) ?? false)
    .first();

export const getSwitchTenantButtonForOwner = (email: string) =>
  getAccountRowByOwnerEmail(email).find('[data-cy="switch-tenant-button"]');

export const getSetDefaultTenantButtonForOwner = (email: string) =>
  getAccountRowByOwnerEmail(email).find('[data-cy="set-default-tenant-button"]');
