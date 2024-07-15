import { extractLinksAndTags } from "./utils.js";

describe("extractLinksAndTags", () => {
    test("should extract wiki links and tags from markdown", () => {
        const [extractedLinks, extractedTags] = extractLinksAndTags(
            "Here is a link to [[Page One]] and another link to [[Page Two|Title]] #tag1 #tag2 #JaiDécouvert."
        );
        expect(extractedLinks).toEqual(["Page One", "Page Two"]);
        expect(extractedTags).toEqual(["tag1", "tag2", "JaiDécouvert"]);
    });
});
