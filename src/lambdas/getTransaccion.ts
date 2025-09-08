import { GetTransaccionInput, GetTransaccionOutput } from "../types";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { captureAWSv3Client } from "aws-xray-sdk-core";

// Activamos trazabilidad si estás usando X-Ray
const dynamo = captureAWSv3Client(new DynamoDBClient({}));

export const handler = async (event: GetTransaccionInput): Promise<GetTransaccionOutput> => {
  const { referencia } = event;

  if (!referencia || referencia.trim() === "") {
    throw new Error("Referencia inválida");
  }

  const result = await dynamo.send(new GetItemCommand({
    TableName: "Transacciones",
    Key: {
      referencia: { S: referencia }
    }
  }));

  if (!result.Item) {
    throw new Error(`Transacción no encontrada: ${referencia}`);
  }

  return {
    referencia,
    medio: result.Item.medio?.S ?? "desconocido",
    estado: result.Item.estado?.S ?? "sin estado",
    timestamp: result.Item.timestamp?.S ?? "sin timestamp",
    usuarioId: result.Item.usuarioId?.S ?? "desconocido"
  };
};
