const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const MAX_STORED = 100;

class OperationStore {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.historyFile = path.join(dataDir, "operations.json");
    this.errorLog = path.join(dataDir, "errors.log");
    this.queue = Promise.resolve();
  }

  async init() {
    await fsp.mkdir(this.dataDir, { recursive: true });
    try {
      await fsp.access(this.historyFile, fs.constants.F_OK);
    } catch {
      await fsp.writeFile(this.historyFile, "[]", "utf8");
    }
  }

  withLock(fn) {
    const run = this.queue.then(fn, fn);
    this.queue = run.then(() => undefined, () => undefined);
    return run;
  }

  async readAll() {
    try {
      const raw = await fsp.readFile(this.historyFile, "utf8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async save(entry) {
    return this.withLock(async () => {
      const items = await this.readAll();
      items.unshift(entry);
      const trimmed = items.slice(0, MAX_STORED);
      await fsp.writeFile(this.historyFile, JSON.stringify(trimmed, null, 2), "utf8");
      return entry;
    });
  }

  async last(limit = 5) {
    const items = await this.readAll();
    return items.slice(0, limit);
  }

  async logError(message) {
    const line = `${new Date().toISOString()} [ERROR] ${message}\n`;
    console.error(line.trim());
    try {
      await fsp.appendFile(this.errorLog, line, "utf8");
    } catch (err) {
      console.error("No se pudo escribir el log de errores:", err.message);
    }
  }

  async isWritable() {
    try {
      await fsp.access(this.dataDir, fs.constants.W_OK);
      const probe = path.join(this.dataDir, ".write-probe");
      await fsp.writeFile(probe, String(Date.now()), "utf8");
      await fsp.unlink(probe);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { OperationStore };
