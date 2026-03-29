import {
  acceptInvitationByApi,
  deleteAllInvitedUsersByApi,
  leaveTenantByApi,
} from './api.commands';

export function registerUserCommands(): void {
  Cypress.Commands.add('acceptInvitation', () => {
    acceptInvitationByApi();
  });

  Cypress.Commands.add('leaveTenant', () => {
    leaveTenantByApi();
  });

  Cypress.Commands.add('deleteAllInvitedUsers', () => {
    deleteAllInvitedUsersByApi();
  });
}
