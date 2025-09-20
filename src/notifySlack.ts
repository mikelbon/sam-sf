import fs from "fs";
import https from "https";
import path from "path";

const webhookUrl = process.env.SLACK_WEBHOOK_URL;
if (!webhookUrl) throw new Error("SLACK_WEBHOOK_URL no está definido");

const coverageTextPath = path.resolve("coverage", "coverage.txt");
if (!fs.existsSync(coverageTextPath)) {
  console.error(
    "❌ No se encontró coverage.txt. ¿Ejecutaste Jest con --coverage?"
  );
  process.exit(1);
}

const coverageText = fs.readFileSync(coverageTextPath, "utf8");

const message = {
  text:
    `🧪 *Reporte de cobertura de tests*\n` +
    "```" +
    coverageText +
    "```" + // bloque de código para mantener formato
    `\n✅ Repo: \`${process.env.GITHUB_REPOSITORY}\`\n` +
    `🌿 Branch: \`${process.env.GITHUB_REF_NAME}\`\n` +
    `👤 Autor: \`${process.env.GITHUB_ACTOR}\``,
};

const data = JSON.stringify(message);
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
