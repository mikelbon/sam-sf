import { handler } from "../../src/lambdas/confirmarTransaccion";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => ddbMock.reset());

describe("ConfirmarTransaccionFunction", () => {
  it("confirma transacción existente", async () => {
    ddbMock.on(GetCommand).resolves({
      Item: {
        referencia: "TX123",
        estado: "pendiente",
      },
    });

    const event = {
      body: JSON.stringify({ referencia: "TX123" }),
    };

    const result = await handler(event);
    expect(result.Payload.confirmado).toBe(true);
    expect(result.Payload.referencia).toMatch(/^TX\d+/);
    expect(result.Payload.medio).toMatch(/tarjeta|yape/i);
    expect(result.Payload.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it("retorna error si no existe la transacción", async () => {
    ddbMock.on(GetCommand).resolves({});

    const event = {
      body: JSON.stringify({ referencia: "TX999" }),
    };

    const result = await handler(event);

    expect(result.Payload.error).toBe(true);
    expect(result.Payload.referencia).toBe("TX999");
    expect(result.Payload.mensaje).toMatch(/no encontrada/i);
  });
});
