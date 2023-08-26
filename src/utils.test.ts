import { expect, test } from "vitest";
import { addQuotes, mergeIDAndName } from "./utils";

test("add quotes", () => {
    expect(addQuotes("test")).toBe("test");
    expect(addQuotes("test with space")).toBe('"test with space"');
    expect(addQuotes('"aaa bbb"')).toBe('"aaa bbb"');
});

test("merge id and name", () => {
    expect(mergeIDAndName(4, "DW_OMORI")).toBe("4:DW_OMORI");
    expect(mergeIDAndName(5, "")).toBe("5");
    expect(mergeIDAndName(10, "This is a test")).toBe(
        '10:"This is a test"',
    );
    expect(mergeIDAndName(10, '"This is a test with quotes"')).toBe(
        '10:"This is a test with quotes"',
    );
});
