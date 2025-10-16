import { Button } from "../../../src/components/ui/button";

describe("Button Component", () => {
  it("should render button with text", () => {
    cy.mount(<Button>Click me</Button>);
    cy.contains("Click me").should("be.visible");
  });

  it("should render different variants", () => {
    cy.mount(<Button variant="default">Default</Button>);
    cy.contains("Default").should("be.visible");

    cy.mount(<Button variant="destructive">Destructive</Button>);
    cy.contains("Destructive").should("be.visible");

    cy.mount(<Button variant="outline">Outline</Button>);
    cy.contains("Outline").should("be.visible");

    cy.mount(<Button variant="ghost">Ghost</Button>);
    cy.contains("Ghost").should("be.visible");
  });

  it("should render different sizes", () => {
    cy.mount(<Button size="sm">Small</Button>);
    cy.contains("Small").should("be.visible");

    cy.mount(<Button size="default">Default</Button>);
    cy.contains("Default").should("be.visible");

    cy.mount(<Button size="lg">Large</Button>);
    cy.contains("Large").should("be.visible");

    cy.mount(<Button size="icon">🎯</Button>);
    cy.contains("🎯").should("be.visible");
  });

  it("should handle click events", () => {
    const onClickSpy = cy.spy().as("onClickSpy");
    cy.mount(<Button onClick={onClickSpy}>Click me</Button>);
    cy.contains("Click me").click();
    cy.get("@onClickSpy").should("have.been.calledOnce");
  });

  it("should be disabled when disabled prop is true", () => {
    cy.mount(<Button disabled>Disabled Button</Button>);
    cy.contains("Disabled Button").should("be.disabled");
  });
});
