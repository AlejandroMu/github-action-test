const express = require("express");
const path = require("path");
const { parseOperands, compute, formatUptime } = require("./calc");
const { OperationStore } = require("./store");

const PORT = Number(process.env.PORT || 3001);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const startedAt = Date.now();
const store = new OperationStore(DATA_DIR);

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

function source(req) {
  if (req.method === "GET") return req.query;
  return { ...(req.query || {}), ...(req.body || {}) };
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function registerOperation(route, operation) {
  const handler = asyncHandler(async (req, res) => {
    const { a, b } = parseOperands(source(req));
    const result = compute(operation, a, b);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      operation,
      a,
      b,
      result,
      timestamp: new Date().toISOString()
    };
    await store.save(entry);
    console.log(`[INFO] ${entry.timestamp} ${operation}(${a}, ${b}) = ${result}`);
    res.json(entry);
  });

  app.get(route, handler);
  app.post(route, handler);
}

registerOperation("/sum", "sum");
registerOperation("/subtract", "subtract");
registerOperation("/multiply", "multiply");
registerOperation("/divide", "divide");

app.get("/history", asyncHandler(async (_req, res) => {
  const items = await store.last(5);
  res.json({ items, count: items.length });
}));

app.get("/health", asyncHandler(async (_req, res) => {
  const persistenceWritable = await store.isWritable();
  const uptime = (Date.now() - startedAt) / 1000;
  res.json({
    status: persistenceWritable ? "ok" : "degraded",
    service: "backend",
    uptime,
    uptimeHuman: formatUptime(uptime),
    persistenceWritable,
    persistencePath: DATA_DIR
  });
}));

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "El cuerpo de la petición no es un JSON válido",
      code: "INVALID_JSON"
    });
  }

  const status = err.status || 500;
  if (err.code === "DIVISION_BY_ZERO") {
    store.logError(`${err.code}: ${err.message} a=${err.a} b=${err.b}`);
  } else {
    console.error(`[ERROR] ${err.code || "INTERNAL_ERROR"}: ${err.message}`);
  }
  res.status(status).json({
    error: err.message || "Error interno del servidor",
    code: err.code || "INTERNAL_ERROR"
  });
});

store.init().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend escuchando en el puerto ${PORT}`);
    console.log(`Persistencia SoR en ${DATA_DIR}`);
  });
}).catch((err) => {
  console.error("No se pudo inicializar la persistencia:", err);
  process.exit(1);
});
