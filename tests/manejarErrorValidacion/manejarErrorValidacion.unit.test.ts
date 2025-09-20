import { handler } from "../../src/lambdas/manejarErrorValidacion";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsMock = mockClient(SNSClient);

beforeEach(() => snsMock.reset());

describe("ManejarErrorValidacionFunction", () => {
  it("retorna el errorMessage desde Cause si es parseable", async () => {
    const event = {
      Error: "Error genérico",
      Cause: JSON.stringify({ errorMessage: "Monto inválido" }),
    };

    const result = await handler(event);
    expect(result.manejado).toBe(true);
    expect(result.mensaje).toBe("Monto inválido");
  });

  it("retorna Error si Cause no tiene errorMessage", async () => {
    const event = {
      Error: "Error genérico",
      Cause: JSON.stringify({ detalle: "sin mensaje" }),
    };

    const result = await handler(event);
    expect(result.mensaje).toBe("Error genérico");
  });

  it("retorna Error si Cause no es parseable", async () => {
    const event = {
      Error: "Error genérico",
      Cause: "<<<malformado>>>",
    };

    const result = await handler(event);
    expect(result.mensaje).toBe("Error genérico");
  });

  it("retorna mensaje por defecto si Error no es string", async () => {
    const event = {
      Error: { tipo: "fallo" },
      Cause: "",
    };

    const result = await handler(event);
    expect(result.mensaje).toBe("Error desconocido");
  });
});
