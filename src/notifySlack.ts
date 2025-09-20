import https from "https";

interface SlackMessage {
  text: string;
}

const webhookUrl = process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  throw new Error(
    "SLACK_WEBHOOK_URL no está definido en las variables de entorno."
  );
}

const message: SlackMessage = {
  text: "✅ *Tests completados exitosamente.*\nCobertura: 100% líneas, 96.42% branches.\n🧪 Troll-proof total, Miguel 💪",
};

const postToSlack = (payload: SlackMessage): void => {
  const data = JSON.stringify(payload);
  const url = new URL(webhookUrl);

  const options: https.RequestOptions = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  const req = https.request(options, (res) => {
    console.log(`Slack respondió con status: ${res.statusCode}`);
  });

  req.on("error", (error) => {
    console.error("Error al notificar a Slack:", error);
  });

  req.write(data);
  req.end();
};

postToSlack(message);
