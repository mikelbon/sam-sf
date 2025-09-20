import fs from "fs";
import https from "https";

const webhookUrl = process.env.SLACK_WEBHOOK_URL;
if (!webhookUrl) throw new Error("SLACK_WEBHOOK_URL no está definido");

const coveragePath = path.resolve("coverage", "coverage-summary.json");
if (!fs.existsSync(coveragePath)) {
  console.error(
    "❌ No se encontró coverage-summary.json. ¿Ejecutaste Jest con --coverage?"
  );
  process.exit(1);
}
const coverageRaw = fs.readFileSync(coveragePath, "utf8");
const coverage = JSON.parse(coverageRaw);

const { lines, branches, functions, statements } = coverage.total;

const message = {
  text:
    `🧪 *Tests completados*\n` +
    `📊 *Cobertura:*\n` +
    `• Líneas: ${lines.pct}%\n` +
    `• Branches: ${branches.pct}%\n` +
    `• Funciones: ${functions.pct}%\n` +
    `• Statements: ${statements.pct}%\n` +
    `✅ Repo: \`${process.env.GITHUB_REPOSITORY}\`\n` +
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
