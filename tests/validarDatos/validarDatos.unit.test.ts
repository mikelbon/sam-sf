import { handler } from "../../src/lambdas/validarDatos";

describe("ValidarDatosFunction", () => {
  it("debe retornar OK si el payload es válido", async () => {
    const event = {
      body: JSON.stringify({
        alumnoId: "123",
        monto: 100,
        metodo: "tarjeta",
      }),
    };

    const result = await handler(event);
    expect(result.Payload.estado).toBe('validado');
  });

  it("debe retornar error si falta alumnoId", async () => {
    const event = {
      body: JSON.stringify({
        monto: 100,
        metodo: "tarjeta",
      }),
    };

    const result = await handler(event as any);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).mensaje).toMatch(/alumnoId requerido/i);
  });
});
