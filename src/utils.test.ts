import { expect, test } from "vitest";
import { addQuotes } from "./utils";

test("add quotes", () => {
    expect(addQuotes("test")).toBe("test");
    expect(addQuotes("test with space")).toBe('"test with space"');
    expect(addQuotes('"aaa bbb"')).toBe('"aaa bbb"');
});
