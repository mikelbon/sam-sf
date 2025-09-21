import { ValidacionPayload, ValidacionOutput } from "../types";

export const handler = async (event: {Payload: ValidacionPayload}): Promise<{Payload: ValidacionOutput}> => {
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
// comentario