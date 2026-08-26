function toNumber(value, field) {
  if (value === undefined || value === null || String(value).trim() === "") {
    const err = new Error(`El operando "${field}" es obligatorio y debe ser un número válido`);
    err.status = 400;
    err.code = "INVALID_OPERANDS";
    throw err;
  }

  const normalized = String(value).trim().replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n)) {
    const err = new Error(`El operando "${field}" debe ser un número válido`);
    err.status = 400;
    err.code = "INVALID_OPERANDS";
    throw err;
  }
  return n;
}

function parseOperands(src) {
  const payload = src || {};
  return {
    a: toNumber(payload.a, "a"),
    b: toNumber(payload.b, "b")
  };
}

function compute(operation, a, b) {
  switch (operation) {
    case "sum":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      if (b === 0) {
        const err = new Error("No se puede dividir por cero");
        err.status = 400;
        err.code = "DIVISION_BY_ZERO";
        err.a = a;
        err.b = b;
        throw err;
      }
      return a / b;
    default: {
      const err = new Error("Operación no soportada");
      err.status = 404;
      err.code = "UNKNOWN_OPERATION";
      throw err;
    }
  }
}

function formatUptime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

module.exports = { parseOperands, compute, formatUptime, toNumber };
