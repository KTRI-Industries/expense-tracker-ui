// eslint-disable-next-line @typescript-eslint/no-namespace
import { getLoginButton, getUsernameLink } from './app.po';
import {
  getAmountInput,
  getCreateTransactionButton,
  getDatePicker,
  getDeleteTransactionButton,
  getDescriptionInput,
} from './transaction-form.po';
import {
  getAddTransactionButton,
  getFirstDescriptionCell,
  hasTransactionInTable,
} from './transactions.po';
import {
  getAcceptInvitationButton,
  getLeaveTenantButton,
  getSwitchTenantButton,
  getUnInviteUserButton,
  getUserEMailListElement,
  getUserList,
  hasUserExceptSelfInTable,
} from './user-page.po';
import { getTransactionMenu } from './navigation-menu.po';
import {
  getAddRecurrentTransactionButton,
  getCreateRecurrentTransactionButton,
  getDeleteRecurrentTransactionButton,
  getRecurrentAmountInput,
  getRecurrentDescriptionInput,
  getRecurrentStartDatePicker,
  getRecurrentTransactionTab,
  hasRecurrentTransactionInTable,
} from './recurrent-transactions.po';

Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/');
    getLoginButton().click();
    cy.origin(
      'https://keycloak.127.0.0.1.nip.io',
      { args: { email, password } },
      ({ email, password }) => {
        cy.get('#username').type(email);
        cy.get('#password').type(password);
        cy.get('#kc-login').click();
      },
    );
  });
});

Cypress.Commands.add('loginWithoutSession', (email, password) => {
  getLoginButton().click();
  cy.origin(
    'https://keycloak.127.0.0.1.nip.io',
    { args: { email, password } },
    ({ email, password }) => {
      cy.get('#username').type(email);
      cy.get('#password').type(password);
      cy.get('#kc-login').click();
    },
  );
});

Cypress.Commands.add('addNewTransaction', (transaction) => {
  getTransactionMenu().click();
  getAddTransactionButton().click();

  getAmountInput().type(transaction.amount, { force: true });
  getDatePicker().type(transaction.date);

  if (transaction.description !== undefined) {
    getDescriptionInput().type(transaction.description, { force: true });
  }

  getCreateTransactionButton().click();
});

Cypress.Commands.add('editTransaction', (transaction) => {
  getAmountInput().clear().type(transaction.amount, { force: true });
  getDatePicker().clear().type(transaction.date);
  if (transaction.description !== undefined) {
    getDescriptionInput()
      .clear({ force: true })
      .type(transaction.description, { force: true });
  }
});

Cypress.Commands.add('deleteVisibleTransactions', () => {
  cy.visit('transactions-page/transactions');
  cy.intercept('GET', '/transactions*').as('apiCheck');

  cy.wait('@apiCheck').then((interception) => {
    expect(interception?.response?.statusCode).to.eq(200);

    doDelete();
  });
});

Cypress.Commands.add('deleteVisibleRecurrentTransactions', () => {
  cy.visit('transactions-page/recurrent-transactions');
  cy.intercept('GET', '/recurrent-transactions*').as('apiCheckRecurrent');

  cy.wait('@apiCheckRecurrent').then((interception) => {
    expect(interception?.response?.statusCode).to.eq(200);

    doDeleteRecurrent();
  });
});

Cypress.Commands.add('acceptInvitation', (username) => {
  cy.intercept('GET', '/users').as('apiCheck1');

  cy.visit('/user-page/tenants');
  cy.wait('@apiCheck1').then((interception) => {
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
  cy.wait('@apiCheck1').then((interception) => {
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
  cy.wait('@apiCheck1').then((interception) => {
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
                // Call the function recursively
                cy.deleteAllInvitedUsers();
              });
            }
          });
        }
      });
    });
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="logout-button"]:visible').click();
});

Cypress.Commands.add('register', (email, password) => {
  cy.origin(
    'https://keycloak.127.0.0.1.nip.io',
    { args: { email, password } },
    ({ email, password }) => {
      cy.get('#kc-registration a').click();
      cy.get('#username').type(email);
      cy.get('#password').type(password);
      cy.get('#password-confirm').type(password);
      cy.get('#email').type(email);
      cy.get('#firstName').type(email);
      cy.get('#lastName').type(email);
      cy.get('input[value="Register"]').click();
    },
  );
});
/**
 * When trying to retrieve the email from the mailhog ui, I had issues with the iframes it renders so I had to use the API as a workaround.
 */
Cypress.Commands.add('confirmRegistration', () => {
  cy.request('https://mailhog.127.0.0.1.nip.io/api/v2/messages?limit=50').then(
    (response) => {
      const body = response.body;
      const email = body.items[0];
      const emailBody = email.Content.Body;
      const linkRegex = /(https?:\/\/[^\s]*)/; // regex to match the URL
      const match = emailBody.match(linkRegex); // find the URL
      if (match) {
        const url = match[0];
        cy.request({
          url: url,
          followRedirect: false,
        }).then((response) => {
          expect(response.status).to.eq(302);
          const redirectUrl = response.headers['location'] as string;
          console.log('redirectUrl: ' + redirectUrl);

          cy.request({
            url: redirectUrl,
            followRedirect: false,
          }).then((response) => {
            expect(response.status).to.eq(302);
            const redirectUrl = response.headers['location'] as string;
            console.log('redirectUrl: ' + redirectUrl);
            cy.visit(redirectUrl);
          });
        });
      }
    },
  );
});

Cypress.Commands.add('addNewRecurrentTransaction', (transaction) => {
  getTransactionMenu().click();
  getRecurrentTransactionTab().click();
  getAddRecurrentTransactionButton().click();

  getRecurrentAmountInput().type(transaction.amount, { force: true });
  getRecurrentStartDatePicker().type(transaction.date, { force: true });

  if (transaction.description !== undefined) {
    getRecurrentDescriptionInput().type(transaction.description, {
      force: true,
    });
  }

  getCreateRecurrentTransactionButton().click();
});

Cypress.Commands.add('editRecurrentTransaction', (transaction) => {
  getRecurrentAmountInput().clear().type(transaction.amount, { force: true });
  getRecurrentStartDatePicker().clear().type(transaction.date);
  if (transaction.description !== undefined) {
    getRecurrentDescriptionInput()
      .clear({ force: true })
      .type(transaction.description, { force: true });
  }
});

function doDelete() {
  hasTransactionInTable().then((hasTx) => {
    if (!hasTx) {
      return;
    }
    getFirstDescriptionCell().then(($el) => {
      if ($el.is(':visible')) {
        $el.click();

        getDeleteTransactionButton().click();

        cy.wait('@apiCheck').then((interception) => {
          expect(interception?.response?.statusCode).to.eq(200);
          // Call the function recursively to delete all transactions
          doDelete();
        });
      }
    });
  });
}

function doDeleteRecurrent() {
  hasRecurrentTransactionInTable().then((hasTx) => {
    if (!hasTx) {
      return;
    }
    getFirstDescriptionCell().then(($el) => {
      if ($el.is(':visible')) {
        $el.click();

        getDeleteRecurrentTransactionButton().click();

        cy.wait('@apiCheckRecurrent').then((interception) => {
          expect(interception?.response?.statusCode).to.eq(200);
          // Call the function recursively to delete all transactions
          doDeleteRecurrent();
        });
      }
    });
  });
}
