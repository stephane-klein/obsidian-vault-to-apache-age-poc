import { extractLinks } from "./utils.js";

describe("extractLinks", () => {
    test("should extract wiki links from markdown", () => {
        const extractedLinks = extractLinks(
            "Here is a link to [[Page One]] and another link to [[Page Two|Title]]."
        );
        expect(extractedLinks).toEqual(["Page One", "Page Two"]);
    });
});
