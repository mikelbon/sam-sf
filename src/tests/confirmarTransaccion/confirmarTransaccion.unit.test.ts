import { handler } from "../../lambdas/confirmarTransaccion";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ConfirmacionInput } from "../../types";

const ddbMock = mockClient(DynamoDBClient);

beforeEach(() => ddbMock.reset());

describe("ConfirmarTransaccionFunction", () => {
  beforeEach(() => ddbMock.reset());

  it("confirma transacción válida y registra en DynamoDB", async () => {
    ddbMock.on(PutItemCommand).resolves({});

    const event: { Payload: ConfirmacionInput } = {
      Payload: {
        referencia: "TX123",
        medio: "tarjeta",
        estado: "aprobado",
        usuarioId: "U456",
      },
    };

    const result = await handler(event);

    expect(result.Payload.confirmado).toBe(true);
    expect(result.Payload.referencia).toBe("TX123");
    expect(result.Payload.medio).toBe("tarjeta");
    expect(result.Payload.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);

    const calls = ddbMock.commandCalls(PutItemCommand);
    expect(calls.length).toBe(1);
    expect(calls[0].args[0].input).toEqual(
      expect.objectContaining({
        TableName: "Transacciones",
        Item: expect.objectContaining({
          referencia: { S: "TX123" },
          medio: { S: "tarjeta" },
          estado: { S: "aprobado" },
          usuarioId: { S: "U456" },
        }),
      })
    );
  });

  it("lanza error si el estado no es aprobado", async () => {
    const event: { Payload: ConfirmacionInput } = {
      Payload: {
        referencia: "TX999",
        medio: "yape",
        estado: "rechazado",
        usuarioId: "U789",
      },
    };

    await expect(handler(event)).rejects.toThrow("Transacción fallida");
  });
});
