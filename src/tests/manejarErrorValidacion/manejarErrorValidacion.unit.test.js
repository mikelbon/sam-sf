"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const manejarErrorValidacion_1 = require("../../src/lambdas/manejarErrorValidacion");
const aws_sdk_client_mock_1 = require("aws-sdk-client-mock");
const client_sns_1 = require("@aws-sdk/client-sns");
const snsMock = (0, aws_sdk_client_mock_1.mockClient)(client_sns_1.SNSClient);
beforeEach(() => snsMock.reset());
describe("ManejarErrorValidacionFunction", () => {
    it("retorna el errorMessage desde Cause si es parseable", async () => {
        const event = {
            Error: "Error genérico",
            Cause: JSON.stringify({ errorMessage: "Monto inválido" }),
        };
        const result = await (0, manejarErrorValidacion_1.handler)(event);
        expect(result.manejado).toBe(true);
        expect(result.mensaje).toBe("Monto inválido");
    });
    it("retorna Error si Cause no tiene errorMessage", async () => {
        const event = {
            Error: "Error genérico",
            Cause: JSON.stringify({ detalle: "sin mensaje" }),
        };
        const result = await (0, manejarErrorValidacion_1.handler)(event);
        expect(result.mensaje).toBe("Error genérico");
    });
    it("retorna Error si Cause no es parseable", async () => {
        const event = {
            Error: "Error genérico",
            Cause: "<<<malformado>>>",
        };
        const result = await (0, manejarErrorValidacion_1.handler)(event);
        expect(result.mensaje).toBe("Error genérico");
    });
    it("retorna mensaje por defecto si Error no es string", async () => {
        const event = {
            Error: { tipo: "fallo" }, // 👈 cast forzado
            Cause: "",
        };
        const result = await (0, manejarErrorValidacion_1.handler)(event);
        expect(result.mensaje).toBe("Error desconocido");
    });
});
