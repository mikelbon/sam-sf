import { PagoInput, PagoOutput } from "../types";
import { v4 as uuidv4 } from "uuid";

export const handler = async (event: {Payload: PagoInput}): Promise<{Payload: PagoOutput}> => {
  console.log("Evento recibido:", JSON.stringify(event));
  const { monto, medio, usuarioId } = event.Payload;

  if (medio !== "yape") {
    throw new Error(`Este handler solo procesa pagos con Yape, no con: ${medio}`);
  }

  if (!usuarioId || usuarioId.trim() === "") {
    throw new Error("Usuario no identificado");
  }

  // Simulación de procesamiento de pago
  const referencia = uuidv4(); // Genera una referencia única
  const estado = "aprobado";   // Aquí podrías integrar con el API de Yape si existiera

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
