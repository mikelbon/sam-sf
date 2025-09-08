"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const handler = async (event) => {
    console.log("Evento recibido:", JSON.stringify(event));
    const { monto, medio, usuarioId } = event.Payload;
    if (medio !== "tarjeta") {
        throw new Error(`Medio de pago no soportado por este handler: ${medio}`);
    }
    if (!usuarioId || usuarioId.trim() === "") {
        throw new Error("Usuario no identificado");
    }
    // Simulación de procesamiento de pago
    const referencia = (0, uuid_1.v4)(); // Genera una referencia única
    const estado = "aprobado"; // Aquí podrías integrar con un gateway real
    return {
        Payload: {
            referencia,
            estado,
            medio,
            monto,
            usuarioId
        }
    };
};
exports.handler = handler;
