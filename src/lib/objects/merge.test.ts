import { describe, it, expect } from "vitest";
import { merge } from "./merge";

describe("merge function", () => {
  it("should merge two simple objects", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 3, c: 4 };
    const result = merge([obj1, obj2]);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("should merge nested objects", () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { c: 2 } };
    const result = merge([obj1, obj2]);
    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it("should overwrite with the rightmost object", () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    const result = merge([obj1, obj2]);
    expect(result).toEqual({ a: 2 });
  });

  it("should handle multiple objects", () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const obj3 = { c: 3 };
    const result = merge([obj1, obj2, obj3]);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should handle empty objects", () => {
    const obj1 = {};
    const obj2 = { a: 1 };
    const result = merge([obj1, obj2]);
    expect(result).toEqual({ a: 1 });
  });

  it("should merge complex objects properly", () => {
    const obj1 = {
      a: 1,
      b: {
        c: 2,
        d: 3,
      },
    };
    const obj2 = {
      a: 4,
      b: {
        c: 5,
        e: 6,
      },
    };
    const result = merge([obj1, obj2]);
    expect(result).toEqual({
      a: 4,
      b: { c: 5, d: 3, e: 6 },
    });
  });

  it("should merge arrays by concatenation if not specified", () => {
    const obj1 = { a: [1, 2] };
    const obj2 = { a: [3, 4] };
    const result = merge([obj1, obj2]);
    expect(result).toEqual({ a: [1, 2, 3, 4] });
  });

  it("should merge arrays and override if specified", () => {
    const obj1 = { a: [1, 2] };
    const obj2 = { a: [3, 4] };
    const result = merge([obj1, obj2], { overrideArrays: true });
    expect(result).toEqual({ a: [3, 4] });
  });

  it("should handle deeply nested objects", () => {
    const obj1 = {
      a: {
        b: {
          c: 1,
          d: 2,
        },
      },
    };
    const obj2 = {
      a: {
        b: {
          c: 3,
          e: 4,
        },
      },
    };
    const result = merge([obj1, obj2]);
    expect(result).toEqual({
      a: { b: { c: 3, d: 2, e: 4 } },
    });
  });
});
