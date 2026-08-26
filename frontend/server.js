const express = require("express");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:3001";
const startedAt = Date.now();

const app = express();
app.disable("x-powered-by");

function formatUptime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

app.get("/status", async (_req, res) => {
  const uptime = (Date.now() - startedAt) / 1000;
  let persistenceWritable = false;
  let backend = { status: "down" };

  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      signal: AbortSignal.timeout(2500)
    });
    backend = await response.json();
    persistenceWritable = Boolean(backend.persistenceWritable);
  } catch (err) {
    backend = { status: "down", error: err.message };
  }

  res.json({
    status: "ok",
    service: "frontend",
    uptime,
    uptimeHuman: formatUptime(uptime),
    persistenceWritable,
    backend
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return next();
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend escuchando en el puerto ${PORT}`);
});
