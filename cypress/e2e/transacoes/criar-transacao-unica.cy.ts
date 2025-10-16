/// <reference types="cypress" />

describe("🧪 Criar Transação Única (Não Recorrente)", () => {
  beforeEach(() => {
    cy.login();
  });

  it("✅ Deve criar transação única com recorrente=false", () => {
    cy.visit("/transacoes/nova");

    cy.get('input[name="descricao"]').type("Almoço no restaurante");
    cy.get('input[name="valorFormatado"]').type("45,50");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");

    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Alimentação").click();

    // NÃO ativar recorrência (manter switch OFF)
    cy.get('button[role="switch"]').should(
      "have.attr",
      "data-state",
      "unchecked"
    );

    cy.intercept("POST", "**/transacoes").as("createTransacao");
    cy.contains("button", "Salvar Transação").click();

    // Verificar que recorrente é FALSE
    cy.wait("@createTransacao").then((interception) => {
      const requestBody = interception.request.body;
      void expect(requestBody.recorrente).to.equal(false);
      void expect(requestBody.tipoRecorrencia).to.be.undefined;
      return requestBody;
    });

    cy.contains("Transação criada com sucesso").should("be.visible");
  });

  it("✅ NÃO deve exibir badge de recorrência", () => {
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("Cinema");
    cy.get('input[name="valorFormatado"]').type("30,00");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");
    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Entretenimento").click();
    cy.intercept("POST", "**/transacoes").as("createTransacao");
    cy.contains("button", "Salvar Transação").click();
    cy.wait("@createTransacao");

    // NÃO deve ter badge FIXA ou PARCELADA
    cy.contains("Cinema")
      .parents("div")
      .within(() => {
        cy.contains("FIXA").should("not.exist");
        cy.contains("PARCELADA").should("not.exist");
      });
  });

  it("✅ Deve validar campos obrigatórios", () => {
    cy.visit("/transacoes/nova");

    // Tentar submeter sem preencher
    cy.contains("button", "Salvar Transação").click();

    // Deve mostrar mensagens de erro
    cy.contains("Descrição é obrigatória").should("be.visible");
    cy.contains("Valor é obrigatório").should("be.visible");
    cy.contains("Categoria é obrigatória").should("be.visible");
  });
});
