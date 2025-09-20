import { handler } from "../../src/lambdas/confirmarTransaccion";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ConfirmacionInput } from "../../src/types";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => ddbMock.reset());

describe("ConfirmarTransaccionFunction", () => {
  beforeEach(() => ddbMock.reset());

  it("confirma transacción válida y registra en DynamoDB", async () => {
    ddbMock.on(PutItemCommand).resolves({});

    const event: { Payload: ConfirmacionInput } = {
      Payload: {
        referencia: "TX123",
        medio: "tarjeta",
        estado: "aprobado", // ✅ literal
        usuarioId: "U456",
      },
    };

    const result = await handler(event);

    expect(result.Payload.confirmado).toBe(true);
    expect(result.Payload.referencia).toBe("TX123");
    expect(result.Payload.medio).toBe("tarjeta");
    expect(result.Payload.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);

    expect(ddbMock).toHaveReceivedCommandWith(PutItemCommand, {
      TableName: "Transacciones",
      Item: expect.objectContaining({
        referencia: { S: "TX123" },
        medio: { S: "tarjeta" },
        estado: { S: "aprobado" },
        usuarioId: { S: "U456" },
      }),
    });
  });

  it("lanza error si el estado no es aprobado", async () => {
    const event: { Payload: ConfirmacionInput } = {
      Payload: {
        referencia: "TX999",
        medio: "yape",
        estado: "pendiente",
        usuarioId: "U789",
      },
    };

    await expect(handler(event)).rejects.toThrow("Transacción fallida");
  });
});
