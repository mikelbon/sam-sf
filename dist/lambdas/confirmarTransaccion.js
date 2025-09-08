"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const aws_xray_sdk_core_1 = require("aws-xray-sdk-core");
// Activamos trazabilidad si estás usando X-Ray
const dynamo = (0, aws_xray_sdk_core_1.captureAWSv3Client)(new client_dynamodb_1.DynamoDBClient({}));
const handler = async (event) => {
    console.log("Evento recibido:", JSON.stringify(event));
    const { estado, medio, usuarioId, referencia } = event.Payload;
    if (estado !== "aprobado") {
        console.error("Estado inválido:", estado);
        throw new Error("Transacción fallida");
    }
    const mensaje = `Transacción confirmada para ${usuarioId} vía ${medio}`;
    const timestamp = new Date().toISOString();
    // Registro en DynamoDB
    await dynamo.send(new client_dynamodb_1.PutItemCommand({
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
        Payload: {
            confirmado: true,
            referencia,
            medio,
            timestamp
        }
    };
};
exports.handler = handler;
