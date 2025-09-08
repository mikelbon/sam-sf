"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const aws_xray_sdk_core_1 = require("aws-xray-sdk-core");
// Activamos trazabilidad si estás usando X-Ray
const dynamo = (0, aws_xray_sdk_core_1.captureAWSv3Client)(new client_dynamodb_1.DynamoDBClient({}));
const handler = async (event) => {
    const { referencia } = event;
    if (!referencia || referencia.trim() === "") {
        throw new Error("Referencia inválida");
    }
    const result = await dynamo.send(new client_dynamodb_1.GetItemCommand({
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
exports.handler = handler;
