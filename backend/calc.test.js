const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { parseOperands, compute } = require("./calc");

describe("parseOperands", () => {
  it("acepta números válidos", () => {
    assert.deepEqual(parseOperands({ a: "2", b: "3.5" }), { a: 2, b: 3.5 });
  });

  it("acepta coma decimal", () => {
    assert.deepEqual(parseOperands({ a: "1,5", b: "2" }), { a: 1.5, b: 2 });
  });

  it("rechaza operandos vacíos", () => {
    assert.throws(
      () => parseOperands({ a: "", b: "1" }),
      (err) => err.status === 400 && err.code === "INVALID_OPERANDS"
    );
  });
});

describe("compute", () => {
  it("suma", () => assert.equal(compute("sum", 2, 3), 5));
  it("resta", () => assert.equal(compute("subtract", 10, 4), 6));
  it("multiplica", () => assert.equal(compute("multiply", 3, 7), 21));
  it("divide", () => assert.equal(compute("divide", 9, 3), 3));

  it("retorna error 400 al dividir por cero", () => {
    assert.throws(
      () => compute("divide", 10, 0),
      (err) => err.status === 400 && err.code === "DIVISION_BY_ZERO"
    );
  });
});
