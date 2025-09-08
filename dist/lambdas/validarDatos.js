"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    const { monto, medio, usuarioId } = event.Payload;
    console.log(event.Payload);
    const montoNum = Number(monto);
    console.log("montoNum", montoNum);
    if (isNaN(montoNum) || montoNum <= 0) {
        console.error("Monto inválido:", monto);
        throw new Error("Monto inválido");
    }
    if (!["tarjeta", "yape"].includes(medio)) {
        console.error("Medio no soportado:", medio);
        throw new Error(`Medio de pago no soportado: ${medio}`);
    }
    if (!usuarioId || usuarioId.trim() === "") {
        console.error("Usuario no identificado:", usuarioId);
        throw new Error("Usuario no identificado");
    }
    return {
        Payload: {
            validado: true,
            monto: montoNum,
            medio,
            usuarioId
        }
    };
};
exports.handler = handler;
