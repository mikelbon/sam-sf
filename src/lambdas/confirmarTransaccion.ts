import { ConfirmacionInput, ConfirmacionOutput } from "../types";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { captureAWSv3Client } from "aws-xray-sdk-core";

// Activamos trazabilidad si estás usando X-Ray
const dynamo = captureAWSv3Client(new DynamoDBClient({}));

export const handler = async (event: {Payload:ConfirmacionInput}): Promise<{Payload:ConfirmacionOutput}> => {
  console.log("Evento recibido:", JSON.stringify(event));

  const { estado, medio, usuarioId, referencia } = event.Payload;

  if (estado !== "aprobado") {
    console.error("Estado inválido:", estado);
    throw new Error("Transacción fallida");
  }

  const mensaje = `Transacción confirmada para ${usuarioId} vía ${medio}`;

  const timestamp = new Date().toISOString();

  // Registro en DynamoDB
  await dynamo.send(new PutItemCommand({
    TableName: "Transacciones",
    Item: {
      referencia: { S: referencia },
      medio: { S: medio },
      estado: { S: estado },
      timestamp: { S: timestamp },
      usuarioId: { S: usuarioId ?? "desconocido" }
    }
  }));

  // Respuesta narrativa
  return {
    Payload:{
      confirmado: true,
      referencia,
      medio,
      timestamp
    }
  };
};
