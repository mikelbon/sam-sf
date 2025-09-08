"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const uuid_1 = require("uuid");
const handler = async (event) => {
    console.log("Evento recibido:", JSON.stringify(event));
    const { monto, medio, usuarioId } = event.Payload;
    if (medio !== "yape") {
        throw new Error(`Este handler solo procesa pagos con Yape, no con: ${medio}`);
    }
    if (!usuarioId || usuarioId.trim() === "") {
        throw new Error("Usuario no identificado");
    }
    // Simulación de procesamiento de pago
    const referencia = (0, uuid_1.v4)(); // Genera una referencia única
    const estado = "aprobado"; // Aquí podrías integrar con el API de Yape si existiera
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
