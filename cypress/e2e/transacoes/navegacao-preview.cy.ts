/// <reference types="cypress" />

describe("🧪 Navegação entre Meses e Preview de Transações", () => {
  beforeEach(() => {
    cy.login();
  });

  it("✅ Deve navegar para próximo mês", () => {
    cy.visit("/transacoes");

    // Capturar mês atual
    cy.get("h2").invoke("text").as("mesAtual");

    // Clicar em próximo mês
    cy.get('button[aria-label="Próximo mês"]').click();
    cy.wait(500);

    // Verificar que mudou
    cy.get("@mesAtual").then((mesAtual) => {
      cy.get("h2").invoke("text").should("not.equal", mesAtual);
    });
  });

  it("✅ Deve navegar para mês anterior", () => {
    cy.visit("/transacoes");

    cy.get("h2").invoke("text").as("mesAtual");

    cy.get('button[aria-label="Mês anterior"]').click();
    cy.wait(500);

    cy.get("@mesAtual").then((mesAtual) => {
      cy.get("h2").invoke("text").should("not.equal", mesAtual);
    });
  });

  it("✅ Deve voltar para mês atual", () => {
    cy.visit("/transacoes");

    // Navegar para outro mês
    cy.get('button[aria-label="Próximo mês"]').click();
    cy.wait(500);

    // Clicar em "Mês Atual"
    cy.contains("button", "Mês Atual").click();
    cy.wait(500);

    // Verificar que está em outubro 2025
    cy.contains("outubro de 2025", { matchCase: false }).should("be.visible");
  });

  it("✅ Deve exibir transações PREVIEW após 12 meses", () => {
    // Criar transação recorrente FIXA
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("Disney Plus Preview Test");
    cy.get('input[name="valorFormatado"]').type("49,90");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");
    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Assinaturas").click();
    cy.get('button[role="switch"]').click();
    cy.get("select").eq(0).select("FIXA");
    cy.get("select").eq(1).select("MENSAL");
    cy.intercept("POST", "**/transacoes").as("createTransacao");
    cy.contains("button", "Salvar Transação").click();
    cy.wait("@createTransacao");

    // Navegar 13 meses para frente
    cy.visit("/transacoes");
    for (let i = 0; i < 13; i++) {
      cy.get('button[aria-label="Próximo mês"]').click();
      cy.wait(300);
    }

    // Verificar que aparece como PREVIEW (border amarelo)
    cy.contains("Disney Plus Preview Test")
      .parents("div")
      .should("have.class", "border-amber-500");
  });

  it("✅ Deve exibir badge [PREVISÃO] em transações futuras", () => {
    // Criar transação
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("YouTube Premium Preview");
    cy.get('input[name="valorFormatado"]').type("29,90");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");
    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Assinaturas").click();
    cy.get('button[role="switch"]').click();
    cy.get("select").eq(0).select("FIXA");
    cy.get("select").eq(1).select("MENSAL");
    cy.intercept("POST", "**/transacoes").as("createTransacao");
    cy.contains("button", "Salvar Transação").click();
    cy.wait("@createTransacao");

    // Navegar para futuro
    cy.visit("/transacoes");
    for (let i = 0; i < 15; i++) {
      cy.get('button[aria-label="Próximo mês"]').click();
      cy.wait(300);
    }

    // Verificar badge
    cy.contains("YouTube Premium Preview")
      .parents("div")
      .within(() => {
        cy.contains("PREVISÃO").should("be.visible");
      });
  });

  it("❌ NÃO deve permitir editar transação PREVIEW", () => {
    // Criar transação
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("HBO Max Preview Test");
    cy.get('input[name="valorFormatado"]').type("34,90");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");
    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Assinaturas").click();
    cy.get('button[role="switch"]').click();
    cy.get("select").eq(0).select("FIXA");
    cy.get("select").eq(1).select("MENSAL");
    cy.intercept("POST", "**/transacoes").as("createTransacao");
    cy.contains("button", "Salvar Transação").click();
    cy.wait("@createTransacao");

    // Ir para mês futuro
    cy.visit("/transacoes");
    for (let i = 0; i < 13; i++) {
      cy.get('button[aria-label="Próximo mês"]').click();
      cy.wait(300);
    }

    // Botão de editar deve estar desabilitado
    cy.contains("HBO Max Preview Test")
      .parents("div")
      .within(() => {
        cy.get('button[aria-label="Editar"]').should("be.disabled");
      });
  });
});
