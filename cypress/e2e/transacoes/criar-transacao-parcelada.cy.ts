/// <reference types="cypress" />

describe("🧪 Criar Transação Recorrente PARCELADA", () => {
  beforeEach(() => {
    cy.login();
  });

  it("✅ Deve criar transação PARCELADA com recorrente=true", () => {
    cy.visit("/transacoes/nova");

    // Preencher formulário
    cy.get('input[name="descricao"]').type("Geladeira Brastemp");
    cy.get('input[name="valorFormatado"]').type("2.500,00");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");

    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Casa").click();

    // Ativar recorrência
    cy.get('button[role="switch"]').click();

    // Selecionar PARCELADA
    cy.get("select").eq(0).select("PARCELADA");

    // Definir quantidade de parcelas
    cy.get("select").eq(1).select("10");

    cy.intercept("POST", "**/transacoes").as("createTransacao");
    cy.contains("button", "Salvar Transação").click();

    // Verificar payload
    cy.wait("@createTransacao").then((interception) => {
      const requestBody = interception.request.body;

      expect(requestBody.recorrente).to.equal(
        true,
        "❌ BUG: recorrente deve ser TRUE para parceladas!"
      );
      expect(requestBody.tipoRecorrencia).to.equal("PARCELADA");
      expect(requestBody.quantidadeParcelas).to.equal(10);
    });

    cy.contains("Transação criada com sucesso").should("be.visible");
  });

  it("✅ Deve exibir parcela atual (1/10, 2/10, etc)", () => {
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("TV Samsung");
    cy.get('input[name="valorFormatado"]').type("3.000,00");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");
    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Casa").click();
    cy.get('button[role="switch"]').click();
    cy.get("select").eq(0).select("PARCELADA");
    cy.get("select").eq(1).select("12");
    cy.intercept("POST", "**/transacoes").as("createTransacao");
    cy.contains("button", "Salvar Transação").click();
    cy.wait("@createTransacao");

    // Verificar badge da parcela
    cy.contains("TV Samsung")
      .parents("div")
      .within(() => {
        cy.contains("1/12").should("be.visible");
      });
  });

  it("✅ Deve criar parcelas nos próximos meses", () => {
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("Notebook Dell");
    cy.get('input[name="valorFormatado"]').type("4.000,00");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");
    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Casa").click();
    cy.get('button[role="switch"]').click();
    cy.get("select").eq(0).select("PARCELADA");
    cy.get("select").eq(1).select("6");
    cy.intercept("POST", "**/transacoes").as("createTransacao");
    cy.contains("button", "Salvar Transação").click();
    cy.wait("@createTransacao");

    // Navegar para próximo mês
    cy.visit("/transacoes");
    cy.get('button[aria-label="Próximo mês"]').click();
    cy.wait(1000);

    // Deve aparecer parcela 2/6
    cy.contains("Notebook Dell").should("be.visible");
    cy.contains("2/6").should("be.visible");
  });
});
