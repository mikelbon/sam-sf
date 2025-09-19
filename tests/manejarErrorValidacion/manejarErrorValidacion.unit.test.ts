import { handler } from "../../src/lambdas/manejarErrorValidacion";
import { mockClient } from "aws-sdk-client-mock";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsMock = mockClient(SNSClient);

beforeEach(() => snsMock.reset());

describe("ManejarErrorValidacionFunction", () => {
  it("publica mensaje en SNS", async () => {
    snsMock.on(PublishCommand).resolves({ MessageId: "msg-123" });

    const event = {
      body: JSON.stringify({ error: "Validación fallida", usuarioId: "U123" }),
    };

    const result = await handler(event as any);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).mensaje).toMatch(/notificado/i);
  });
});
