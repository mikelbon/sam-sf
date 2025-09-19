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

    const result = await handler(event as any);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).estado).toBe("confirmado");
  });

  it("retorna error si no existe la transacción", async () => {
    ddbMock.on(GetCommand).resolves({});

    const event = {
      body: JSON.stringify({ referencia: "TX999" }),
    };

    const result = await handler(event as any);
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).mensaje).toMatch(/no encontrada/i);
  });
});
