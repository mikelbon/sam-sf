import { ListTransaccionesInput, Transaccion, DynamoItem } from "../types";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { captureAWSv3Client } from "aws-xray-sdk-core";

// Activamos trazabilidad si estás usando X-Ray
const dynamo = captureAWSv3Client(new DynamoDBClient({}));

export const handler = async (
  event: ListTransaccionesInput
): Promise<Transaccion[]> => {
  const { usuarioId } = event;

  if (!usuarioId?.trim()) {
    throw new Error("usuarioId inválido");
  }

  const result = await dynamo.send(
    new QueryCommand({
      TableName: "Transacciones",
      IndexName: "UsuarioIdIndex", // Asegúrate de tener este GSI creado
      KeyConditionExpression: "usuarioId = :uid",
      ExpressionAttributeValues: {
        ":uid": { S: usuarioId }
      }
    })
  );

  const items = result.Items ?? [];

return items.map((item: DynamoItem): Transaccion => ({
  referencia: item.referencia?.S ?? "sin referencia",
  medio: item.medio?.S ?? "desconocido",
  estado: item.estado?.S ?? "sin estado",
  timestamp: item.timestamp?.S ?? "sin timestamp",
  usuarioId: item.usuarioId?.S ?? "desconocido"
}));

};
