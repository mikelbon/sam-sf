"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagoConTarjeta_1 = require("../../src/lambdas/pagoConTarjeta");
describe("PagoConTarjetaFunction", () => {
    it("procesa pago exitoso con tarjeta válida", async () => {
        const event = {
            Payload: {
                monto: 150,
                medio: "tarjeta",
                usuarioId: "U123",
            },
        };
        const result = await (0, pagoConTarjeta_1.handler)(event);
        expect(result.Payload.referencia).toMatch(/[a-f0-9\-]{36}/); // UUID v4
        expect(result.Payload.estado).toBe("aprobado");
        expect(result.Payload.medio).toBe("tarjeta");
        expect(result.Payload.monto).toBe(150);
        expect(result.Payload.usuarioId).toBe("U123");
    });
    it("lanza error si el medio no es tarjeta", async () => {
        const event = {
            Payload: {
                monto: 150,
                medio: "yape",
                usuarioId: "U123",
            },
        };
        await expect((0, pagoConTarjeta_1.handler)(event)).rejects.toThrow("Medio de pago no soportado por este handler: yape");
    });
    it("lanza error si el usuario no está identificado", async () => {
        const event = {
            Payload: {
                monto: 150,
                medio: "tarjeta",
                usuarioId: "",
            },
        };
        await expect((0, pagoConTarjeta_1.handler)(event)).rejects.toThrow("Usuario no identificado");
    });
});
