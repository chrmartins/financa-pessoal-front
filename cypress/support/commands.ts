/// <reference types="cypress" />

// ***********************************************
// Custom commands for authentication
// ***********************************************

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login com usuário de teste
       * @example cy.login()
       */
      login(email?: string, senha?: string): Chainable<void>;

      /**
       * Logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;

      /**
       * Aguarda requisição da API terminar
       * @example cy.waitForApi('@getTransacoes')
       */
      waitForApi(alias: string): Chainable<void>;

      /**
       * Encontra elemento por data-cy
       * @example cy.dataCy('submit-button')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Login command
Cypress.Commands.add(
  "login",
  (email = "admin@test.com", senha = "senha123") => {
    cy.session([email, senha], () => {
      cy.visit("/login");
      cy.get('input[type="email"]').type(email);
      cy.get('input[type="password"]').type(senha);
      cy.get('button[type="submit"]').click();

      // Aguardar redirecionamento para dashboard
      cy.url().should("include", "/dashboard");

      // Verificar que token foi salvo
      cy.window().then((win) => {
        const token = win.localStorage.getItem("token");
        void expect(token).to.exist;
        return token;
      });
    });

    // Após session, visitar a página inicial
    cy.visit("/dashboard");
  }
);

// Logout command
Cypress.Commands.add("logout", () => {
  cy.get('[data-cy="user-menu"]').click();
  cy.contains("Sair").click();
  cy.url().should("include", "/login");
});

// Wait for API command
Cypress.Commands.add("waitForApi", (alias: string) => {
  cy.wait(alias).its("response.statusCode").should("eq", 200);
});

// Data-cy selector command
Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
});

export {};
