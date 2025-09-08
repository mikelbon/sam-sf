"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const aws_xray_sdk_core_1 = require("aws-xray-sdk-core");
// Activamos trazabilidad si estás usando X-Ray
const dynamo = (0, aws_xray_sdk_core_1.captureAWSv3Client)(new client_dynamodb_1.DynamoDBClient({}));
const handler = async (event) => {
    const { usuarioId } = event;
    if (!usuarioId?.trim()) {
        throw new Error("usuarioId inválido");
    }
    const result = await dynamo.send(new client_dynamodb_1.QueryCommand({
        TableName: "Transacciones",
        IndexName: "UsuarioIdIndex", // Asegúrate de tener este GSI creado
        KeyConditionExpression: "usuarioId = :uid",
        ExpressionAttributeValues: {
            ":uid": { S: usuarioId }
        }
    }));
    const items = result.Items ?? [];
    return items.map((item) => ({
        referencia: item.referencia?.S ?? "sin referencia",
        medio: item.medio?.S ?? "desconocido",
        estado: item.estado?.S ?? "sin estado",
        timestamp: item.timestamp?.S ?? "sin timestamp",
        usuarioId: item.usuarioId?.S ?? "desconocido"
    }));
};
exports.handler = handler;
