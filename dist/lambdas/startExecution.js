"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_sfn_1 = require("@aws-sdk/client-sfn");
const client = new client_sfn_1.SFNClient();
const handler = async (event) => {
    console.log("Payload recibido:", event.body);
    try {
        const input = JSON.parse(event.body || "{}");
        const command = new client_sfn_1.StartExecutionCommand({
            stateMachineArn: process.env.STATE_MACHINE_ARN,
            input: JSON.stringify(input),
        });
        const response = await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Ejecución iniciada",
                executionArn: response.executionArn,
                startDate: response.startDate,
            }),
        };
    }
    catch (err) {
        console.error("Error al iniciar la ejecución:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al iniciar la ejecución" }),
        };
    }
};
exports.handler = handler;
