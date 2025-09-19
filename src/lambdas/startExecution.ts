import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
const client = new SFNClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Payload recibido:", event.body);
  try {
    const input = JSON.parse(event.body || "{}");

    const command = new StartExecutionCommand({
      stateMachineArn: process.env.STATE_MACHINE_ARN,
      input: JSON.stringify(input),
    });

    const response = await client.send(command);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({
        message: "Ejecución iniciada",
        executionArn: response.executionArn,
        startDate: response.startDate,
      }),
    };
  } catch (err) {
    console.error("Error al iniciar la ejecución:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al iniciar la ejecución" }),
    };
  }
};
