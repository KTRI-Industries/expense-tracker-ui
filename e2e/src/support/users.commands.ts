import { getUsernameLink } from './app.po';
import {
  getAcceptInvitationButton,
  getLeaveTenantButton,
  getSwitchTenantButton,
  getUnInviteUserButton,
  getUserEMailListElement,
  getUserList,
  hasUserExceptSelfInTable,
} from './user-page.po';

export function registerUserCommands(): void {
  Cypress.Commands.add('acceptInvitation', () => {
    cy.intercept('GET', '/users').as('apiCheck1');

    cy.visit('/user-page/tenants');
    cy.wait('@apiCheck1').then(() => {
      cy.intercept('/users/associate').as('apiCheck');

      getAcceptInvitationButton().click();

      cy.wait('@apiCheck').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(200);
        getSwitchTenantButton().click();
      });
    });
  });

  Cypress.Commands.add('leaveTenant', () => {
    cy.visit('/user-page/tenants');
    cy.intercept('GET', '/tenants').as('apiCheck1');
    cy.wait('@apiCheck1').then(() => {
      cy.intercept('/users/disassociate').as('apiCheck');

      getLeaveTenantButton().click();
      cy.wait('@apiCheck').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(200);
      });
    });
  });

  Cypress.Commands.add('deleteAllInvitedUsers', () => {
    cy.intercept('GET', '/users').as('apiCheck1');
    getUsernameLink().click();
    cy.wait('@apiCheck1').then(() => {
      getUserList().should('be.visible');
      hasUserExceptSelfInTable().then((hasUser) => {
        if (!hasUser) {
          return;
        }
        getUserEMailListElement().then(($el) => {
          if ($el.is(':visible')) {
            $el.click();
            getUnInviteUserButton().then(($btn) => {
              cy.intercept('GET', '/users').as('apiCheck2');
              if (!$btn.is(':disabled')) {
                $btn.click();

                cy.wait('@apiCheck2').then((interception) => {
                  expect(interception?.response?.statusCode).to.eq(200);
                  cy.deleteAllInvitedUsers();
                });
              }
            });
          }
        });
      });
    });
  });
}
