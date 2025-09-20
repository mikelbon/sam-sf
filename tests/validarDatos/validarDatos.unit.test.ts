import { handler } from "../../src/lambdas/validarDatos";

describe("ValidarDatosFunction", () => {
  it("retorna validado si el payload es correcto", async () => {
    const event = {
      Payload: {
        monto: 150,
        medio: "tarjeta",
        usuarioId: "U123",
      },
    };

    const result = await handler(event);
    expect(result.Payload.validado).toBe(true);
    expect(result.Payload.monto).toBe(150);
    expect(result.Payload.medio).toBe("tarjeta");
    expect(result.Payload.usuarioId).toBe("U123");
  });

  it("lanza error si el monto es inválido", async () => {
    const event = {
      Payload: {
        monto: -10,
        medio: "tarjeta",
        usuarioId: "U123",
      },
    };

    await expect(handler(event)).rejects.toThrow("Monto inválido");
  });

  it("lanza error si el medio no es soportado", async () => {
    const event = {
      Payload: {
        monto: 100,
        medio: "efectivo",
        usuarioId: "U123",
      },
    };

    await expect(handler(event)).rejects.toThrow(/Medio de pago no soportado/i);
  });

  it("lanza error si el usuarioId está vacío", async () => {
    const event = {
      Payload: {
        monto: 100,
        medio: "yape",
        usuarioId: "",
      },
    };

    await expect(handler(event)).rejects.toThrow(/Usuario no identificado/i);
  });
});
