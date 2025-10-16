/// <reference types="cypress" />

describe("🧪 Criar Transação Recorrente FIXA - Bug do campo recorrente", () => {
  beforeEach(() => {
    // Login antes de cada teste
    cy.login();
  });

  it("✅ Deve criar transação recorrente FIXA com recorrente=true", () => {
    // Navegar para página de nova transação
    cy.visit("/transacoes/nova");

    // Aguardar página carregar
    cy.contains("Nova Transação").should("be.visible");

    // Preencher formulário
    cy.get('input[name="descricao"]').type("Netflix");
    cy.get('input[name="valorFormatado"]').type("59,90");
    cy.get('input[name="dataTransacao"]').type("2025-10-16");

    // Selecionar tipo DESPESA (já vem selecionado por padrão)
    cy.contains("button", "Despesa").should("have.class", "bg-red-600");

    // Selecionar categoria
    cy.get('button[role="combobox"]')
      .contains("Selecione uma categoria")
      .click();
    cy.contains("Assinaturas").click();

    // ⭐ CRÍTICO: Ativar recorrência
    cy.get('button[role="switch"]').click();
    cy.get('button[role="switch"]').should(
      "have.attr",
      "data-state",
      "checked"
    );

    // Verificar que campos de recorrência apareceram
    cy.contains("Tipo de Recorrência").should("be.visible");

    // Selecionar tipo FIXA
    cy.get("select").eq(0).select("FIXA");

    // Selecionar frequência MENSAL
    cy.get("select").eq(1).select("MENSAL");

    // Adicionar observação
    cy.get('textarea[name="observacoes"]').type(
      "Assinatura mensal - Teste Cypress"
    );

    // Interceptar requisição POST
    cy.intercept("POST", "**/transacoes").as("createTransacao");

    // Submeter formulário
    cy.contains("button", "Salvar Transação").click();

    // ✅ Aguardar requisição e verificar payload
    cy.wait("@createTransacao").then((interception) => {
      const requestBody = interception.request.body;

      // 🔍 VERIFICAÇÃO CRÍTICA: recorrente deve ser TRUE
      expect(requestBody.recorrente).to.equal(
        true,
        "❌ BUG: Campo recorrente está FALSE quando deveria ser TRUE!"
      );

      expect(requestBody.tipoRecorrencia).to.equal("FIXA");
      expect(requestBody.frequencia).to.equal("MENSAL");
      expect(requestBody.descricao).to.equal("Netflix");
    });

    // Verificar toast de sucesso
    cy.contains("Transação criada com sucesso", { timeout: 10000 }).should(
      "be.visible"
    );

    // Verificar redirecionamento para lista
    cy.url().should("include", "/transacoes");

    // Verificar que Netflix aparece na lista
    cy.contains("Netflix").should("be.visible");
  });

  it("✅ Deve exibir badge de transação FIXA na lista", () => {
    // Criar transação primeiro
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("Spotify");
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

    // Verificar na lista
    cy.url().should("include", "/transacoes");
    cy.contains("Spotify")
      .parents("div")
      .within(() => {
        // Deve ter badge FIXA
        cy.contains("FIXA").should("be.visible");
      });
  });

  it("✅ Deve criar preview nos próximos 12+ meses (FIXA)", () => {
    // Criar transação recorrente
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("Apple Cloud");
    cy.get('input[name="valorFormatado"]').type("9,90");
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

    // Navegar para mês futuro (13 meses à frente - Novembro 2026)
    cy.visit("/transacoes");

    // Clicar no botão de avançar mês 13 vezes
    for (let i = 0; i < 13; i++) {
      cy.get('button[aria-label="Próximo mês"]').click();
      cy.wait(500); // Aguardar carregar
    }

    // Verificar que Apple Cloud aparece como PREVISÃO
    cy.contains("Apple Cloud", { timeout: 10000 }).should("be.visible");

    // Verificar que tem marcação de preview (border amarelo ou badge)
    cy.contains("Apple Cloud")
      .parents("div")
      .should("have.class", "border-l-4");
  });

  it("❌ NÃO deve criar preview em meses < 12 meses", () => {
    // Criar transação recorrente
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("GitHub Pro");
    cy.get('input[name="valorFormatado"]').type("49,00");
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

    // Navegar para mês futuro (6 meses à frente - Abril 2026)
    cy.visit("/transacoes");

    for (let i = 0; i < 6; i++) {
      cy.get('button[aria-label="Próximo mês"]').click();
      cy.wait(500);
    }

    // GitHub Pro NÃO deve aparecer (sem preview)
    cy.contains("GitHub Pro").should("not.exist");
  });

  it("✅ Deve permitir editar transação recorrente", () => {
    // Criar transação primeiro
    cy.visit("/transacoes/nova");
    cy.get('input[name="descricao"]').type("Amazon Prime");
    cy.get('input[name="valorFormatado"]').type("14,90");
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

    // Editar
    cy.contains("Amazon Prime")
      .parents("div")
      .within(() => {
        cy.get('button[aria-label="Editar"]').click();
      });

    // Verificar que campos de recorrência estão preenchidos
    cy.get('button[role="switch"]').should(
      "have.attr",
      "data-state",
      "checked"
    );
    cy.get("select").eq(0).should("have.value", "FIXA");

    // Alterar valor
    cy.get('input[name="valorFormatado"]').clear().type("19,90");

    cy.intercept("PUT", "**/transacoes/**").as("updateTransacao");
    cy.contains("button", "Salvar Transação").click();
    cy.wait("@updateTransacao");

    // Verificar atualização
    cy.contains("19,90").should("be.visible");
  });
});
