"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    const { Error, Cause } = event;
    let mensaje = typeof Error === "string" ? Error : "Error desconocido";
    try {
        if (Cause && typeof Cause === "string") {
            const causa = JSON.parse(Cause);
            mensaje = causa?.errorMessage ?? mensaje;
        }
    }
    catch {
        console.warn("No se pudo parsear Cause:", Cause);
    }
    // Aquí podrías loguear el error, enviarlo a SNS, o simplemente devolverlo
    return {
        manejado: true,
        mensaje,
    };
};
exports.handler = handler;
